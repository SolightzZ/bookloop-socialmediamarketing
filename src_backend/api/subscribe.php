<?php

// โหลด config
require_once __DIR__ . '/../config/config.php';

// CORS Headers
header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// จัดการ OPTIONS request (CORS preflight)
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// ตรวจสอบ request method
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
    exit();
}

// รับข้อมูลจาก request
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? $_SERVER["CONTENT_TYPE"] : '';

if (strpos($contentType, "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $email = $input["email"] ?? '';
    $name = $input["name"] ?? '';
} else {
    $email = $_POST["email"] ?? '';
    $name = $_POST["name"] ?? '';
}

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "อีเมลไม่ถูกต้อง กรุณากรอกอีเมลใหม่"
    ]);
    exit();
}

// Validate name
if (empty($name)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอกชื่อ"
    ]);
    exit();
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
                http_response_code(409);
                echo json_encode([
                    "success" => false,
                    "message" => "อีเมลนี้สมัครไว้แล้ว"
                ]);
                exit();
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

// ส่ง Welcome Email
require_once EMAIL_PATH . '/sendMail.php';

$emailResult = ['success' => false, 'error' => ''];
try {
    $emailResult = sendWelcomeEmail($email, $name);
} catch (Exception $e) {
    $emailResult['error'] = $e->getMessage();
}

// ส่ง response
if ($emailResult['success']) {
    echo json_encode([
        "success" => true,
        "message" => "สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ"
    ]);
} else {
    $errorMsg = "สมัครสำเร็จ! แต่ไม่สามารถส่งอีเมลได้: " . ($emailResult['error'] ?: 'ไม่ทราบสาเหตุ');
    echo json_encode([
        "success" => true,
        "message" => $errorMsg
    ]);
}
?>
