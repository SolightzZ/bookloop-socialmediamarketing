<?php

// /api/user_state.php — sync ตะกร้า + รายการโปรดของผู้ใช้ (ต้องล็อกอิน)
// GET  → { cart: [{productId, quantity}], wishlist: [id] }
// POST → { cart?, wishlist? } บันทึกทับของ user นี้ (validate + cap จำนวน)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
if ($userId === null) {
    jsonResponse(['success' => false, 'message' => 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง'], 401);
}

if (!defined('USER_STATE_FILE')) {
    define('USER_STATE_FILE', DATA_PATH . '/user_state.json');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $states = loadJson(USER_STATE_FILE);
    $state = $states[$userId] ?? ['cart' => [], 'wishlist' => []];
    jsonResponse([
        'success' => true,
        'cart' => is_array($state['cart'] ?? null) ? array_values($state['cart']) : [],
        'wishlist' => is_array($state['wishlist'] ?? null) ? array_values($state['wishlist']) : [],
    ]);
}

if ($method !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$data = getRequestData();

// อ่านอย่างเดียว (pull, มีแค่ token) กับเขียน (push) ใช้โควตาแยกกัน
// กัน pull ตอนเปิดแอปแย่งโควตา push — อ่านให้เยอะกว่าเพราะไม่มีผลข้างเคียง
$isReadOnly = !array_key_exists('cart', $data) && !array_key_exists('wishlist', $data);
$rateKey = $isReadOnly ? 'user_state_read' : 'user_state';
$rateMax = $isReadOnly ? 300 : 60;
if (!rateLimitCheck(clientRateLimitKey($rateKey), $rateMax, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ซิงก์ข้อมูลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}
$states = loadJson(USER_STATE_FILE);
$current = $states[$userId] ?? ['cart' => [], 'wishlist' => []];

if (array_key_exists('cart', $data)) {
    if (!is_array($data['cart']) || count($data['cart']) > 100) {
        jsonResponse(['success' => false, 'message' => 'ข้อมูลตะกร้าไม่ถูกต้อง'], 400);
    }
    $cart = [];
    foreach ($data['cart'] as $item) {
        if (!is_array($item)) {
            jsonResponse(['success' => false, 'message' => 'ข้อมูลตะกร้าไม่ถูกต้อง'], 400);
        }
        $pid = trim((string) ($item['productId'] ?? ''));
        $qty = (int) ($item['quantity'] ?? 0);
        if ($pid === '' || strlen($pid) > 64 || $qty < 1 || $qty > 99) {
            jsonResponse(['success' => false, 'message' => 'ข้อมูลตะกร้าไม่ถูกต้อง'], 400);
        }
        $cart[] = ['productId' => $pid, 'quantity' => $qty];
    }
    $current['cart'] = $cart;
}

if (array_key_exists('wishlist', $data)) {
    if (!is_array($data['wishlist']) || count($data['wishlist']) > 500) {
        jsonResponse(['success' => false, 'message' => 'ข้อมูลรายการโปรดไม่ถูกต้อง'], 400);
    }
    $wishlist = [];
    foreach ($data['wishlist'] as $id) {
        $id = trim((string) $id);
        if ($id === '' || strlen($id) > 64) {
            jsonResponse(['success' => false, 'message' => 'ข้อมูลรายการโปรดไม่ถูกต้อง'], 400);
        }
        $wishlist[] = $id;
    }
    $current['wishlist'] = array_values(array_unique($wishlist));
}

$current['updatedAt'] = date('c');
$states[$userId] = $current;

if (!saveJson(USER_STATE_FILE, $states)) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถบันทึกได้ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse(['success' => true, 'cart' => $current['cart'], 'wishlist' => $current['wishlist']]);
