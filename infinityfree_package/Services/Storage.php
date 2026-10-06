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
