<?php

// ─── BackgroundMail: ส่งอีเมลแบบ non-blocking ─────────────────────
// ปัญหาเดิม: register_shutdown_function อย่างเดียว "ยังบล็อก response" เพราะ
// PHP รอ shutdown จบก่อนปิด connection — user ต้องรอ SMTP 5–15s ฟรีๆ
// วิธีแก้: flush response ให้ client ก่อน (fastcgi_finish_request) แล้วค่อย
// ทำ SMTP ต่อหลัง client ตัดการเชื่อมต่อ (+ ignore_user_abort กันโดนฆ่า)

require_once __DIR__ . '/../config/config.php';

if (!function_exists('runAfterResponse')) {
    /**
     * รัน $task หลัง response ถึง client แล้ว — email fail ไม่กระทบ request หลัก
     */
    function runAfterResponse(callable $task): void
    {
        if (function_exists('ignore_user_abort')) {
            @ignore_user_abort(true);
        }
        register_shutdown_function(function () use ($task) {
            if (function_exists('fastcgi_finish_request')) {
                // PHP-FPM: ส่ง response ให้ client ทันที แล้วทำ SMTP ต่อเบื้องหลัง
                @fastcgi_finish_request();
            } else {
                // Apache mod_php: flush เท่าที่ทำได้ (best-effort — อาจยังรอ SMTP)
                while (ob_get_level() > 0) {
                    @ob_end_flush();
                }
                @flush();
            }
            try {
                $task();
            } catch (Throwable $e) {
                error_log('[BookLoop][ERROR] background mail task failed: ' . $e->getMessage());
            }
        });
    }
}

if (!function_exists('embedImageCapped')) {
    /**
     * แนบรูป CID เฉพาะไฟล์เล็กพอ (default 300KB) — กัน banner 1MB+ (welcome.png
     * ~1.2MB) กลายเป็น payload base64 ~1.6MB ต่ออีเมลฉบับ ทำให้ SMTP ช้า/timeout
     * ไฟล์ใหญ่เกิน → ข้าม + log เตือน (ให้ไปบีบอัดรูป) แทนที่จะส่งช้าหรือพัง
     * คืน true = แนบแล้ว, false = ข้าม
     */
    function embedImageCapped($mail, string $path, string $cid, int $maxKb = 300): bool
    {
        if (!is_file($path)) {
            return false;
        }
        $size = @filesize($path);
        if ($size !== false && $size > $maxKb * 1024) {
            error_log("[BookLoop][WARNING] embedImageCapped skipped {$cid} (" . round($size / 1024) . "KB > {$maxKb}KB): {$path} — บีบอัดรูปก่อนแนบอีเมล");
            return false;
        }
        try {
            $mail->addEmbeddedImage($path, $cid);
            return true;
        } catch (Throwable $e) {
            error_log("[BookLoop][WARNING] embedImageCapped failed {$cid}: " . $e->getMessage());
            return false;
        }
    }
}

if (!function_exists('capEmailItems')) {
    /**
     * จำกัดแถวสินค้าในอีเมล (default 20) — กันตะกร้า 50 ชิ้นกลายเป็น HTML หลายร้อย KB
     */
    function capEmailItems(array $items, int $max = 20): array
    {
        return count($items) > $max ? array_slice($items, 0, $max) : $items;
    }
}
