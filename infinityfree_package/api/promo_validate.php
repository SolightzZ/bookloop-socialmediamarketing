<?php

// POST/GET /api/promo_validate.php — ตรวจสอบและคำนวณโค้ดส่วนลด
// body/query: { code: string, token?: string, subtotal?: number }

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';
require_once BASE_PATH . '/Services/Storage.php';

corsHeaders();

if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'], true)) {
    jsonResponse(['success' => false, 'valid' => false, 'message' => 'Method not allowed'], 405);
}

// กัน brute-force เดาโค้ด: 60 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('promo_validate'), 60, 3600)) {
    jsonResponse(['success' => false, 'valid' => false, 'message' => 'ตรวจสอบโค้ดส่วนลดบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

$data = getRequestData();
$code = trim((string) ($data['code'] ?? ($_GET['code'] ?? '')));
$codeUpper = strtoupper($code);

if ($codeUpper === '') {
    jsonResponse(['success' => false, 'valid' => false, 'message' => 'กรุณากรอกรหัสส่วนลด'], 400);
}

if (!defined('PROMOS_FILE')) {
    define('PROMOS_FILE', DATA_PATH . '/promos.json');
}

$promos = loadJson(PROMOS_FILE);
$matched = null;

foreach ($promos as $promo) {
    if (!is_array($promo)) {
        continue;
    }
    if (strtoupper((string) ($promo['code'] ?? '')) === $codeUpper && !empty($promo['active'])) {
        $matched = $promo;
        break;
    }
}

if ($matched === null) {
    jsonResponse([
        'success' => false,
        'valid' => false,
        'message' => 'รหัสส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว',
    ], 404);
}

// ตรวจสอบเงื่อนไขยอดสั่งซื้อขั้นต่ำ (ถ้าส่ง subtotal มา)
$subtotal = isset($data['subtotal']) && is_numeric($data['subtotal']) ? (float) $data['subtotal'] : null;
$minSpend = (float) ($matched['minSpend'] ?? 0);
if ($subtotal !== null && $minSpend > 0 && $subtotal < $minSpend) {
    jsonResponse([
        'success' => false,
        'valid' => false,
        'message' => 'ยอดสั่งซื้อขั้นต่ำ ' . number_format($minSpend, 0) . ' บาท สำหรับโค้ดนี้',
    ], 400);
}

// ตรวจสอบเงื่อนไขสมาชิกใหม่ (new_members)
$target = $matched['target'] ?? 'all';
if ($target === 'new_members') {
    $token = getBearerToken();
    $userId = $token !== null ? validateToken($token) : null;

    if ($userId !== null) {
        // นับจาก cache ตาม mtime (orders.json เปลี่ยน cache หลุดเอง)
        // แทน parse + วนทั้งไฟล์ทุกครั้งที่ตรวจโค้ด
        $previousOrderCount = countUserActiveOrders($userId);

        if ($previousOrderCount > 0) {
            jsonResponse([
                'success' => false,
                'valid' => false,
                'message' => 'โค้ด ' . $matched['code'] . ' สำหรับสมาชิกใหม่และคำสั่งซื้อแรกเท่านั้น',
            ], 400);
        }
    }
}

jsonResponse([
    'success' => true,
    'valid' => true,
    'promo' => [
        'code' => $matched['code'],
        'discount' => (float) $matched['discount'],
        'type' => $matched['type'] ?? 'percent',
        'label' => $matched['label'] ?? ('ลด ' . $matched['discount'] . ($matched['type'] === 'fixed' ? ' บาท' : '%')),
        'description' => $matched['description'] ?? '',
        'minSpend' => $minSpend,
    ],
    'message' => 'ใช้รหัสส่วนลดสำเร็จ',
], 200);
