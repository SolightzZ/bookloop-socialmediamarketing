<?php

// GET /api/orders_list.php?limit=50 — ดูคำสั่งซื้อของตัวเอง (ต้องล็อกอิน, ใหม่สุดก่อน)

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

// GET (เดิม) หรือ POST — frontend เรียกผ่าน POST เป็นหลักเพื่อให้ token
// อยู่ใน JSON body แทน query (response มี PII ที่อยู่/เบอร์โทร — กัน token รั่วผ่าน log)
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
$limit = (int) ($body['limit'] ?? $_GET['limit'] ?? 50);
$limit = max(1, min($limit, 100));

$orders = loadJson(ORDERS_FILE);
$mine = array_values(array_filter($orders, fn($o) => ($o['userId'] ?? '') === $userId));
$mine = array_slice($mine, 0, $limit);

jsonResponse(['success' => true, 'orders' => $mine, 'count' => count($mine)]);
