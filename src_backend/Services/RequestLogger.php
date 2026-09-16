<?php

class RequestLogger
{
    private string $logFile;
    private float $startTime;
    private static ?RequestLogger $instance = null;

    // เก็บ log ไว้ใน memory ก่อน ไม่เขียนทุกครั้ง (ลด disk I/O per request)
    private static array $buffer = [];
    private static bool $shutdownRegistered = false;

    private function __construct()
    {
        $this->logFile = DATA_PATH . '/' . REQUEST_LOG_FILE;
        $this->startTime = microtime(true);

        // flush buffer ลงไฟล์ครั้งเดียวตอน request จบ (ไม่ต้องเขียน 2 ครั้ง/req)
        if (!self::$shutdownRegistered) {
            self::$shutdownRegistered = true;
            register_shutdown_function([self::class, 'flushBuffer']);
        }
    }

    public static function init(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function logRequest(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '::1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $this->buffer('INFO', "incoming_request", [
            'method' => $method,
            'uri' => $uri,
            'ip' => $ip,
            'user_agent' => substr($userAgent, 0, 100),
        ]);
    }

    public function logResponse(int $statusCode): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $duration = round((microtime(true) - $this->startTime) * 1000, 2);

        $level = match(true) {
            $statusCode >= 500 => 'ERROR',
            $statusCode >= 400 => 'WARNING',
            default => 'INFO',
        };

        $this->buffer($level, "response", [
            'method' => $method,
            'uri' => $uri,
            'status' => $statusCode,
            'duration_ms' => $duration,
        ]);
    }

    public function logError(string $message, array $context = []): void
    {
        $this->buffer('ERROR', $message, $context);
    }

    public function logWarning(string $message, array $context = []): void
    {
        $this->buffer('WARNING', $message, $context);
    }

    public function logInfo(string $message, array $context = []): void
    {
        $this->buffer('INFO', $message, $context);
    }

    // เก็บ log ไว้ใน array ชั่วคราว (ไม่เขียนไฟล์)
    private function buffer(string $level, string $message, array $context = []): void
    {
        $timestamp = date('Y-m-d H:i:s');
        $method = $_SERVER['REQUEST_METHOD'] ?? '-';
        $uri = $_SERVER['REQUEST_URI'] ?? '-';
        $contextStr = !empty($context) ? ' ' . json_encode($context, JSON_UNESCAPED_UNICODE) : '';

        self::$buffer[] = "[{$timestamp}] [{$level}] [{$method} {$uri}] {$message}{$contextStr}" . PHP_EOL;
    }

    // เขียนลงไฟล์ครั้งเดียวตอน shutdown (ลด LOCK_EX จาก 2 เหลือ 1 ต่อ request)
    public static function flushBuffer(): void
    {
        if (!empty(self::$buffer)) {
            file_put_contents(
                self::getLogFile(),
                implode('', self::$buffer),
                FILE_APPEND | LOCK_EX
            );
            self::$buffer = [];
        }
    }

    private static function getLogFile(): string
    {
        return DATA_PATH . '/' . REQUEST_LOG_FILE;
    }
}

// ─── Auto Bootstrap ──────────────────────────────────────────
$requestLogger = RequestLogger::init();
$requestLogger->logRequest();

// logResponse เรียกจาก shutdown function ของ RequestLogger แล้ว (flushBuffer)
// ไม่ต้อง register_shutdown_function ซ้ำ

// จับ fatal errors แยก (เขียนทันทีไม่ต้อง buffer เพราะเกิด error จริงจัง)
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        $timestamp = date('Y-m-d H:i:s');
        $context = json_encode([
            'type' => $error['type'],
            'message' => $error['message'],
            'file' => $error['file'],
            'line' => $error['line'],
        ], JSON_UNESCAPED_UNICODE);
        $logLine = "[{$timestamp}] [ERROR] [fatal_error] {$context}" . PHP_EOL;
        file_put_contents(DATA_PATH . '/' . REQUEST_LOG_FILE, $logLine, FILE_APPEND | LOCK_EX);
    }

    // logResponse + flush buffer ที่เหลือ
    $statusCode = http_response_code();
    $requestLogger = RequestLogger::init();
    $requestLogger->logResponse($statusCode);
    RequestLogger::flushBuffer();
});

set_error_handler(function ($severity, $message, $file, $line) {
    RequestLogger::init()->logWarning("php_error", [
        'severity' => $severity,
        'message' => $message,
        'file' => $file,
        'line' => $line,
    ]);
    return false;
});

set_exception_handler(function (Throwable $e) {
    RequestLogger::init()->logError("uncaught_exception", [
        'class' => get_class($e),
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ]);
    RequestLogger::flushBuffer();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal server error']);
    exit();
});