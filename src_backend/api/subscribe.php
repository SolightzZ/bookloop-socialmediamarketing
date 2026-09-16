<?php

// โหลด config + helpers กลาง
require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Http.php';

corsHeaders();

// ตรวจสอบ request method
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
        "success" => false,
        "message" => "Method not allowed"
    ], 405);
}

// รับข้อมูลจาก request
$input = getRequestData();
$email = $input["email"] ?? '';
$name = $input["name"] ?? '';

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse([
        "success" => false,
        "message" => "อีเมลไม่ถูกต้อง กรุณากรอกอีเมลใหม่"
    ], 400);
}

// Validate name
if (empty($name)) {
    jsonResponse([
        "success" => false,
        "message" => "กรุณากรอกชื่อ"
    ], 400);
}

// บันทึกข้อมูลลงไฟล์
$subscriberFile = EMAIL_PATH . '/' . SUBSCRIBERS_FILE;
$subscriberData = [
    "email" => $email,
    "name" => $name,
    "subscribed_at" => date('c'),
    "status" => "active",
    "source" => "newsletter_form"
];

// ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
if (file_exists($subscriberFile)) {
    $lines = file($subscriberFile, FILE_IGNORE_NEW_LINES);
    foreach ($lines as $line) {
        if (!empty(trim($line))) {
            $existing = json_decode($line, true);
            if ($existing && $existing["email"] === $email) {
                jsonResponse([
                    "success" => false,
                    "message" => "อีเมลนี้สมัครไว้แล้ว"
                ], 409);
            }
        }
    }
}

// บันทึกลงไฟล์
file_put_contents(
    $subscriberFile,
    json_encode($subscriberData) . "\n",
    FILE_APPEND | LOCK_EX
);

// ส่ง Welcome Email แบบ non-blocking — ไม่รอ SMTP
register_shutdown_function(function () use ($email, $name) {
    require_once EMAIL_PATH . '/sendMail.php';
    try {
        sendWelcomeEmail($email, $name);
    } catch (Throwable $e) {
        // email fail ไม่กระทบ subscribe
    }
});

// ส่ง response ทันที ไม่รอ email
jsonResponse([
    "success" => true,
    "message" => "สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ"
]);
