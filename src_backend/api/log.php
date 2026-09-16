<?php

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Logger.php';
require_once BASE_PATH . '/Services/Http.php';

corsHeaders();

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
        "success" => false,
        "message" => "Method not allowed"
    ], 405);
}

$input = json_decode(file_get_contents("php://input"), true);

$level = strtoupper($input["level"] ?? 'ERROR');
$message = mb_substr((string)($input["message"] ?? ''), 0, 2000);
$context = $input["context"] ?? [];

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
