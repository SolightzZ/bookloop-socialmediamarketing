<?php

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Logger.php';
require_once BASE_PATH . '/Services/Http.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
        "success" => false,
        "message" => "Method not allowed"
    ], 405);
}

// กันยิง log รัวเพื่อปั่นไฟล์โต/กลบหลักฐาน: สูงสุด 60 ครั้งต่อนาทีต่อ IP
if (!rateLimitCheck(clientRateLimitKey('log'), 60, 60)) {
    jsonResponse([
        "success" => false,
        "message" => "ส่ง log บ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่"
    ], 429);
}

$input = json_decode(file_get_contents("php://input"), true);

$level = strtoupper($input["level"] ?? 'ERROR');
// ตัด newline กัน log forgery (attacker ฝัง \n ปลอมเป็น log บรรทัดอื่นไม่ได้)
$message = str_replace(["\r", "\n"], ' ', mb_substr((string)($input["message"] ?? ''), 0, 2000));
$context = $input["context"] ?? [];
if (!is_array($context)) {
    $context = ['value' => mb_substr((string) $context, 0, 500)];
}
// กัน context ก้อนยักษ์ (nested array) ทำให้ไฟล์ log บวม
if (strlen(json_encode($context, JSON_UNESCAPED_UNICODE)) > 2048) {
    jsonResponse([
        "success" => false,
        "message" => "Context ใหญ่เกินไป (สูงสุด 2KB)"
    ], 400);
}

$validLevels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];
if (!in_array($level, $validLevels, true)) {
    jsonResponse([
        "success" => false,
        "message" => "Invalid log level. Must be: " . implode(', ', $validLevels)
    ], 400);
}

if (empty($message)) {
    jsonResponse([
        "success" => false,
        "message" => "Message is required"
    ], 400);
}

$logger = Logger::getInstance();

$context['ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
$context['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
$context['request_uri'] = $_SERVER['REQUEST_URI'] ?? '';

$logger->log($level, $message, $context);

jsonResponse([
    "success" => true,
    "message" => "Log recorded successfully"
]);
