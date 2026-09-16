<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$subscriberFile = EMAIL_PATH . '/subscribers.txt';

// Helper: check if email is subscribed
function isEmailSubscribed(string $email, string $filePath): bool
{
    if (!file_exists($filePath)) {
        return false;
    }
    $lines = file($filePath, FILE_IGNORE_NEW_LINES);
    foreach ($lines as $line) {
        if (trim($line) === $email) {
            return true;
        }
    }
    return false;
}

// Helper: remove email from subscribers
function removeEmail(string $email, string $filePath): bool
{
    if (!file_exists($filePath)) {
        return false;
    }
    $lines = file($filePath, FILE_IGNORE_NEW_LINES);
    $filtered = array_filter($lines, fn($line) => trim($line) !== $email);
    file_put_contents($filePath, implode("\n", $filtered) . "\n");
    return true;
}

if ($method === 'GET') {
    // Check subscription status
    $email = $_GET['email'] ?? '';
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
    }
    $subscribed = isEmailSubscribed($email, $subscriberFile);
    jsonResponse(['success' => true, 'subscribed' => $subscribed]);
} elseif ($method === 'DELETE') {
    // Unsubscribe
    $data = getRequestData();
    $email = trim($data['email'] ?? '');
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
    }
    if (!isEmailSubscribed($email, $subscriberFile)) {
        jsonResponse(['success' => false, 'message' => 'อีเมลนี้ไม่ได้สมัครรับข่าวสารไว้'], 400);
    }
    removeEmail($email, $subscriberFile);
    jsonResponse(['success' => true, 'message' => 'ยกเลิกการสมัครรับข่าวสารสำเร็จ']);
} else {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}
