<?php

// GET /api/orders_list.php?limit=50 — ดูคำสั่งซื้อของตัวเอง (ต้องล็อกอิน, ใหม่สุดก่อน)

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

$limit = (int) ($_GET['limit'] ?? 50);
$limit = max(1, min($limit, 100));

$orders = loadJson(ORDERS_FILE);
$mine = array_values(array_filter($orders, fn($o) => ($o['userId'] ?? '') === $userId));
$mine = array_slice($mine, 0, $limit);

jsonResponse(['success' => true, 'orders' => $mine, 'count' => count($mine)]);
