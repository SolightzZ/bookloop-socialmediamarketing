<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
$allowedFields = ['name', 'phone', 'bio', 'address', 'avatar'];
$updates = [];

foreach ($allowedFields as $field) {
    if (array_key_exists($field, $data)) {
        $updates[$field] = $data[$field];
    }
}

if (empty($updates)) {
    jsonResponse(['success' => false, 'message' => 'ไม่มีข้อมูลที่ต้องการอัปเดต'], 400);
}

$updatedUser = updateUser($userId, $updates);

if (!$updatedUser) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบข้อมูลผู้ใช้งาน'], 404);
}

unset($updatedUser['password_hash'], $updatedUser['salt']);

jsonResponse([
    'success' => true,
    'user' => $updatedUser,
]);
