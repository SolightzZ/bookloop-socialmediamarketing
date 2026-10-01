<?php

// GET /api/orders_detail.php?id=BL-123456 — ดูคำสั่งซื้อใบเดียว (ต้องล็อกอิน + เป็นเจ้าของ)
// ไม่เจอ / ไม่ใช่เจ้าของ → 404 ข้อความเดียวกัน (กันเดา id ส่อง PII คนอื่น)

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
if ($userId === null) {
    jsonResponse(['success' => false, 'message' => 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง'], 401);
}

if (!defined('ORDERS_FILE')) {
    define('ORDERS_FILE', DATA_PATH . '/orders.json');
}

$id = ltrim(trim((string) ($_GET['id'] ?? '')), '#');
if ($id === '') {
    jsonResponse(['success' => false, 'message' => 'ไม่พบคำสั่งซื้อนี้'], 404);
}

$orders = loadJson(ORDERS_FILE);
foreach ($orders as $order) {
    if (ltrim($order['id'] ?? '', '#') === $id) {
        if (($order['userId'] ?? '') !== $userId) {
            break;
        }
        jsonResponse(['success' => true, 'order' => $order]);
    }
}

jsonResponse(['success' => false, 'message' => 'ไม่พบคำสั่งซื้อนี้'], 404);
