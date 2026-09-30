<?php

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// เพิกถอน token ฝั่ง server — ตอบ success เสมอเพื่อไม่ให้เป็น oracle ว่า token มีอยู่จริง
$token = getBearerToken();
if ($token) {
    removeToken($token);
}

jsonResponse(['success' => true, 'message' => 'ออกจากระบบสำเร็จ']);
