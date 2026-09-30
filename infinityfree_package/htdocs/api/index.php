<?php
// BookLoop API — หน้า directory ของ /api/ (เปิด https://.../api/ ตรงๆ ได้)
// กัน Options -Indexes ส่ง 403 แล้วโฮสต์ redirect ไปหน้า error ของตัวเอง
// ไฟล์นี้ standalone (ไม่ require config/.env) จึงเปิดได้แม้ .env ยังไม่ถูกสร้าง
// และไม่มีข้อมูลลับ — แค่รายชื่อ endpoint

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// CORS แบบเปิด (public listing ไม่มีข้อมูลลับ/cookie จึงสะท้อน origin ได้ปลอดภัย)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ?check-origin=https://example.com — ตรวจว่า origin นี้ผ่าน allow-list ของเซิร์ฟเวอร์หรือไม่
// เปิดในเบราว์เซอร์ได้เลย (ไฟล์นี้ส่ง ACAO แบบเปิดจึงไม่ติด CORS) — ตอบ allowed:true/false พร้อมสาเหตุ
// ใช้แยกให้ออกว่า "CORS error ใน console" มาจาก .env หาย vs ALLOWED_ORIGIN ขาด origin นี้
if (isset($_GET['check-origin'])) {
    $query = trim((string)$_GET['check-origin']);
    $result = ['success' => true, 'origin' => $query, 'allowed' => false, 'reason' => ''];
    try {
        require_once __DIR__ . '/../config/config.php';
        $allowed = array_map('trim', explode(',', ALLOWED_ORIGIN));
        if (in_array('*', $allowed, true)) {
            $result['allowed'] = true;
        } elseif ($query !== '' && in_array($query, $allowed, true)) {
            $result['allowed'] = true;
        } else {
            $result['reason'] = 'origin นี้ไม่อยู่ใน ALLOWED_ORIGIN บนเซิร์ฟเวอร์ — เพิ่มเข้าไฟล์ htdocs/.env แล้วลองใหม่';
        }
    } catch (Throwable $e) {
        $result['reason'] = 'โหลด config ไม่ได้: ' . $e->getMessage();
    }
    http_response_code(200);
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// รายชื่อ endpoint จากไฟล์จริงในโฟลเดอร์นี้ (เพิ่มไฟล์ใหม่แล้วจะโผล่เอง)
$files = glob(__DIR__ . '/*.php') ?: [];
$endpoints = [];
foreach ($files as $f) {
    $base = basename($f);
    if ($base === 'index.php') {
        continue;
    }
    $endpoints[] = '/api/' . $base;
}
sort($endpoints);

http_response_code(200);
echo json_encode([
    'success' => true,
    'service' => 'bookloop-api',
    'php' => PHP_VERSION,
    'time' => date('c'),
    'count' => count($endpoints),
    'endpoints' => $endpoints,
    'usage' => 'เรียกไฟล์ตรงๆ เช่น /api/auth_me.php (ดูวิธีใช้เต็มที่หน้า /)',
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
