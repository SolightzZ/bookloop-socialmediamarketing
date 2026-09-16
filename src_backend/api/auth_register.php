<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$data = getRequestData();
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกข้อมูลให้ครบถ้วน'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
}

if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'], 400);
}

$existing = findUserByEmail($email);
if ($existing) {
    jsonResponse(['success' => false, 'message' => 'อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ'], 409);
}

$user = createUser($name, $email, $password);
$token = generateToken($user['id']);

unset($user['password']);

// ส่ง Welcome Email
require_once __DIR__ . '/../Services/emailService.php';
$emailResult = ['success' => false, 'error' => ''];
try {
    $emailResult = sendWelcomeEmailService($email, $name);
} catch (Exception $e) {
    $emailResult['error'] = $e->getMessage();
}

jsonResponse([
    'success' => true,
    'user' => $user,
    'token' => $token,
    'emailSent' => $emailResult['success'],
], 201);
