<?php

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/Subscribers.php';
require_once __DIR__ . '/../Services/emailService.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$data = getRequestData();
$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
}

// ตรวจสอบ email ซ้ำ + บันทึก ผ่าน helper กลาง (Subscribers.php)
$subscriberFile = EMAIL_PATH . '/subscribers.txt';
if (isEmailSubscribed($email, $subscriberFile)) {
    jsonResponse(['success' => false, 'message' => 'อีเมลนี้สมัครรับข่าวสารไว้แล้ว'], 409);
}

appendSubscriber($subscriberFile, $email);

// ดึงชื่อจาก users.json ถ้ามี
$user = findUserByEmail($email);
$userName = $user ? $user['name'] : 'สมาชิก BookLoop';

// ส่ง Confirmation Email (catch Throwable เพราะ TimeoutException เป็น Error ไม่ใช่ Exception)
$emailResult = ['success' => false, 'error' => ''];
try {
    $emailResult = sendConfirmationEmailService($email, $userName);
} catch (Throwable $e) {
    $emailResult['error'] = $e->getMessage();
}

if ($emailResult['success']) {
    jsonResponse([
        'success' => true,
        'message' => 'สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ',
    ]);
} else {
    jsonResponse([
        'success' => true,
        'message' => 'สมัครสำเร็จ! แต่ไม่สามารถส่งอีเมลได้: ' . ($emailResult['error'] ?: 'ไม่ทราบสาเหตุ'),
    ]);
}
