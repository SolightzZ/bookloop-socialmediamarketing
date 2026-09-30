<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

$data = getRequestData();
$password = $data['password'] ?? '';

$user = findUserById($userId);

if (!$user) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบข้อมูลผู้ใช้งาน'], 404);
}

// รองรับทั้งบัญชีที่เป็น hash แล้วและบัญชีเก่าที่ยังเป็น plaintext
$passwordOk = verifyPassword($password, $user['password']) || $user['password'] === $password;

if (empty($password) || !$passwordOk) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'], 401);
}

if (!deleteUser($userId)) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถลบบัญชีได้ กรุณาลองใหม่'], 500);
}

jsonResponse([
    'success' => true,
    'message' => 'ลบบัญชีสำเร็จ ขอบคุณที่ใช้บริการ BookLoop',
]);