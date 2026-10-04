<?php

// POST /api/listings_create.php — ลงขายหนังสือมือสอง (ล็อกอินได้ไม่บังคับ; มี token → ผูก userId)
// body: { title, author?, isbn?, category, condition, price, originalPrice?, defects?, story?, image? }
// image รับ dataURL (jpeg/png/webp ≤ 3MB → เซฟไฟล์ images/listings/) หรือ URL ตรง (≤2048 ตัวอักษร)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กันสแปมลงขาย: 20 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('listings_create'), 20, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ลงขายบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

if (!defined('LISTINGS_FILE')) {
    define('LISTINGS_FILE', DATA_PATH . '/listings.json');
}

// ผูกเจ้าของเมื่อมี session (guest ลงได้เป็น userId = 'guest')
$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
$ownerId = $userId ?? 'guest';

$data = getRequestData();

$title = trim((string) ($data['title'] ?? ''));
$category = trim((string) ($data['category'] ?? ''));
$condition = trim((string) ($data['condition'] ?? ''));
$price = $data['price'] ?? null;

if ($title === '' || mb_strlen($title) > 120) {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกชื่อหนังสือ (ไม่เกิน 120 ตัวอักษร)'], 400);
}
if ($category === '' || mb_strlen($category) > 64) {
    jsonResponse(['success' => false, 'message' => 'กรุณาเลือกหมวดหมู่หนังสือ'], 400);
}
if ($condition === '' || mb_strlen($condition) > 32) {
    jsonResponse(['success' => false, 'message' => 'กรุณาระบุสภาพหนังสือ'], 400);
}
if (!is_numeric($price) || (float) $price < 1 || (float) $price > 999999) {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกราคาขายที่ถูกต้อง (1–999,999 บาท)'], 400);
}

$originalPrice = null;
if (isset($data['originalPrice']) && $data['originalPrice'] !== '' && $data['originalPrice'] !== null) {
    if (!is_numeric($data['originalPrice']) || (float) $data['originalPrice'] < 0) {
        jsonResponse(['success' => false, 'message' => 'ราคาปกไม่ถูกต้อง'], 400);
    }
    $originalPrice = round((float) $data['originalPrice'], 2);
}

// ─── image: dataURL → เซฟไฟล์ / URL ตรง → เก็บ string ───
$imageInput = trim((string) ($data['image'] ?? ''));
$imagePath = '';
if ($imageInput !== '') {
    if (str_starts_with($imageInput, 'data:image/')) {
        if (!preg_match('~^data:image/(jpeg|jpg|png|webp);base64,~i', $imageInput, $m)) {
            jsonResponse(['success' => false, 'message' => 'รูปแบบรูปภาพไม่รองรับ (ใช้ JPG/PNG/WebP)'], 400);
        }
        $ext = strtolower($m[1]) === 'jpg' ? 'jpeg' : strtolower($m[1]);
        $binary = base64_decode(substr($imageInput, strpos($imageInput, ',') + 1), true);
        if ($binary === false || strlen($binary) === 0 || strlen($binary) > 3 * 1024 * 1024) {
            jsonResponse(['success' => false, 'message' => 'รูปภาพใหญ่เกินไป (สูงสุด 3MB)'], 400);
        }
        $dir = IMAGES_PATH . '/listings';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $fileName = 'lst_' . bin2hex(random_bytes(8)) . '.' . $ext;
        if (file_put_contents($dir . '/' . $fileName, $binary, LOCK_EX) === false) {
            jsonResponse(['success' => false, 'message' => 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง'], 500);
        }
        $imagePath = 'images/listings/' . $fileName;
    } elseif (preg_match('~^https?://~i', $imageInput)) {
        if (strlen($imageInput) > 2048) {
            jsonResponse(['success' => false, 'message' => 'URL รูปภาพยาวเกินไป'], 400);
        }
        $imagePath = $imageInput;
    } else {
        jsonResponse(['success' => false, 'message' => 'ข้อมูลรูปภาพไม่ถูกต้อง'], 400);
    }
}

if ($imagePath === '') {
    jsonResponse(['success' => false, 'message' => 'กรุณาอัปโหลดรูปถ่ายหนังสือ'], 400);
}

$listings = loadJson(LISTINGS_FILE);
$existingIds = [];
foreach ($listings as $l) {
    $existingIds[$l['id'] ?? ''] = true;
}
do {
    $id = 'LST-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
} while (isset($existingIds[$id]));

$now = date('c');
$listing = [
    'id' => $id,
    'userId' => $ownerId,
    'title' => mb_substr($title, 0, 120),
    'author' => mb_substr(trim((string) ($data['author'] ?? '')), 0, 120),
    'isbn' => mb_substr(trim((string) ($data['isbn'] ?? '')), 0, 32),
    'category' => mb_substr($category, 0, 64),
    'condition' => mb_substr($condition, 0, 32),
    'price' => round((float) $price, 2),
    'originalPrice' => $originalPrice,
    'defects' => mb_substr(trim((string) ($data['defects'] ?? '')), 0, 2000),
    'story' => mb_substr(trim((string) ($data['story'] ?? '')), 0, 2000),
    'image' => $imagePath,
    'status' => 'pending',
    'createdAt' => $now,
    'updatedAt' => $now,
];

array_unshift($listings, $listing);
if (!saveJson(LISTINGS_FILE, $listings)) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถบันทึกการลงขายได้ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse(['success' => true, 'message' => 'รับเรื่องลงขายแล้ว รอการตรวจสอบอนุมัติ', 'listing' => $listing], 201);
