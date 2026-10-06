<?php

// ─── Shared HTTP helpers (CORS / JSON / Request parsing) ──────────
// Reusable ทั้ง frontend API และ log/track/subscribe endpoints
// ทุก endpoint ที่ต้องการ CORS + JSON ให้ require_once ไฟล์นี้ไฟล์เดียว
// (มี function_exists guard กัน redeclare ถ้าถูก include ซ้อนกับ auth.php)

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/Services/Logger.php';

if (!function_exists('allowedOrigins')) {
    /**
     * อ่าน ALLOWED_ORIGIN จาก .env → array ที่ normalize แล้ว
     *
     * ตัดช่องว่าง + trailing slash ให้ทุกค่า เพราะ origin ของเบราว์เซอร์เป็น
     * scheme://host[:port] เท่านั้น (ไม่มี path/ท้าย slash) — ถ้าใส่ path มาก็ไม่มีทาง match
     */
    function allowedOrigins(): array
    {
        $items = array_map(
            static fn($item) => rtrim(trim((string) $item), '/'),
            explode(',', ALLOWED_ORIGIN)
        );

        return array_values(array_filter($items, static fn($item) => $item !== ''));
    }
}

if (!function_exists('isOriginAllowed')) {
    /**
     * เทียบ origin ของ request กับ allow-list (ALLOWED_ORIGIN)
     *
     * - เทียบตรงตัวเป็นหลัก
     * - รองรับ wildcard ในชื่อ host 1 ตัว เช่น `https://*.github.io` → ครอบทุก user/org ของ GitHub Pages
     */
    function isOriginAllowed(string $origin, array $allowed): bool
    {
        // origin จากเบราว์เซอร์เป็น scheme://host[:port] เท่านั้น (ไม่มี path/query)
        // ตัด path/query ทิ้งถ้ามี เพื่อไม่ให้ค่าที่ส่งเข้ามาแบบแปลก ๆ (เช่น ?check-origin=...)
        // บังเอิญเข้า pattern wildcard
        // ใช้ ~ เป็น delimiter เพราะ origin มี # ได้ (ใน char class) — ห้ามใช้ # เป็น delimiter
        if (preg_match('~^(https?://[^/?#]+)~i', $origin, $matches)) {
            $origin = $matches[1];
        }

        foreach ($allowed as $pattern) {
            if ($pattern === $origin) {
                return true;
            }

            if ($pattern === '' || !str_contains($pattern, '*')) {
                continue;
            }

            $starPos = strpos($pattern, '*');
            $prefix = substr($pattern, 0, $starPos);
            $suffix = substr($pattern, $starPos + 1);

            if (str_starts_with($origin, $prefix) && str_ends_with($origin, $suffix)) {
                return true;
            }
        }

        return false;
    }
}

if (!function_exists('corsHeaders')) {
    /**
     * ส่ง CORS headers ตาม allow-list ใน .env (ALLOWED_ORIGIN) + จัดการ OPTIONS preflight
     */
    function corsHeaders(): void
    {
        // อนุญาตเฉพาะ origin ที่อยู่ใน allow-list ไม่สะท้อน origin ที่ส่งมาทั้งหมด
        // รองรับหลาย origin คั่นด้วย comma, wildcard ในชื่อ host (เช่น https://*.github.io)
        // และ '*' (อนุญาตทุก origin — dev เท่านั้น และใช้คู่กับ credentials:include ไม่ได้)
        //
        // ⚠ ค่าที่ใส่ต้องเป็น "origin ล้วน" = scheme://host[:port]
        //   เบราว์เซอร์ส่ง Origin: https://solightzz.github.io (Pages ไม่ต่อ sub-path ของ repo)
        //   ฉะนั้น https://solightzz.github.io/bookloop-socialmediamarketing จะไม่ match
        //   → ไม่มี Access-Control-Allow-Origin → เบราว์เซอร์รายงาน "blocked by CORS policy"
        $allowed = allowedOrigins();
        $origin = rtrim(trim($_SERVER['HTTP_ORIGIN'] ?? ''), '/');

        if (in_array('*', $allowed, true)) {
            header("Access-Control-Allow-Origin: *");
        } elseif ($origin !== '' && isOriginAllowed($origin, $allowed)) {
            header("Access-Control-Allow-Origin: " . $origin);
            // frontend ส่ง credentials:include (cookie __test) จึงต้องมีหัวนี้คู่กัน ไม่งั้น browser บล็อก response
            header("Access-Control-Allow-Credentials: true");
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
     * หมายเหตุ: frontend ส่ง body เป็น application/json แต่ต้องลอง parse JSON ก่อนเสมอ
     * ไม่พึ่ง CONTENT_TYPE (client บางตัวส่ง content-type มาผิด/ไม่ส่งมา)
     */
    function getRequestData(): array
    {
        static $cached = null;
        if ($cached !== null) {
            return $cached;
        }

        $raw = file_get_contents('php://input');
        if ($raw !== false && $raw !== '' && ($decoded = json_decode($raw, true)) !== null) {
            $cached = is_array($decoded) ? $decoded : [];
            return $cached;
        }

        $cached = $_POST;
        return $cached;
    }
}

if (!function_exists('getBearerToken')) {
    /**
     * อ่าน token จาก Authorization: Bearer header
     */
    function getBearerToken(): ?string
    {
        // shared host (InfinityFree/Apache) มักไม่ส่ง HTTP_AUTHORIZATION มาให้ PHP
        // ให้เช็ค REDIRECT_HTTP_AUTHORIZATION (จาก .htaccess E=HTTP_AUTHORIZATION) + apache_request_headers ด้วย
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if ($header === '' && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            foreach ($headers as $name => $value) {
                if (strtolower($name) === 'authorization') {
                    $header = $value;
                    break;
                }
            }
        }

        if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
            return trim($matches[1]);
        }

        // Fallback สำหรับ frontend ที่เลี่ยง preflight (ไม่ส่ง Authorization header):
        // รับ token จาก query (?token=...) หรือ field `token` ใน JSON body แทน
        if (isset($_GET['token']) && is_string($_GET['token']) && $_GET['token'] !== '') {
            return trim($_GET['token']);
        }

        // อ่านจาก cached request body
        $data = getRequestData();
        if (isset($data['token']) && is_string($data['token']) && $data['token'] !== '') {
            return trim($data['token']);
        }

        return null;
    }
}
