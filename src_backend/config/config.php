<?php

// โหลด .env file
$envFile = __DIR__ . '/../.env';

if (!file_exists($envFile)) {
    throw new Exception(".env file not found");
}

$env = parse_ini_file($envFile);

// Config constants
define('SMTP_HOST', $env['SMTP_HOST'] ?? '');
define('SMTP_PORT', $env['SMTP_PORT'] ?? 587);
define('SMTP_USERNAME', $env['SMTP_USERNAME'] ?? '');
define('SMTP_PASSWORD', $env['SMTP_PASSWORD'] ?? '');
define('SMTP_ENCRYPTION', $env['SMTP_ENCRYPTION'] ?? 'tls');
define('MAIL_FROM_ADDRESS', $env['MAIL_FROM_ADDRESS'] ?? '');
define('MAIL_FROM_NAME', $env['MAIL_FROM_NAME'] ?? '');
define('ALLOWED_ORIGIN', $env['ALLOWED_ORIGIN'] ?? '*');
define('SUBSCRIBERS_FILE', $env['SUBSCRIBERS_FILE'] ?? 'subscribers.txt');
define('ACTIVITIES_FILE', $env['ACTIVITIES_FILE'] ?? 'activities.txt');
define('TEMPLATE_IMAGE', $env['TEMPLATE_IMAGE'] ?? 'images/template.png');
define('FONT_PATH', $env['FONT_PATH'] ?? 'images/fonts/NotoSansThai.ttf');
define('GENERATED_IMAGES_PATH', $env['GENERATED_IMAGES_PATH'] ?? 'images/generated');

// Base paths
define('BASE_PATH', __DIR__ . '/..');
define('CONFIG_PATH', __DIR__);
define('EMAIL_PATH', BASE_PATH . '/email');
define('AUTH_PATH', BASE_PATH . '/auth');
define('API_PATH', BASE_PATH . '/api');
define('IMAGES_PATH', BASE_PATH . '/images');
define('DATA_PATH', BASE_PATH . '/data');

/**
 * Get config value
 */
function config(string $key, mixed $default = null): mixed
{
    return constant($key) ?? $default;
}
