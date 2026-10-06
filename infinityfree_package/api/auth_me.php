<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

// รับทั้ง GET (เดิม) และ POST — frontend เรียกผ่าน POST เป็นหลักเพื่อให้ token
// อยู่ใน JSON body แทน query (กัน token รั่วผ่าน access log/history/referer)
// โฮสต์ตัด Authorization header ทิ้ง จึงใช้ field `token` ใน body แทน
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$token = getBearerToken();

if (!$token) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบ token กรุณาเข้าสู่ระบบ'], 401);
}

$userId = validateToken($token);

if (!$userId) {
    jsonResponse(['success' => false, 'message' => 'Token หมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่'], 401);
}

$user = findUserById($userId);

if (!$user) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบข้อมูลผู้ใช้งาน'], 404);
}

unset($user['password']);

jsonResponse([
    'success' => true,
    'user' => $user,
]);
