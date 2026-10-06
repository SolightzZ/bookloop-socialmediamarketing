<?php

// POST /api/listings_moderate.php — อนุมัติ / ปฏิเสธรายการลงขาย (เฉพาะผู้ดูแล)
// ต้องส่ง ADMIN_TOKEN (server .env) ทาง header X-Admin-Token หรือ field admin_token
// เหตุผล: ระบบยังไม่มี role admin การตรวจแค่ "ล็อกอิน" = user คนไหนก็ moderate ได้
// body: { id, action: approve|reject|pause|resume|activate|delete }
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

// เฉพาะผู้ดูแลเท่านั้น — session token ของ user ธรรมดาใช้ไม่ได้
// (ว่าง = fail-closed ปิดการ moderate ทั้งหมด ตั้งค่าบน server .env เท่านั้น)
$expectedAdmin = (defined('ADMIN_TOKEN') ? (string) ADMIN_TOKEN : '');
$providedAdmin = (string) ($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '');
$data = getRequestData();
if ($providedAdmin === '' && isset($data['admin_token'])) {
    $providedAdmin = (string) $data['admin_token'];
}
if ($expectedAdmin === '') {
    jsonResponse(['success' => false, 'message' => 'ยังไม่ได้ตั้ง ADMIN_TOKEN บนเซิร์ฟเวอร์ (.env) — ปิดการจัดการรายการลงขายไว้ก่อน'], 500);
}
if ($providedAdmin === '' || !hash_equals($expectedAdmin, $providedAdmin)) {
    jsonResponse(['success' => false, 'message' => 'รหัสผู้ดูแลไม่ถูกต้อง'], 403);
}
$moderatorId = 'backend-admin:' . substr(hash('sha256', $providedAdmin), 0, 12);
$id = trim((string) ($data['id'] ?? ''));
$action = trim((string) ($data['action'] ?? ''));

if ($id === '') {
    jsonResponse(['success' => false, 'message' => 'กรุณาระบุ id รายการลงขาย'], 400);
}

$allowedActions = ['approve', 'reject', 'pause', 'resume', 'activate', 'archive', 'delete', 'delete_permanent'];
if (!in_array($action, $allowedActions, true)) {
    jsonResponse(['success' => false, 'message' => 'action ต้องเป็น approve, reject, pause, resume, archive หรือ delete เท่านั้น'], 400);
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

// กรณีลบรายการถาวร
if ($action === 'delete_permanent') {
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
        'message' => 'ลบรายการลงขายและรูปภาพถาวรเรียบร้อยแล้ว',
        'id' => $id,
        'action' => 'delete_permanent',
    ]);
}

// กรณีย้ายสถานะ (approve, reject, pause, resume, archive)
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
    $msg = 'เปิดวางขาย/กู้คืนรายการนี้แล้ว';
} elseif ($action === 'archive' || $action === 'delete') {
    $newStatus = 'archived';
    $msg = 'ย้ายรายการไปเก็บถาวรแล้ว (สามารถกู้คืนได้)';
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

