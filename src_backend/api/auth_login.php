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

// ตรวจด้วย password_verify ก่อน ถ้าไม่ผ่านค่อยเทียบตรงสำหรับบัญชีเก่า (plaintext) แล้วอัปเกรดเป็น hash
$passwordOk = false;
if ($user) {
    if (verifyPassword($password, $user['password'])) {
        $passwordOk = true;
    } elseif ($user['password'] === $password) {
        $passwordOk = true;
        updateUser($user['id'], ['password' => hashPassword($password)]);
    }
}

if (!$passwordOk) {
    jsonResponse(['success' => false, 'message' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'], 401);
}

$token = generateToken($user['id']);

unset($user['password']);

jsonResponse([
    'success' => true,
    'user' => $user,
    'token' => $token,
]);
