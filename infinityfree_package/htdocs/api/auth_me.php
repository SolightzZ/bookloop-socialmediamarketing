<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
