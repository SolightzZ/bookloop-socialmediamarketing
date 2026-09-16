<?php

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Logger.php';
require_once BASE_PATH . '/Services/Http.php';

corsHeaders();

$logger = Logger::getInstance();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $level = $_GET['level'] ?? null;
    // cap limit กันคำขอ limit มหาศาลที่ทำให้อ่านไฟล์ log ทั้งหมด
    $limit = min(500, max(1, intval($_GET['limit'] ?? 100)));

    if ($level !== null && !Logger::isValidLevel(strtoupper($level))) {
        jsonResponse([
            "success" => false,
            "message" => "Invalid log level"
        ], 400);
    }

    $logs = $logger->getLogs($level ? strtoupper($level) : null, $limit);

    jsonResponse([
        "success" => true,
        "count" => count($logs),
        "logs" => $logs
    ]);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $deleted = $logger->clearLogs();

    jsonResponse([
        "success" => $deleted,
        "message" => $deleted ? "Logs cleared successfully" : "Failed to clear logs"
    ]);
}

jsonResponse([
    "success" => false,
    "message" => "Method not allowed"
], 405);
