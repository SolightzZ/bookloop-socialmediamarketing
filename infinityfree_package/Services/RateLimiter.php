<?php

// ─── Fixed-window rate limiter แบบ file-backed ─────────────────────
// ใช้ flock ผ่าน loadJson/saveJson (นิยามใน auth.php) — require ไฟล์นี้หลัง auth.php
// เก็บ state แยกเป็น 16 bucket ตาม hash ของ key (runtime-only, ถูก gitignore)
// กัน rewrite ไฟล์ก้อนเดียวที่โตขึ้นเรื่อยๆ ทุก request + ล็อกไม่ชนกันข้าม bucket

require_once __DIR__ . '/../auth/auth.php';

if (!function_exists('rateLimitFileFor')) {
    /**
     * เลือกไฟล์ bucket จาก hash ของ key — logic เดียวกันทุก caller จึงเสถียร
     */
    function rateLimitFileFor(string $key): string
    {
        $bucket = abs(crc32($key)) % 16;
        return DATA_PATH . '/ratelimit_' . $bucket . '.json';
    }
}

if (!function_exists('migrateLegacyRateLimitFile')) {
    /**
     * ย้าย state จากไฟล์รวมเดิม (ratelimit.json) กระจายลง bucket ครั้งเดียว —
     * รันครั้งแรกต่อ request (static flag) แล้วลบไฟล์เดิมทิ้ง
     */
    function migrateLegacyRateLimitFile(): void
    {
        $legacy = DATA_PATH . '/ratelimit.json';
        if (!is_file($legacy)) {
            return;
        }
        $all = loadJson($legacy);
        if (!empty($all)) {
            $staged = [];
            foreach ($all as $k => $hits) {
                $file = rateLimitFileFor((string) $k);
                if (!isset($staged[$file])) {
                    $staged[$file] = loadJson($file);
                }
                $staged[$file][$k] = $hits;
            }
            foreach ($staged as $file => $data) {
                saveJson($file, $data);
            }
        }
        @unlink($legacy);
    }
}

if (!function_exists('rateLimitCheck')) {
    /**
     * คืน true = ผ่าน (และบันทึกครั้งนี้แล้ว), false = เกินโควต้า
     * prune ข้อมูลเก่าเกินหน้าต่างทุกครั้ง เพื่อกันไฟล์โตไม่จำกัด
     */
    function rateLimitCheck(string $key, int $maxAttempts, int $windowSeconds): bool
    {
        static $migrated = false;
        if (!$migrated) {
            $migrated = true;
            migrateLegacyRateLimitFile();
        }
        $file = rateLimitFileFor($key);
        $now = time();
        $buckets = loadJson($file);

        // Probabilistic global cleanup (1 ใน 50 ครั้ง) เพื่อลด overhead O(N) บนดิสก์
        $didGlobalPrune = (mt_rand(1, 50) === 1);
        if ($didGlobalPrune) {
            $maxWindow = max($windowSeconds, 3600);
            foreach ($buckets as $k => $hits) {
                $kept = array_values(array_filter((array) $hits, fn($t) => ($now - (int) $t) < $maxWindow));
                if (empty($kept)) {
                    unset($buckets[$k]);
                } else {
                    $buckets[$k] = $kept;
                }
            }
        }

        // ตัดเฉพาะประวัติของ key ปัจจุบัน
        $recent = array_values(array_filter(
            (array) ($buckets[$key] ?? []),
            fn($t) => ($now - (int) $t) < $windowSeconds
        ));

        if (count($recent) >= $maxAttempts) {
            // ถ้าถูกบล็อก ไม่ต้องบันทึกซ้ำลงดิสก์หากไม่ได้ทำ global cleanup
            if ($didGlobalPrune) {
                saveJson($file, $buckets);
            }
            return false;
        }

        $recent[] = $now;
        $buckets[$key] = $recent;
        saveJson($file, $buckets);
        return true;
    }
}

if (!function_exists('clientRateLimitKey')) {
    /**
     * แยกโควต้าตาม endpoint scope + IP ผู้เรียก
     */
    function clientRateLimitKey(string $scope): string
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        return $scope . ':' . $ip;
    }
}
