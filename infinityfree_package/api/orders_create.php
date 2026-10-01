<?php

// POST /api/orders_create.php — สร้างคำสั่งซื้อ (ต้องล็อกอิน)
// body: { items[], subtotal, shippingFee, discount, total, shippingAddress{},
//         shippingMethod, paymentMethod, paymentStatus?, status?, shippingCarrier?, trackingNumber? }
// status ที่รับจาก client ได้เฉพาะ pending_payment|processing (ที่เหลือ server เป็นคนขยับ)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กันสแปมออเดอร์: 30 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('orders_create'), 30, 3600)) {
    jsonResponse(['success' => false, 'message' => 'สร้างคำสั่งซื้อบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
if ($userId === null) {
    jsonResponse(['success' => false, 'message' => 'กรุณาเข้าสู่ระบบก่อนสร้างคำสั่งซื้อ'], 401);
}

if (!defined('ORDERS_FILE')) {
    define('ORDERS_FILE', DATA_PATH . '/orders.json');
}

$data = getRequestData();

// ─── validate items ───
$items = $data['items'] ?? null;
if (!is_array($items) || count($items) === 0 || count($items) > 50) {
    jsonResponse(['success' => false, 'message' => 'ตะกร้าสินค้าไม่ถูกต้อง (ต้องมี 1–50 รายการ)'], 400);
}

$cleanItems = [];
foreach ($items as $item) {
    if (!is_array($item)) {
        jsonResponse(['success' => false, 'message' => 'ข้อมูลสินค้าไม่ถูกต้อง'], 400);
    }
    $bookId = trim((string) ($item['bookId'] ?? ''));
    $title = trim((string) ($item['title'] ?? ''));
    $price = $item['price'] ?? null;
    $quantity = $item['quantity'] ?? null;
    if ($bookId === '' || $title === '' || !is_numeric($price) || (int) $quantity < 1 || (int) $quantity > 99) {
        jsonResponse(['success' => false, 'message' => 'ข้อมูลสินค้าบางรายการไม่ถูกต้อง'], 400);
    }
    $cleanItems[] = [
        'bookId' => mb_substr($bookId, 0, 64),
        'title' => mb_substr($title, 0, 200),
        'author' => mb_substr(trim((string) ($item['author'] ?? '')), 0, 200),
        'image' => mb_substr(trim((string) ($item['image'] ?? '')), 0, 2048),
        'price' => round((float) $price, 2),
        'originalPrice' => isset($item['originalPrice']) && is_numeric($item['originalPrice'])
            ? round((float) $item['originalPrice'], 2) : null,
        'quantity' => (int) $quantity,
        'condition' => mb_substr(trim((string) ($item['condition'] ?? '')), 0, 32),
    ];
}

// ─── validate money ───
foreach (['subtotal', 'shippingFee', 'discount', 'total'] as $field) {
    if (!isset($data[$field]) || !is_numeric($data[$field]) || (float) $data[$field] < 0) {
        jsonResponse(['success' => false, 'message' => 'ยอดเงินไม่ถูกต้อง (' . $field . ')'], 400);
    }
}

// ─── validate shipping address ───
$addr = $data['shippingAddress'] ?? null;
if (!is_array($addr)) {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน'], 400);
}
foreach (['name', 'phone', 'address', 'province', 'postalCode'] as $field) {
    if (trim((string) ($addr[$field] ?? '')) === '') {
        jsonResponse(['success' => false, 'message' => 'กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน'], 400);
    }
}
$cleanZip = preg_replace('/\D/', '', (string) $addr['postalCode']);
if (strlen($cleanZip) !== 5) {
    jsonResponse(['success' => false, 'message' => 'รหัสไปรษณีย์ต้องมี 5 หลัก'], 400);
}

// ─── validate enums ───
$paymentMethod = trim((string) ($data['paymentMethod'] ?? ''));
if (!in_array($paymentMethod, ['promptpay', 'credit_card', 'bank_transfer', 'cod', 'truewallet'], true)) {
    jsonResponse(['success' => false, 'message' => 'ช่องทางการชำระเงินไม่ถูกต้อง'], 400);
}
$paymentStatus = trim((string) ($data['paymentStatus'] ?? 'pending'));
if (!in_array($paymentStatus, ['pending', 'paid', 'failed', 'refunded'], true)) {
    jsonResponse(['success' => false, 'message' => 'สถานะการชำระเงินไม่ถูกต้อง'], 400);
}
$status = trim((string) ($data['status'] ?? 'pending_payment'));
if (!in_array($status, ['pending_payment', 'processing'], true)) {
    jsonResponse(['success' => false, 'message' => 'สถานะคำสั่งซื้อเริ่มต้นไม่ถูกต้อง'], 400);
}

// ─── create ───
$orders = loadJson(ORDERS_FILE);
$existingIds = [];
foreach ($orders as $o) {
    $existingIds[$o['id'] ?? ''] = true;
}
do {
    $id = 'BL-' . (string) random_int(100000, 999999);
} while (isset($existingIds[$id]));

$now = date('c');
$order = [
    'id' => $id,
    'userId' => $userId,
    'items' => $cleanItems,
    'subtotal' => round((float) $data['subtotal'], 2),
    'shippingFee' => round((float) $data['shippingFee'], 2),
    'discount' => round((float) $data['discount'], 2),
    'total' => round((float) $data['total'], 2),
    'shippingAddress' => [
        'name' => mb_substr(trim((string) $addr['name']), 0, 200),
        'phone' => mb_substr(trim((string) $addr['phone']), 0, 32),
        'address' => mb_substr(trim((string) $addr['address']), 0, 500),
        'province' => mb_substr(trim((string) $addr['province']), 0, 100),
        'postalCode' => $cleanZip,
    ],
    'shippingMethod' => mb_substr(trim((string) ($data['shippingMethod'] ?? 'Standard')), 0, 200),
    'shippingCarrier' => mb_substr(trim((string) ($data['shippingCarrier'] ?? 'Flash Express')), 0, 100),
    'trackingNumber' => mb_substr(
        trim((string) ($data['trackingNumber'] ?? 'TH' . (string) random_int(1000000000, 9999999999))),
        0, 64
    ),
    'paymentMethod' => $paymentMethod,
    'paymentStatus' => $paymentStatus,
    'status' => $status,
    'createdAt' => $now,
    'updatedAt' => $now,
];

array_unshift($orders, $order);
if (!saveJson(ORDERS_FILE, $orders)) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse(['success' => true, 'message' => 'สร้างคำสั่งซื้อสำเร็จ', 'order' => $order], 201);
