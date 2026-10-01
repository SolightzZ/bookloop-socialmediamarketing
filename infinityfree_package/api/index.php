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
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, ngrok-skip-browser-warning');

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
        // ใช้ตัวช่วยชุดเดียวกับ corsHeaders() จริง จะได้ไม่มีเคส "เช็กผ่านแต่ยิงจริงไม่ผ่าน"
        // (รองรับ wildcard ในชื่อ host + ตัด trailing slash ให้เหมือนตอนเทียบจริง)
        require_once __DIR__ . '/../Services/Http.php';
        $allowed = allowedOrigins();
        $normalized = rtrim(trim($query), '/');
        if (in_array('*', $allowed, true) || ($normalized !== '' && isOriginAllowed($normalized, $allowed))) {
            $result['allowed'] = true;
            // host ตรง แต่ค่าที่ตรวจมามี path เกินมา — เบราว์เซอร์จะไม่ส่งแบบนี้
            // เตือนไว้เพราะเป็นความเข้าใจผิดที่ทำให้คนใส่ path ลงใน ALLOWED_ORIGIN
            if (preg_match('~^https?://[^/]+/~i', $normalized)) {
                $result['reason'] = 'host ตรงกับ allow-list แต่ค่าที่ตรวจมามี path เกินมา — '
                    . 'เบราว์เซอร์ส่ง Origin แค่ scheme://host:port เสมอ ให้ใส่แต่ host ใน ALLOWED_ORIGIN';
            }
        } else {
            $result['reason'] = 'origin นี้ไม่อยู่ใน ALLOWED_ORIGIN บนเซิร์ฟเวอร์ — ใส่แบบ origin ล้วน '
                . '(ไม่มี path/trailing slash) แล้วอัปโหลดไฟล์ .env ใหม่';
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
