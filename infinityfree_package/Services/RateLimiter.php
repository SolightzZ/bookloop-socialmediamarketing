<?php

// ─── Fixed-window rate limiter แบบ file-backed ─────────────────────
// ใช้ flock ผ่าน loadJson/saveJson (นิยามใน auth.php) — require ไฟล์นี้หลัง auth.php
// เก็บ state ใน DATA_PATH/ratelimit.json (runtime-only, ถูก gitignore)

require_once __DIR__ . '/../auth/auth.php';

if (!function_exists('rateLimitCheck')) {
    /**
     * คืน true = ผ่าน (และบันทึกครั้งนี้แล้ว), false = เกินโควต้า
     * prune ข้อมูลเก่าเกินหน้าต่างทุกครั้ง เพื่อกันไฟล์โตไม่จำกัด
     */
    function rateLimitCheck(string $key, int $maxAttempts, int $windowSeconds): bool
    {
        $file = DATA_PATH . '/ratelimit.json';
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
