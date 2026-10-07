<?php

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/Subscribers.php';
require_once BASE_PATH . '/Services/BackgroundMail.php';

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
$subscriberFile = SUBSCRIBERS_PATH;
if (isEmailSubscribed($email, $subscriberFile)) {
    jsonResponse(['success' => false, 'message' => 'อีเมลนี้สมัครรับข่าวสารไว้แล้ว'], 409);
}

appendSubscriber($subscriberFile, $email);

// ดึงชื่อจาก users.json ถ้ามี หรือจาก payload (หากไม่ได้เข้าสู่ระบบให้ใช้อีเมลที่กรอก)
$user = findUserByEmail($email);
$userName = !empty($data['name']) ? trim($data['name']) : ($user ? $user['name'] : $email);

// ส่ง Confirmation Email แบบ non-blocking — ตอบ user ทันทีหลังบันทึก (pattern
// เดียวกับ subscribe.php/auth_register.php) กัน SMTP 5–15s บล็อก response
runAfterResponse(function () use ($email, $userName) {
    require_once BASE_PATH . '/Services/emailService.php';
    try {
        $result = sendConfirmationEmailService($email, $userName);
        if (empty($result['success'])) {
            error_log("[BookLoop][WARNING] subscribe_newsletter email failed: " . ($result['error'] ?? 'unknown') . " to={$email}");
        }
    } catch (Throwable $e) {
        // TimeoutException เป็น Error ไม่ใช่ Exception — ต้อง catch Throwable
        error_log("[BookLoop][ERROR] subscribe_newsletter email exception: " . $e->getMessage() . " to={$email}");
    }
});

// ส่ง response ทันที ไม่รอ SMTP (email fail ดูใน error log — ไม่กระทบการสมัคร)
jsonResponse([
    'success' => true,
    'message' => 'สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ',
]);
