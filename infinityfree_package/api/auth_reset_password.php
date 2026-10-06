<?php

// POST /api/auth_reset_password.php { token, password | newPassword }
// ใช้ reset token จาก auth_forgot_password.php ตั้งรหัสผ่านใหม่
// สำเร็จแล้ว token ถูก mark ใช้แล้ว + เพิกถอน session tokens ทั้งหมดของ user นั้น

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กัน brute-force เดา token: 20 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('reset'), 20, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ลองบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

if (!defined('PASSWORD_RESETS_FILE')) {
    define('PASSWORD_RESETS_FILE', DATA_PATH . '/password_resets.json');
}

$data = getRequestData();
$token = trim($data['token'] ?? '');
$newPassword = $data['newPassword'] ?? $data['password'] ?? '';

if ($token === '') {
    jsonResponse(['success' => false, 'message' => 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง'], 400);
}

if (!is_string($newPassword) || strlen($newPassword) < 8) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'], 400);
}

// กัน DoS/ตัดทิ้งเงียบผ่าน bcrypt (72 bytes limit)
if (strlen($newPassword) > 72) {
    jsonResponse(['success' => false, 'message' => 'รหัสผ่านต้องมีความยาวไม่เกิน 72 ตัวอักษร'], 400);
}

$resets = loadJson(PASSWORD_RESETS_FILE);
$now = time();
$index = null;

foreach ($resets as $i => $entry) {
    if (($entry['token'] ?? '') === $token) {
        $index = $i;
        break;
    }
}

if ($index === null) {
    jsonResponse(['success' => false, 'message' => 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว'], 400);
}

$entry = $resets[$index];
if (!empty($entry['usedAt']) || strtotime($entry['expiresAt'] ?? '') < $now) {
    jsonResponse(['success' => false, 'message' => 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว'], 400);
}

$user = findUserById($entry['userId'] ?? '');
if ($user === null) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบบัญชีผู้ใช้นี้ในระบบ'], 404);
}

$updated = updateUser($user['id'], ['password' => hashPassword($newPassword)]);
if ($updated === null) {
    jsonResponse(['success' => false, 'message' => 'ไม่สามารถตั้งรหัสผ่านใหม่ได้ กรุณาลองใหม่อีกครั้ง'], 500);
}

// mark token ว่าใช้แล้ว
$resets[$index]['usedAt'] = date('c');
saveJson(PASSWORD_RESETS_FILE, $resets);

// เพิกถอน session ทั้งหมดของ user — ต้องล็อกอินใหม่ด้วยรหัสผ่านใหม่เท่านั้น
$tokens = loadJson(TOKENS_FILE);
$tokens = array_values(array_filter($tokens, fn($t) => ($t['userId'] ?? '') !== $user['id']));
saveJson(TOKENS_FILE, $tokens);

jsonResponse(['success' => true, 'message' => 'ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่']);
