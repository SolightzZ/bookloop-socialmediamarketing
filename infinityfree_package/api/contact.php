<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/Http.php';
require_once BASE_PATH . '/Services/RateLimiter.php';
require_once BASE_PATH . '/Services/BackgroundMail.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Rate limiting: 5 requests per 10 minutes per IP
if (!rateLimitCheck(clientRateLimitKey('contact'), 5, 600)) {
    jsonResponse(['success' => false, 'message' => 'ส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง'], 429);
}

$input = getRequestData();
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$topic = trim($input['topic'] ?? 'general');
$orderId = trim($input['orderId'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || mb_strlen($name) < 2) {
    jsonResponse(['success' => false, 'message' => 'กรุณาระบุชื่อ-นามสกุลให้ถูกต้อง'], 400);
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
}

if (empty($message) || mb_strlen($message) < 10) {
    jsonResponse(['success' => false, 'message' => 'ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร'], 400);
}

$contactFile = DATA_PATH . '/contact_messages.json';
$messages = loadJson($contactFile);
if (!is_array($messages)) {
    $messages = [];
}

$newMessage = [
    'id' => 'MSG-' . date('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6),
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'email' => $email,
    'topic' => htmlspecialchars($topic, ENT_QUOTES, 'UTF-8'),
    'orderId' => htmlspecialchars($orderId, ENT_QUOTES, 'UTF-8'),
    'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
    'created_at' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
    'status' => 'pending',
];

$messages[] = $newMessage;
saveJson($contactFile, $messages);

// แจ้งเตือนไปยังเมลร้านแบบ non-blocking (ตอบ user ก่อน ค่อย SMTP)
// ข้ามถ้าไม่ได้ตั้งค่า MAIL_FROM_ADDRESS — ข้อความยังอยู่ใน contact_messages.json
if (defined('MAIL_FROM_ADDRESS') && MAIL_FROM_ADDRESS !== '') {
    $notifyId = $newMessage['id'];
    $notifyTopic = $topic;
    $notifyOrderId = $orderId;
    runAfterResponse(function () use ($notifyId, $name, $email, $notifyTopic, $notifyOrderId, $message) {
        require_once BASE_PATH . '/vendor/autoload.php';
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USERNAME;
            $mail->Password = SMTP_PASSWORD;
            $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = SMTP_PORT;
            $mail->Timeout = MAIL_TIMEOUT;
            $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
            $mail->addAddress(MAIL_FROM_ADDRESS);
            $mail->CharSet = 'UTF-8';
            $mail->Subject = '[BookLoop] ข้อความติดต่อใหม่: ' . $notifyTopic . ' (' . $notifyId . ')';
            $mail->Body = "ชื่อ: {$name}\nอีเมล: {$email}\nหัวข้อ: {$notifyTopic}\nคำสั่งซื้อ: {$notifyOrderId}\n\n{$message}";
            $mail->send();
        } catch (Throwable $e) {
            error_log('[BookLoop][ERROR] contact notify failed: ' . $e->getMessage());
        }
    });
}

jsonResponse([
    'success' => true,
    'message' => 'ส่งข้อความเรียบร้อยแล้ว ทีมงาน BookLoop จะติดต่อกลับทางอีเมลโดยเร็วที่สุด',
    'data' => [
        'id' => $newMessage['id'],
    ],
]);
