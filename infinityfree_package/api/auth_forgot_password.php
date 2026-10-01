<?php

// POST /api/auth_forgot_password.php { email }
// ออก reset token อายุ 1 ชม. เก็บใน data/password_resets.json
// ตอบ generic message เสมอ (กัน email enumeration) — คืน resetToken เฉพาะเมื่อมีบัญชีนี้
// (frontend ใช้เป็นทางลัด demo ไปหน้า reset-password; production ควรส่งลิงก์ทางอีเมลแทน)

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// กันไล่เดาอีเมล/สแปมขอ token: 10 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('forgot'), 10, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ขอรีเซ็ตรหัสผ่านบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

define('PASSWORD_RESETS_FILE', DATA_PATH . '/password_resets.json');
define('PASSWORD_RESET_EXPIRY_SECONDS', 3600);

$data = getRequestData();
$email = strtolower(trim($data['email'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], 400);
}

$genericMessage = 'หากอีเมลนี้มีบัญชีอยู่ในระบบ เราได้เตรียมลิงก์ตั้งรหัสผ่านใหม่ให้แล้ว (ลิงก์มีอายุ 1 ชั่วโมง)';

$user = findUserByEmail($email);
if ($user === null) {
    // ไม่มีบัญชี — ตอบเหมือนสำเร็จ แต่ไม่ออก token (กัน oracle)
    jsonResponse(['success' => true, 'message' => $genericMessage]);
}

// prune รายการหมดอายุ/ใช้แล้ว กันไฟล์โตไม่จำกัด
$resets = loadJson(PASSWORD_RESETS_FILE);
$now = time();
$resets = array_values(array_filter($resets, function ($r) use ($now) {
    if (!empty($r['usedAt'])) {
        return false;
    }
    return strtotime($r['expiresAt'] ?? '') >= $now;
}));

$token = 'bl_rst_' . bin2hex(random_bytes(20));
$resets[] = [
    'token' => $token,
    'userId' => $user['id'],
    'email' => $user['email'],
    'createdAt' => date('c'),
    'expiresAt' => date('c', $now + PASSWORD_RESET_EXPIRY_SECONDS),
    'usedAt' => null,
];
saveJson(PASSWORD_RESETS_FILE, $resets);

// หมายเหตุ: ยังไม่มี template อีเมลรีเซ็ตรหัสผ่าน — คืน token ให้ frontend
// พาไปหน้า reset-password ได้ทันที (โหมด demo) จนกว่าจะมีปุ่มส่งอีเมลจริง
jsonResponse([
    'success' => true,
    'message' => $genericMessage,
    'resetToken' => $token,
]);
