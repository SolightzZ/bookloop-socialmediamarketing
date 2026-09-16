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
    $search = $_GET['search'] ?? null;

    if ($level !== null && !Logger::isValidLevel(strtoupper($level))) {
        jsonResponse([
            "success" => false,
            "message" => "Invalid log level"
        ], 400);
    }

    $logs = $logger->getLogs($level ? strtoupper($level) : null, $limit * 2);

    if ($search) {
        $logs = array_filter($logs, function ($log) use ($search) {
            return str_contains(strtolower($log['message']), strtolower($search)) ||
                   str_contains(strtolower(json_encode($log)), strtolower($search));
        });
        $logs = array_slice(array_values($logs), 0, $limit);
    } else {
        $logs = array_slice($logs, 0, $limit);
    }

    $stats = [
        'total' => count($logs),
        'errors' => count(array_filter($logs, fn($l) => $l['level'] === 'ERROR')),
        'warnings' => count(array_filter($logs, fn($l) => $l['level'] === 'WARNING')),
    ];

    jsonResponse([
        "success" => true,
        "stats" => $stats,
        "logs" => array_values($logs)
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