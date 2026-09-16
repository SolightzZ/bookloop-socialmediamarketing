<?php

// ─── Shared HTTP helpers (CORS / JSON / Request parsing) ──────────
// Reusable ทั้ง frontend API และ log/track/subscribe endpoints
// ทุก endpoint ที่ต้องการ CORS + JSON ให้ require_once ไฟล์นี้ไฟล์เดียว
// (มี function_exists guard กัน redeclare ถ้าถูก include ซ้อนกับ auth.php)

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Logger.php';

if (!function_exists('corsHeaders')) {
    /**
     * ส่ง CORS headers ตาม allow-list ใน .env (ALLOWED_ORIGIN) + จัดการ OPTIONS preflight
     */
    function corsHeaders(): void
    {
        // อนุญาตเฉพาะ origin ที่อยู่ใน allow-list ไม่สะท้อน origin ที่ส่งมาทั้งหมด
        // รองรับหลาย origin คั่นด้วย comma และ '*' เพื่ออนุญาตทุก origin (dev เท่านั้นแนะนำ)
        $allowed = array_map('trim', explode(',', ALLOWED_ORIGIN));
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array('*', $allowed, true)) {
            header("Access-Control-Allow-Origin: *");
        } elseif ($origin !== '' && in_array($origin, $allowed, true)) {
            header("Access-Control-Allow-Origin: " . $origin);
            header("Vary: Origin");
        } elseif ($origin !== '') {
            // log เตือนเพื่อช่วย debug กรณีเปิดเว็บผ่าน origin ที่ยังไม่ได้เพิ่มใน ALLOWED_ORIGIN
            Logger::getInstance()->warning('cors_origin_not_allowed', ['origin' => $origin]);
        }

        header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Content-Type: application/json; charset=utf-8");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}

if (!function_exists('jsonResponse')) {
    /**
     * ส่ง JSON response แล้วจบ request ทันที
     */
    function jsonResponse(array $data, int $statusCode = 200): void
    {
        // ล้าง output buffer ถ้ามี notice/warning หลงออกมาเป็น HTML (เช่น deprecation จาก vendor)
        // เพื่อไม่ให้ปนเปื้อน JSON → time "Unexpected token '<'"
        while (ob_get_level() > 0 && ob_get_length() > 0) {
            ob_end_clean();
        }

        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit();
    }
}

if (!function_exists('getRequestData')) {
    /**
     * อ่านข้อมูล request รองรับทั้ง JSON body และ form-data
     */
    function getRequestData(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (strpos($contentType, 'application/json') !== false) {
            return json_decode(file_get_contents('php://input'), true) ?? [];
        }

        return $_POST;
    }
}

if (!function_exists('getBearerToken')) {
    /**
     * อ่าน token จาก Authorization: Bearer header
     */
    function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }
}
