<?php

// GET /api/listings_list.php?q=&category=&limit=20&offset=0 — ดูรายการลงขาย (สาธารณะ)

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!defined('LISTINGS_FILE')) {
    define('LISTINGS_FILE', DATA_PATH . '/listings.json');
}

$q = mb_strtolower(trim((string) ($_GET['q'] ?? '')));
$category = trim((string) ($_GET['category'] ?? ''));
$mine = trim((string) ($_GET['mine'] ?? ''));

// ?mine=1 ต้องล็อกอิน — ดูเฉพาะรายการของตัวเอง (รวมทุก status)
$ownerId = null;
if ($mine === '1') {
    $token = getBearerToken();
    $ownerId = $token !== null ? validateToken($token) : null;
    if ($ownerId === null) {
        jsonResponse(['success' => false, 'message' => 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง'], 401);
    }
}

$limit = (int) ($_GET['limit'] ?? 20);
$limit = max(1, min($limit, 50));
$offset = max(0, (int) ($_GET['offset'] ?? 0));

$listings = loadJson(LISTINGS_FILE);

$filtered = array_values(array_filter($listings, function ($l) use ($q, $category, $ownerId) {
    if ($ownerId !== null) {
        if (($l['userId'] ?? '') !== $ownerId) {
            return false;
        }
    } elseif (($l['status'] ?? '') !== 'active') {
        return false;
    }
    if ($category !== '' && ($l['category'] ?? '') !== $category) {
        return false;
    }
    if ($q !== '') {
        $haystack = mb_strtolower(
            ($l['title'] ?? '') . ' ' . ($l['author'] ?? '') . ' ' . ($l['isbn'] ?? '')
        );
        if (!str_contains($haystack, $q)) {
            return false;
        }
    }
    return true;
}));

$total = count($filtered);
$items = array_slice($filtered, $offset, $limit);

jsonResponse(['success' => true, 'total' => $total, 'items' => $items, 'count' => count($items)]);
