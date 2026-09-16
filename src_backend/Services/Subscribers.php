<?php

// ─── Subscribers file helpers (subscribers.txt) ──────────────────
// Reusable: ใช้ร่วมกันระหว่าง /api/newsletter_status.php และ /api/subscribe_newsletter.php
// รูปแบบไฟล์: 1 บรรทัดต่อ 1 ผู้สมัคร — email เท่านั้น หรือ "email | pref1, pref2"

require_once __DIR__ . '/../config/config.php';

if (!function_exists('isEmailSubscribed')) {
    /**
     * เช็คว่าอีเมลสมัครรับข่าวสารอยู่หรือไม่ (เทียบคอลัมน์แรกก่อน '|', ไม่สนตัวพิมพ์)
     */
    function isEmailSubscribed(string $email, string $filePath): bool
    {
        if (!file_exists($filePath)) {
            return false;
        }
        $lines = file($filePath, FILE_IGNORE_NEW_LINES);
        $target = strtolower(trim($email));
        foreach ($lines as $line) {
            $lineEmail = strtolower(trim(explode('|', $line)[0]));
            if ($lineEmail !== '' && $lineEmail === $target) {
                return true;
            }
        }
        return false;
    }
}

if (!function_exists('removeEmail')) {
    /**
     * ลบอีเมลออกจากไฟล์ (เขียนแบบ atomic ภายใต้ lock กันข้อมูลหายเมื่อ request ชนกัน)
     */
    function removeEmail(string $email, string $filePath): bool
    {
        if (!file_exists($filePath)) {
            return false;
        }
        $lines = file($filePath, FILE_IGNORE_NEW_LINES);
        $target = strtolower(trim($email));
        $filtered = array_values(array_filter($lines, function ($line) use ($target) {
            $lineEmail = strtolower(trim(explode('|', $line)[0]));
            return $lineEmail !== $target;
        }));

        $fp = fopen($filePath, 'c');
        if ($fp === false) {
            return false;
        }
        flock($fp, LOCK_EX);
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, implode("\n", $filtered) . (empty($filtered) ? '' : "\n"));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        return true;
    }
}

if (!function_exists('appendSubscriber')) {
    /**
     * เพิ่มผู้สมัคร 1 บรรทัด (append ภายใต้ lock)
     */
    function appendSubscriber(string $filePath, string $line): bool
    {
        return file_put_contents($filePath, rtrim($line) . "\n", FILE_APPEND | LOCK_EX) !== false;
    }
}
