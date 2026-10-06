<?php

// POST /api/auth_change_password.php { oldPassword | oldPass, newPassword | newPass }
// ต้องล็อกอิน (Bearer token / ?token= / field token) — ตรวจรหัสเดิมก่อนเปลี่ยนรหัสใหม่
// session ปัจจุบันยังใช้งานต่อได้ (ไม่เพิกถอน)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กัน brute-force เดารหัสเดิม: 10 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('changepw'), 10, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ลองบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

$token = getBearerToken();
$userId = $token !== null ? validateToken($token) : null;
if ($userId === null) {
    jsonResponse(['success' => false, 'message' => 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง'], 401);
}

$data = getRequestData();
$oldPassword = $data['oldPassword'] ?? $data['oldPass'] ?? '';
$newPassword = $data['newPassword'] ?? $data['newPass'] ?? '';

if (!is_string($oldPassword) || $oldPassword === '') {
    jsonResponse(['success' => false, 'message' => 'กรุณากรอกรหัสผ่านเดิม'], 400);
}

if (!is_string($newPassword) || strlen($newPassword) < 8) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร'], 400);
}

// กัน DoS/ตัดทิ้งเงียบผ่าน bcrypt (72 bytes limit)
if (strlen($newPassword) > 72) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านใหม่ต้องมีความยาวไม่เกิน 72 ตัวอักษร'], 400);
}

$user = findUserById($userId);
if ($user === null) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบบัญชีผู้ใช้นี้ในระบบ'], 404);
}

if (!verifyPassword($oldPassword, $user['password'] ?? '')) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านเดิมไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'], 400);
}

if ($oldPassword === $newPassword) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเดิม'], 400);
}

$updated = updateUser($userId, ['password' => hashPassword($newPassword)]);
if ($updated === null) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง'], 500);
}

jsonResponse(['success' => true, 'message' => 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว']);
