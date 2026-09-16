<?php

// โหลด config + helpers กลาง
require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Http.php';

corsHeaders();

// ตรวจสอบ request method
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
        "success" => false,
        "message" => "Method not allowed"
    ], 405);
}

// รับข้อมูลจาก request
$input = getRequestData();

$event = $input["event"] ?? '';
$email = $input["email"] ?? '';
$userId = $input["user_id"] ?? '';
$bookId = $input["book_id"] ?? '';
$bookTitle = $input["book_title"] ?? '';
$bookPrice = $input["book_price"] ?? '';
$metadata = $input["metadata"] ?? [];

// Validate event
$validEvents = ['page_view', 'book_view', 'add_to_cart', 'purchase', 'wishlist'];
if (empty($event) || !in_array($event, $validEvents, true)) {
    jsonResponse([
        "success" => false,
        "message" => "Invalid event type"
    ], 400);
}

// บันทึกข้อมูลกิจกรรม
$activitiesFile = DATA_PATH . '/' . ACTIVITIES_FILE;
$activityData = [
    "event" => $event,
    "user_id" => $userId,
    "email" => $email,
    "book_id" => $bookId,
    "book_title" => $bookTitle,
    "book_price" => $bookPrice,
    "timestamp" => date('c'),
    "metadata" => $metadata,
    "ip" => $_SERVER['REMOTE_ADDR'] ?? '',
    "user_agent" => $_SERVER['HTTP_USER_AGENT'] ?? ''
];

// บันทึกลงไฟล์
file_put_contents(
    $activitiesFile,
    json_encode($activityData) . "\n",
    FILE_APPEND | LOCK_EX
);

// ส่ง email แจ้งเตือนสำหรับกิจกรรมสำคัญ (orderEmails.php โหลด sendMail.php ภายใน)
require_once EMAIL_PATH . '/orderEmails.php';

// การส่งเมลต้องไม่ทำให้การบันทึกกิจกรรมล้มเหลว (catch Throwable กัน fatal จาก mail)
if ($event === 'purchase' && !empty($email)) {
    try {
        $userName = $input["user_name"] ?? 'ลูกค้า';
        $orderId = $input["order_id"] ?? uniqid('ORD-');
        sendPurchaseEmail($email, $userName, $orderId, $bookTitle, $bookPrice);
    } catch (Throwable $e) {
    }
} elseif ($event === 'add_to_cart' && !empty($email)) {
    try {
        $userName = $input["user_name"] ?? 'ลูกค้า';
        sendAddToCartEmail($email, $userName, $bookTitle, $bookPrice);
    } catch (Throwable $e) {
    }
}

// ส่ง response
jsonResponse([
    "success" => true,
    "message" => "บันทึกกิจกรรมสำเร็จ"
]);
