<?php

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/Subscribers.php';

corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$subscriberFile = EMAIL_PATH . '/subscribers.txt';

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
