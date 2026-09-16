<?php

require_once __DIR__ . '/../config/config.php';

class Logger
{
    private string $logFile;
    private static ?Logger $instance = null;

    private const LEVELS = [
        'DEBUG' => 0,
        'INFO' => 1,
        'WARNING' => 2,
        'ERROR' => 3,
        'CRITICAL' => 4,
    ];

    private function __construct()
    {
        $this->logFile = DATA_PATH . '/' . LOG_FILE;
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function debug(string $message, array $context = []): void
    {
        $this->log('DEBUG', $message, $context);
    }

    public function info(string $message, array $context = []): void
    {
        $this->log('INFO', $message, $context);
    }

    public function warning(string $message, array $context = []): void
    {
        $this->log('WARNING', $message, $context);
    }

    public function error(string $message, array $context = []): void
    {
        $this->log('ERROR', $message, $context);
    }

    public function critical(string $message, array $context = []): void
    {
        $this->log('CRITICAL', $message, $context);
    }

    /** Reusable: เช็ค level ที่อนุญาต ใช้ทั้ง /api/log.php /api/logs.php /api/request_log.php */
    public static function isValidLevel(string $level): bool
    {
        return isset(self::LEVELS[$level]);
    }

    /** Reusable: รายชื่อ level ทั้งหมด */
    public static function validLevels(): array
    {
        return array_keys(self::LEVELS);
    }

    // public เพื่อให้ /api/log.php เรียกตรงด้วย level ที่ validate แล้ว (แทน switch ที่ซ้ำ)
    public function log(string $level, string $message, array $context = []): void
    {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? ' ' . json_encode($context, JSON_UNESCAPED_UNICODE) : '';
        $logLine = "[{$timestamp}] [{$level}] {$message}{$contextStr}" . PHP_EOL;

        file_put_contents($this->logFile, $logLine, FILE_APPEND | LOCK_EX);
    }

    public function getLogs(?string $level = null, int $limit = 100): array
    {
        if (!file_exists($this->logFile)) {
            return [];
        }

        $lines = file($this->logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $lines = array_reverse($lines);

        $logs = [];
        foreach ($lines as $line) {
            if ($level !== null && !str_contains($line, "[{$level}]")) {
                continue;
            }

            $parsed = $this->parseLogLine($line);
            if ($parsed) {
                $logs[] = $parsed;
            }

            if (count($logs) >= $limit) {
                break;
            }
        }

        return $logs;
    }

    private function parseLogLine(string $line): ?array
    {
        if (preg_match('/^\[(.+?)\] \[(\w+)\] (.+)$/', $line, $matches)) {
            return [
                'timestamp' => $matches[1],
                'level' => $matches[2],
                'message' => $matches[3],
            ];
        }
        return null;
    }

    public function clearLogs(): bool
    {
        return file_put_contents($this->logFile, '') !== false;
    }

    public function getLogFilePath(): string
    {
        return $this->logFile;
    }
}
