<?php

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กันสมัครรัว + เก็บเกี่ยว email oracle: สูงสุด 10 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('register'), 10, 3600)) {
    jsonResponse(['success' => false, 'message' => 'สมัครสมาชิกบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

$data = getRequestData();
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
// รับตัวแปรสมัครรับข่าวสาร — ค่าเริ่มต้น "ปิดไว้" (false) ผู้ใช้กดเปิดเองเท่านั้น
$subscribeNewsletter = filter_var($data['subscribeNewsletter'] ?? false, FILTER_VALIDATE_BOOLEAN);

if (empty($name) || empty($email) || empty($password)) {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกข้อมูลให้ครบถ้วน'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
}

if (!is_string($password) || strlen($password) < 8) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'], 400);
}

// กัน DoS/ตัดทิ้งเงียบผ่าน bcrypt (72 bytes limit) — ยาวเกินนี้ไม่ปลอดภัยขึ้น
if (strlen($password) > 72) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านต้องมีความยาวไม่เกิน 72 ตัวอักษร'], 400);
}

$existing = findUserByEmail($email);
if ($existing) {
    jsonResponse(['success' => false, 'message' => 'อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ'], 409);
}

$user = createUser($name, $email, $password);
$token = generateToken($user['id']);

// สมัครรับข่าวสารตอนลงทะเบียน (ถ้าผู้ใช้กดเปิดเองในฟอร์ม)
if ($subscribeNewsletter) {
    require_once __DIR__ . '/../Services/Subscribers.php';
    $subscriberFile = SUBSCRIBERS_PATH;
    if (!isEmailSubscribed($email, $subscriberFile)) {
        appendSubscriber($subscriberFile, $email);
    }
    // ยืนยันการสมัครรับข่าวสารแบบ non-blocking
    register_shutdown_function(function () use ($email, $name) {
        require_once __DIR__ . '/../Services/emailService.php';
        try {
            sendConfirmationEmailService($email, $name);
        } catch (Throwable $e) {
            // email fail ไม่กระทบ register — แต่ต้องเห็นใน console
            error_log("[BookLoop][ERROR] register confirmation email failed: " . $e->getMessage() . " to={$email}");
        }
    });
}

unset($user['password']);

// ส่ง Welcome Email แบบ non-blocking — ไม่รอ SMTP ให้เสียเวลา
// (ถ้า SMTP timeout 15s user จะรอฟรี ทั้งที่ register สำเร็จแล้ว)
register_shutdown_function(function () use ($email, $name) {
    require_once __DIR__ . '/../Services/emailService.php';
    try {
        sendWelcomeEmailService($email, $name);
    } catch (Throwable $e) {
        // email fail ไม่กระทบ register — log ไว้เฉยๆ + console
        error_log("[BookLoop][ERROR] register welcome email failed: " . $e->getMessage() . " to={$email}");
    }
});

jsonResponse([
    'success' => true,
    'user' => $user,
    'token' => $token,
    'emailSent' => false, // ส่งแบบ non-blocking ไม่รู้ผลทันที
    'subscribeNewsletter' => $subscribeNewsletter, // สะท้อนค่า off/on ที่ PHP รับไว้
], 201);
