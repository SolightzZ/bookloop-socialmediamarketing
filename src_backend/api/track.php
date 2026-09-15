<?php

// โหลด config
require_once __DIR__ . '/../config/config.php';

// CORS Headers
header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// จัดการ OPTIONS request (CORS preflight)
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// ตรวจสอบ request method
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
    exit();
}

// รับข้อมูลจาก request
$input = json_decode(file_get_contents("php://input"), true);

$event = $input["event"] ?? '';
$email = $input["email"] ?? '';
$userId = $input["user_id"] ?? '';
$bookId = $input["book_id"] ?? '';
$bookTitle = $input["book_title"] ?? '';
$bookPrice = $input["book_price"] ?? '';
$metadata = $input["metadata"] ?? [];

// Validate event
$validEvents = ['page_view', 'book_view', 'add_to_cart', 'purchase', 'wishlist'];
if (empty($event) || !in_array($event, $validEvents)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid event type"
    ]);
    exit();
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

// ส่ง email แจ้งเตือนสำหรับกิจกรรมสำคัญ
require_once EMAIL_PATH . '/sendMail.php';

if ($event === 'purchase' && !empty($email)) {
    try {
        $userName = $input["user_name"] ?? 'ลูกค้า';
        $orderId = $input["order_id"] ?? uniqid('ORD-');
        sendPurchaseEmail($email, $userName, $orderId, $bookTitle, $bookPrice);
    } catch (Exception $e) {
    }
} elseif ($event === 'add_to_cart' && !empty($email)) {
    try {
        $userName = $input["user_name"] ?? 'ลูกค้า';
        sendAddToCartEmail($email, $userName, $bookTitle, $bookPrice);
    } catch (Exception $e) {
    }
}

// ส่ง response
echo json_encode([
    "success" => true,
    "message" => "บันทึกกิจกรรมสำเร็จ"
]);
?>
