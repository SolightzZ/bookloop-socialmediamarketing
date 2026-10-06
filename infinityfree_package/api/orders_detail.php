<?php

// GET /api/orders_detail.php?id=BL-123456 — ดูคำสั่งซื้อใบเดียว (ต้องล็อกอิน + เป็นเจ้าของ)
// ไม่เจอ / ไม่ใช่เจ้าของ → 404 ข้อความเดียวกัน (กันเดา id ส่อง PII คนอื่น)

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

// GET (เดิม) หรือ POST — frontend เรียกผ่าน POST เป็นหลักเพื่อให้ token/id
// อยู่ใน JSON body แทน query (response มี PII ที่อยู่/เบอร์โทร)
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'POST') {
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

$body = $method === 'POST' ? getRequestData() : [];
$id = ltrim(trim((string) ($body['id'] ?? $_GET['id'] ?? '')), '#');
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
