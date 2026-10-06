<?php

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/Subscribers.php';

corsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
// รองรับ POST + _method=DELETE (frontend เลี่ยง preflight บน InfinityFree free)
// POST ธรรมดา (ไม่มี _method) = เช็คสถานะจาก email ใน body (กัน email รั่วผ่าน query)
if ($method === 'POST') {
    $probe = getRequestData();
    if (($probe['_method'] ?? '') === 'DELETE') {
        $method = 'DELETE';
    } else {
        $method = 'STATUS_VIA_POST';
    }
}
$subscriberFile = SUBSCRIBERS_PATH;

if ($method === 'STATUS_VIA_POST') {
    $email = trim((string) ($probe['email'] ?? ''));
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
    }
    $subscribed = isEmailSubscribed($email, $subscriberFile);
    jsonResponse(['success' => true, 'subscribed' => $subscribed]);
}

if ($method === 'GET') {
    // Check subscription status (legacy query — คงไว้เพื่อ backward compat)
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
