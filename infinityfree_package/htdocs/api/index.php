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
