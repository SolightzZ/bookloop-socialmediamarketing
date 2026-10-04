<?php

// POST /api/listings_update.php — แก้ไขข้อมูลและรูปภาพรายการลงขาย (ต้องล็อกอิน; ส่ง token)
// body: { token, id, title?, author?, isbn?, category?, condition?, price?, originalPrice?, defects?, story?, image? }

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กันยิงรัว: 60 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('listings_update'), 60, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

if (!defined('LISTINGS_FILE')) {
    define('LISTINGS_FILE', DATA_PATH . '/listings.json');
}

$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
if ($userId === null) {
    jsonResponse(['success' => false, 'message' => 'กรุณาเข้าสู่ระบบก่อนแก้ไขรายการ'], 401);
}

$data = getRequestData();
$id = trim((string) ($data['id'] ?? ''));

if ($id === '') {
    jsonResponse(['success' => false, 'message' => 'กรุณาระบุ id รายการที่ต้องการแก้ไข'], 400);
}

$listings = loadJson(LISTINGS_FILE);
$foundIndex = null;
foreach ($listings as $i => $l) {
    if (($l['id'] ?? '') === $id) {
        $foundIndex = $i;
        break;
    }
}

if ($foundIndex === null) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบรายการลงขายนี้ในระบบ'], 404);
}

$listing = $listings[$foundIndex];

// ตรวจสอบสิทธิ์ความเป็นเจ้าของรายการ
if (($listing['userId'] ?? '') !== $userId && ($listing['userId'] ?? '') !== 'guest') {
    jsonResponse(['success' => false, 'message' => 'คุณไม่มีสิทธิ์แก้ไขรายการของผู้อื่น'], 403);
}

// อัปเดตข้อมูลตามที่ส่งมา
if (isset($data['title']) && trim((string)$data['title']) !== '') {
    $listing['title'] = mb_substr(trim((string)$data['title']), 0, 120);
}

if (isset($data['author'])) {
    $listing['author'] = mb_substr(trim((string)$data['author']), 0, 120);
}

if (isset($data['isbn'])) {
    $listing['isbn'] = mb_substr(trim((string)$data['isbn']), 0, 32);
}

if (isset($data['category']) && trim((string)$data['category']) !== '') {
    $listing['category'] = mb_substr(trim((string)$data['category']), 0, 64);
}

if (isset($data['condition']) && trim((string)$data['condition']) !== '') {
    $listing['condition'] = mb_substr(trim((string)$data['condition']), 0, 32);
}

if (isset($data['price']) && is_numeric($data['price'])) {
    $price = (float) $data['price'];
    if ($price >= 1 && $price <= 999999) {
        $listing['price'] = round($price, 2);
    }
}

if (isset($data['originalPrice'])) {
    if ($data['originalPrice'] === '' || $data['originalPrice'] === null) {
        $listing['originalPrice'] = null;
    } elseif (is_numeric($data['originalPrice']) && (float) $data['originalPrice'] >= 0) {
        $listing['originalPrice'] = round((float) $data['originalPrice'], 2);
    }
}

if (isset($data['defects'])) {
    $listing['defects'] = mb_substr(trim((string)$data['defects']), 0, 2000);
}

if (isset($data['story'])) {
    $listing['story'] = mb_substr(trim((string)$data['story']), 0, 2000);
}

// ─── การจัดการรูปภาพใหม่ ───
$imageInput = trim((string) ($data['image'] ?? ''));
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
        $listing['image'] = 'images/listings/' . $fileName;
    } elseif (preg_match('~^https?://~i', $imageInput)) {
        if (strlen($imageInput) > 2048) {
            jsonResponse(['success' => false, 'message' => 'URL รูปภาพยาวเกินไป'], 400);
        }
        $listing['image'] = $imageInput;
    }
}

$listing['updatedAt'] = date('c');
$listings[$foundIndex] = $listing;

if (!saveJson(LISTINGS_FILE, $listings)) {
    jsonResponse(['success' => false, 'message' => 'บันทึกการแก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse([
    'success' => true,
    'message' => 'บันทึกการแก้ไขเรียบร้อยแล้ว',
    'listing' => $listing,
]);
