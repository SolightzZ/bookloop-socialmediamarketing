<?php

// ─── Shared File Storage Helper (File-based JSON store with flock) ────────
// แยกการอ่าน/เขียน JSON ออกจาก auth.php เพื่อให้ endpoint สาธารณะ (เช่น books.php)
// ไม่ต้องโหลดตรรกะ auth/users/tokens โดยไม่จำเป็น

if (!function_exists('loadJson')) {
    /**
     * โหลดข้อมูลจากไฟล์ JSON พร้อม shared lock (LOCK_SH) และ in-request memoization
     */
    function loadJson(string $filePath): array
    {
        static $memoryCache = [];

        if (!file_exists($filePath)) {
            return [];
        }

        $mtime = filemtime($filePath);
        $cacheKey = $filePath . ':' . $mtime;

        if (isset($memoryCache[$cacheKey])) {
            return $memoryCache[$cacheKey];
        }

        $fp = fopen($filePath, 'r');
        if ($fp === false) {
            return [];
        }

        flock($fp, LOCK_SH);
        $content = stream_get_contents($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        if ($content === false || trim($content) === '') {
            $memoryCache[$cacheKey] = [];
            return [];
        }

        $data = json_decode($content, true);
        $result = is_array($data) ? $data : [];
        $memoryCache[$cacheKey] = $result;

        return $result;
    }
}

if (!function_exists('saveJson')) {
    /**
     * บันทึกข้อมูลลงไฟล์ JSON พร้อม exclusive lock (LOCK_EX)
     * ไม่ใช้ JSON_PRETTY_PRINT ในโหมด production เพื่อประหยัดพื้นที่ดิสก์และเร่งความเร็ว I/O
     */
    function saveJson(string $filePath, array $data): bool
    {
        $dir = dirname($filePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // 'c' = สร้างไฟล์ถ้ายังไม่มี แต่ไม่ truncate ก่อนได้ lock
        $fp = fopen($filePath, 'c');
        if ($fp === false) {
            return false;
        }

        flock($fp, LOCK_EX);
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        // ล้าง stat cache เพื่อให้ filemtime อัปเดตทันที
        clearstatcache(true, $filePath);

        return true;
    }
}

if (!function_exists('cacheGet')) {
    /**
     * อ่านผลลัพธ์ที่แคชไว้ใน sys temp (รอดชีวิตข้าม request แบบเดียวกับ .env cache
     * ใน config.php) — ใช้กับ response ที่คำนวณแพง (filter/sort ไฟล์ JSON ทั้งก้อน)
     * คืน null เมื่อไม่มี cache / source file เปลี่ยน (mtime ไม่ตรง) / หมด TTL
     */
    function cacheGet(string $key, int $sourceMtime, int $ttlSeconds): ?array
    {
        $file = sys_get_temp_dir() . '/bookloop_cache_' . md5($key) . '.json';
        if (!is_file($file)) {
            return null;
        }
        $raw = @file_get_contents($file);
        if ($raw === false) {
            return null;
        }
        $payload = json_decode($raw, true);
        if (!is_array($payload) || ($payload['mtime'] ?? -1) !== $sourceMtime) {
            return null;
        }
        if (time() - (int) ($payload['at'] ?? 0) > $ttlSeconds) {
            return null;
        }
        return is_array($payload['data'] ?? null) ? $payload['data'] : null;
    }
}

if (!function_exists('cacheSet')) {
    /**
     * เขียนผลลัพธ์ลง cache (best-effort — เขียนไม่สำเร็จก็แค่คำนวณใหม่รอบหน้า)
     */
    function cacheSet(string $key, int $sourceMtime, array $data): void
    {
        $file = sys_get_temp_dir() . '/bookloop_cache_' . md5($key) . '.json';
        @file_put_contents(
            $file,
            json_encode(['mtime' => $sourceMtime, 'at' => time(), 'data' => $data], JSON_UNESCAPED_UNICODE),
            LOCK_EX
        );
    }
}

if (!function_exists('countUserActiveOrders')) {
    /**
     * นับออเดอร์ที่ไม่ถูกยกเลิก/ล้มเหลว/คืนเงินของ user — แคชตาม mtime ของ
     * orders.json (ไฟล์เปลี่ยน cache หลุดเอง ผลลัพธ์ตรงกับสแกนจริงเสมอ)
     * ใช้แทนการ parse + วน orders.json ทั้งไฟล์ใน promo_validate/NEW10 check
     */
    function countUserActiveOrders(string $userId): int
    {
        $ordersFile = DATA_PATH . '/orders.json';
        $mtime = is_file($ordersFile) ? (int) filemtime($ordersFile) : 0;
        $cached = cacheGet('userordercount:' . $userId, $mtime, 3600);
        if (is_array($cached) && isset($cached['n']) && is_int($cached['n'])) {
            return $cached['n'];
        }
        $n = 0;
        foreach (loadJson($ordersFile) as $order) {
            if (!is_array($order)) {
                continue;
            }
            if (($order['userId'] ?? '') !== $userId) {
                continue;
            }
            if (!in_array((string) ($order['status'] ?? ''), ['cancelled', 'failed', 'refunded'], true)) {
                $n++;
            }
        }
        cacheSet('userordercount:' . $userId, $mtime, ['n' => $n]);
        return $n;
    }
}
