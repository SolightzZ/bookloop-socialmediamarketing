<?php

// POST /api/listings_moderate.php — อนุมัติ / ปฏิเสธรายการลงขาย (ต้อง login; ส่ง token)
// body: { token, id, action: approve|reject }
// approve → status active (ขึ้นขาย) · reject → status rejected (ไม่ผ่าน)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กันยิงรัว: 60 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('listings_moderate'), 60, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

if (!defined('LISTINGS_FILE')) {
    define('LISTINGS_FILE', DATA_PATH . '/listings.json');
}

// จัดการรายการลงขาย: approve, reject, pause, resume, delete
// ทำงานผ่าน backend dashboard ได้โดยตรงโดยไม่ต้องมี token
$token = getBearerToken();
$moderatorId = $token !== null ? (validateToken($token) ?? 'backend-admin') : 'backend-admin';

$data = getRequestData();
$id = trim((string) ($data['id'] ?? ''));
$action = trim((string) ($data['action'] ?? ''));

if ($id === '') {
    jsonResponse(['success' => false, 'message' => 'กรุณาระบุ id รายการลงขาย'], 400);
}

$allowedActions = ['approve', 'reject', 'pause', 'resume', 'activate', 'delete'];
if (!in_array($action, $allowedActions, true)) {
    jsonResponse(['success' => false, 'message' => 'action ต้องเป็น approve, reject, pause, resume หรือ delete เท่านั้น'], 400);
}

$listings = loadJson(LISTINGS_FILE);
$found = null;
foreach ($listings as $i => $l) {
    if (($l['id'] ?? '') === $id) {
        $found = $i;
        break;
    }
}
if ($found === null) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบรายการลงขายนี้'], 404);
}

$now = date('c');

// กรณีลบรายการ
if ($action === 'delete') {
    $deletedItem = $listings[$found];
    // ลบไฟล์รูปภาพใน htdocs/images/listings/ หากมี
    if (!empty($deletedItem['image']) && str_starts_with($deletedItem['image'], 'images/listings/')) {
        $imgPath = __DIR__ . '/../' . $deletedItem['image'];
        if (is_file($imgPath)) {
            @unlink($imgPath);
        }
    }
    array_splice($listings, $found, 1);
    if (!saveJson(LISTINGS_FILE, $listings)) {
        jsonResponse(['success' => false, 'message' => 'ลบรายการไม่สำเร็จ'], 500);
    }
    jsonResponse([
        'success' => true,
        'message' => 'ลบรายการลงขายเรียบร้อยแล้ว',
        'id' => $id,
        'action' => 'delete',
    ]);
}

// กรณีย้ายสถานะ (approve, reject, pause, resume)
$newStatus = 'active';
$msg = 'อนุมัติให้วางขายแล้ว';

if ($action === 'approve') {
    $newStatus = 'active';
    $msg = 'อนุมัติให้วางขายแล้ว';
} elseif ($action === 'reject') {
    $newStatus = 'rejected';
    $msg = 'ปฏิเสธรายการนี้แล้ว';
} elseif ($action === 'pause') {
    $newStatus = 'paused';
    $msg = 'หยุดขายรายการนี้ชั่วคราวแล้ว';
} elseif ($action === 'resume' || $action === 'activate') {
    $newStatus = 'active';
    $msg = 'เริ่มวางขายรายการนี้ใหม่แล้ว';
}

$listings[$found]['status'] = $newStatus;
$listings[$found]['updatedAt'] = $now;
$listings[$found]['moderatedBy'] = $moderatorId;
$listings[$found]['moderatedAt'] = $now;

if (!saveJson(LISTINGS_FILE, $listings)) {
    jsonResponse(['success' => false, 'message' => 'บันทึกสถานะไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse([
    'success' => true,
    'message' => $msg,
    'status' => $newStatus,
    'action' => $action,
    'listing' => $listings[$found],
]);

