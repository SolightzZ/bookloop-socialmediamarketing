<?php

// Backend นี้ตอบ application/json เท่านั้น — ห้ามปล่อย PHP warning/notice
// ปนออกมาเป็น HTML (error ยังถูกเก็บผ่าน RequestLogger/error_log ตามปกติ)
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Emergency handler ตั้งแต่บรรทัดแรกของ boot — ถ้า .env หาย/parse พัง (เกิดก่อน
// RequestLogger ได้ register handler ตัวเต็ม) ต้องตอบ JSON 500 ไม่ใช่หน้า HTML ของโฮสต์
// พอ require RequestLogger ด้านล่าง handler ตัวเต็มจะมาแทนที่ตัวนี้เอง
set_exception_handler(function ($e) {
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    http_response_code(500);
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
    $message = ($e instanceof Throwable) ? $e->getMessage() : 'Unknown boot error';
    error_log('[BookLoop boot] ' . $message);
    echo json_encode(['success' => false, 'message' => 'Internal server error'], JSON_UNESCAPED_UNICODE);
    exit();
});

// Polyfill สำหรับโฮสต์ที่ยังรัน PHP 7.4 (str_* เพิ่มมาใน PHP 8.0)
// ทำให้ Http.php ทำงานได้โดยไม่ต้องแก้โค้ดหลัก
if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}
if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool
    {
        return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
if (!function_exists('str_ends_with')) {
    function str_ends_with(string $haystack, string $needle): bool
    {
        return $needle === '' || substr($haystack, -strlen($needle)) === $needle;
    }
}

// โหลด .env ผ่านแคช (temp file) — ไม่ต้อง parse_ini_file ทุก request
$envFile = __DIR__ . '/../.env';

// ชื่อไฟล์แคชผูกกับ md5 ของ "เนื้อหา" .env ไม่ใช่แค่ path
// → อัปโหลด .env ใหม่ทับไฟล์เดิมแล้วได้ค่าใหม่ทันที แม้ FTP จะคง filemtime เดิมไว้
// (แบบเดิมเทียบ filemtime อย่างเดียว: .env ใหม่ที่มีเวลาเก่ากว่าแคช → เซิร์ฟเวอร์อ่านค่าเดิมต่อ
//  ทำให้แก้ ALLOWED_ORIGIN แล้วยังเจอ CORS error ทั้งที่ไฟล์ถูกต้องแล้ว)
$envFingerprint = function_exists('md5_file') ? (string) @md5_file($envFile) : '';
$envCache = sys_get_temp_dir() . '/bookloop_env_' . md5($envFile)
    . ($envFingerprint !== '' ? '_' . $envFingerprint : '') . '.php';

if (file_exists($envFile)) {
    // ใช้แคชเมื่อไม่มีทางรู้ fingerprint (md5_file ถูกปิด) → fallback เทียบ filemtime แบบเดิม
    $cacheIsFresh = file_exists($envCache)
        && ($envFingerprint !== '' || filemtime($envCache) >= filemtime($envFile));

    if ($cacheIsFresh) {
        $env = require $envCache;
    } else {
        $env = parse_ini_file($envFile);
        if (!is_array($env)) {
            // parse_ini_file คืน false เมื่อ .env มี syntax ผิด (เช่น วงเล็บ/quote ใน comment หรือ value
            // ที่ไม่มี quote) — throw ให้รู้ตัวทันที ดีกว่าเงียบแล้วรันด้วยค่า default ผิดๆ
            throw new Exception(".env parse error — check for special characters like ( ) \" ' in values/comments");
        }
        // เก็บแคช; ถ้าเขียนไม่ได้ก็ยังทำงานได้ (parse ทุกครั้งแทน)
        $export = var_export($env, true);
        @file_put_contents($envCache, "<?php return {$export};", LOCK_EX);
    }
} else {
    throw new Exception("Backend ยังไม่ได้สร้างไฟล์ .env บนเซิร์ฟเวอร์ — สร้างตามตัวอย่าง .env.example แล้วอัปโหลดใหม่");
}

// Config constants
define('SMTP_HOST', $env['SMTP_HOST'] ?? '');
define('SMTP_PORT', $env['SMTP_PORT'] ?? 587);
define('SMTP_USERNAME', $env['SMTP_USERNAME'] ?? '');
define('SMTP_PASSWORD', $env['SMTP_PASSWORD'] ?? '');
define('SMTP_ENCRYPTION', $env['SMTP_ENCRYPTION'] ?? 'tls');

// Mail timeout in seconds (PHPMailer Timeout)
// ต้องน้อยกว่า max_execution_time ของ PHP เพื่อให้ SMTP error กลายเป็น caught exception ไม่ใช่ fatal error
$mailTimeout = (int)($env['MAIL_TIMEOUT'] ?? 15);
define('MAIL_TIMEOUT', $mailTimeout > 0 ? $mailTimeout : 15);
define('MAIL_FROM_ADDRESS', $env['MAIL_FROM_ADDRESS'] ?? '');
define('MAIL_FROM_NAME', $env['MAIL_FROM_NAME'] ?? '');
define('ALLOWED_ORIGIN', $env['ALLOWED_ORIGIN'] ?? '*');
define('SUBSCRIBERS_FILE', $env['SUBSCRIBERS_FILE'] ?? 'subscribers.txt');
define('ACTIVITIES_FILE', $env['ACTIVITIES_FILE'] ?? 'activities.txt');
define('TEMPLATE_IMAGE', $env['TEMPLATE_IMAGE'] ?? 'images/template.png');
define('FONT_PATH', $env['FONT_PATH'] ?? 'images/fonts/NotoSansThai.ttf');
define('GENERATED_IMAGES_PATH', $env['GENERATED_IMAGES_PATH'] ?? 'images/generated');
define('LOG_FILE', $env['LOG_FILE'] ?? 'error.log');
define('REQUEST_LOG_FILE', $env['REQUEST_LOG_FILE'] ?? 'request.log');
// รหัส dashboard/admin สำหรับ moderate listings ผ่าน index.php — ว่าง = ปิดการ moderate
// (fail-closed) ตั้งค่าบน server .env เท่านั้น ห้าม commit ค่าจริง (ดู .env.example)
define('ADMIN_TOKEN', $env['ADMIN_TOKEN'] ?? '');

// Base paths
define('BASE_PATH', __DIR__ . '/..');
define('CONFIG_PATH', __DIR__);
define('EMAIL_PATH', BASE_PATH . '/email');
define('AUTH_PATH', BASE_PATH . '/auth');
define('API_PATH', BASE_PATH . '/api');
define('IMAGES_PATH', BASE_PATH . '/images');
define('DATA_PATH', BASE_PATH . '/data');

// รายชื่อผู้สมัครอยู่ใต้ data/ (ถูก .htaccess บังทั้งโฟลเดอร์) — ห้ามเก็บใต้ email/
// ที่เปิดผ่านเว็บได้โดยตรง มิฉะนั้นอีเมลผู้ใช้รั่วผ่าน /email/subscribers.txt
define('SUBSCRIBERS_PATH', DATA_PATH . '/' . SUBSCRIBERS_FILE);

/**
 * Get config value
 */
function config(string $key, $default = null)
{
    return constant($key) ?? $default;
}

// Auto-load RequestLogger for all API requests
require_once BASE_PATH . '/Services/RequestLogger.php';
