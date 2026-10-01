<?php

// POST /api/orders_update_status.php { id, action: cancel | mark_paid }
// เจ้าของออเดอร์เท่านั้น — เปลี่ยนสถานะได้เฉพาะช่วง pending_payment:
//   cancel    → status = cancelled (ยกเลิกก่อนชำระ)
//   mark_paid → paymentStatus = paid, status = processing (ยืนยันชำระแล้ว, ช่องทาง non-COD)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!rateLimitCheck(clientRateLimitKey('orders_status'), 30, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ทำรายการบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
if ($userId === null) {
    jsonResponse(['success' => false, 'message' => 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง'], 401);
}

if (!defined('ORDERS_FILE')) {
    define('ORDERS_FILE', DATA_PATH . '/orders.json');
}

$data = getRequestData();
$id = ltrim(trim((string) ($data['id'] ?? '')), '#');
$action = trim((string) ($data['action'] ?? ''));

if ($id === '' || !in_array($action, ['cancel', 'mark_paid'], true)) {
    jsonResponse(['success' => false, 'message' => 'คำขอไม่ถูกต้อง'], 400);
}

$orders = loadJson(ORDERS_FILE);
$index = null;
foreach ($orders as $i => $order) {
    if (ltrim($order['id'] ?? '', '#') === $id) {
        $index = $i;
        break;
    }
}

if ($index === null || ($orders[$index]['userId'] ?? '') !== $userId) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบคำสั่งซื้อนี้'], 404);
}

$order = $orders[$index];
if (($order['status'] ?? '') !== 'pending_payment') {
    jsonResponse(['success' => false, 'message' => 'คำสั่งซื้อนี้เปลี่ยนสถานะไม่ได้แล้ว'], 400);
}

if ($action === 'cancel') {
    $order['status'] = 'cancelled';
} else {
    if (($order['paymentMethod'] ?? '') === 'cod') {
        jsonResponse(['success' => false, 'message' => 'คำสั่งซื้อแบบเก็บเงินปลายทางไม่ต้องยืนยันชำระเงิน'], 400);
    }
    $order['paymentStatus'] = 'paid';
    $order['status'] = 'processing';
}

$order['updatedAt'] = date('c');
$orders[$index] = $order;

if (!saveJson(ORDERS_FILE, $orders)) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถบันทึกได้ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse(['success' => true, 'message' => 'อัปเดตคำสั่งซื้อเรียบร้อยแล้ว', 'order' => $order]);
