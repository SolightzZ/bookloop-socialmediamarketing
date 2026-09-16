<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$data = getRequestData();
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกอีเมลและรหัสผ่าน'], 400);
}

$user = findUserByEmail($email);

if (!$user || $user['password'] !== $password) {
    jsonResponse(['success' => false, 'message' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'], 401);
}

$token = generateToken($user['id']);

unset($user['password']);

jsonResponse([
    'success' => true,
    'user' => $user,
    'token' => $token,
]);
