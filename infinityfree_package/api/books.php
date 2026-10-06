<?php

// GET /api/books.php?q=&category=&limit=20&offset=0&sort=rating|price_asc|price_desc — แค็ตตาล็อกหนังสือ (สาธารณะ)
// อ่าน snapshot จาก data/books.json (generate จาก src/data/books.ts — ดู scripts/export-books.mjs)

require_once __DIR__ . '/../Services/Http.php';
require_once __DIR__ . '/../Services/Storage.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!defined('BOOKS_FILE')) {
    define('BOOKS_FILE', DATA_PATH . '/books.json');
}

$fileMtime = file_exists(BOOKS_FILE) ? filemtime(BOOKS_FILE) : 0;
$q = mb_strtolower(trim((string) ($_GET['q'] ?? '')));
$category = trim((string) ($_GET['category'] ?? ''));
$sort = trim((string) ($_GET['sort'] ?? 'rating'));
$limit = (int) ($_GET['limit'] ?? 20);
$limit = max(1, min($limit, 100));
$offset = max(0, (int) ($_GET['offset'] ?? 0));

// HTTP Caching & Conditional 304 Not Modified
// ประหยัด CPU และ bandwidth มหาศาลเมื่อเบราว์เซอร์หรือบอทเรียกซ้ำ
$paramSig = md5($q . '|' . $category . '|' . $sort . '|' . $limit . '|' . $offset);
$etag = '"' . dechex($fileMtime) . '-' . $paramSig . '"';

header('ETag: ' . $etag);
header('Cache-Control: public, max-age=60, stale-while-revalidate=120');

if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
    http_response_code(304);
    exit();
}

$books = loadJson(BOOKS_FILE);
if (!is_array($books)) {
    $books = [];
}

$filtered = array_values(array_filter($books, function ($b) use ($q, $category) {
    if (!is_array($b)) {
        return false;
    }
    if ($category !== '' && ($b['category'] ?? '') !== $category) {
        return false;
    }
    if ($q !== '') {
        $haystack = mb_strtolower(
            ($b['title'] ?? '') . ' ' . ($b['author'] ?? '') . ' ' . ($b['isbn'] ?? '')
        );
        if (!str_contains($haystack, $q)) {
            return false;
        }
    }
    return true;
}));

if ($sort === 'price_asc') {
    usort($filtered, fn($a, $b) => ((float) ($a['price'] ?? 0)) <=> ((float) ($b['price'] ?? 0)));
} elseif ($sort === 'price_desc') {
    usort($filtered, fn($a, $b) => ((float) ($b['price'] ?? 0)) <=> ((float) ($a['price'] ?? 0)));
} else {
    usort($filtered, function ($a, $b) {
        $cmp = ((float) ($b['rating'] ?? 0)) <=> ((float) ($a['rating'] ?? 0));
        return $cmp !== 0 ? $cmp : ((int) ($b['reviewCount'] ?? 0)) <=> ((int) ($a['reviewCount'] ?? 0));
    });
}

$total = count($filtered);
$items = array_slice($filtered, $offset, $limit);

jsonResponse(['success' => true, 'total' => $total, 'items' => $items, 'count' => count($items)]);
