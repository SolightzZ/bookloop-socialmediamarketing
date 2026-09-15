<?php

require_once __DIR__ . '/../auth/auth.php';
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

// ตรวจสอบ email ซ้ำใน subscribers.txt
$subscriberFile = EMAIL_PATH . '/subscribers.txt';
if (file_exists($subscriberFile)) {
    $lines = file($subscriberFile, FILE_IGNORE_NEW_LINES);
    foreach ($lines as $line) {
        if (trim($line) === $email) {
            jsonResponse(['success' => false, 'message' => 'อีเมลนี้สมัครรับข่าวสารไว้แล้ว'], 409);
        }
    }
}

// บันทึกลง subscribers.txt
file_put_contents(
    $subscriberFile,
    $email . "\n",
    FILE_APPEND
);

// ดึงชื่อจาก users.json ถ้ามี
$user = findUserByEmail($email);
$userName = $user ? $user['name'] : 'สมาชิก BookLoop';

// ส่ง Confirmation Email
$emailResult = ['success' => false, 'error' => ''];
try {
    $emailResult = sendConfirmationEmailService($email, $userName);
} catch (Exception $e) {
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
