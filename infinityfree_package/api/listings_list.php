<?php

// GET /api/listings_list.php?q=&category=&limit=20&offset=0 — ดูรายการลงขาย (สาธารณะ)

require_once __DIR__ . '/../auth/auth.php';

corsHeaders();

// GET (เดิม, มี ETag cache) หรือ POST — frontend ใช้ POST + token ใน body
// เฉพาะ ?mine=1 (กัน token รั่วผ่าน query) ส่วน catalog สาธารณะเรียก GET แบบไม่แนบ token
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!defined('LISTINGS_FILE')) {
    define('LISTINGS_FILE', DATA_PATH . '/listings.json');
}

$req = $method === 'POST' ? getRequestData() : $_GET;
$id = trim((string) ($req['id'] ?? ''));
$q = mb_strtolower(trim((string) ($req['q'] ?? '')));
$category = trim((string) ($req['category'] ?? ''));
$mine = trim((string) ($req['mine'] ?? ''));
$limit = (int) ($req['limit'] ?? 20);
$limit = max(1, min($limit, 50));
$offset = max(0, (int) ($req['offset'] ?? 0));

// HTTP Caching & Conditional 304 for public requests
$isPublic = ($mine !== '1');
if ($isPublic) {
    $fileMtime = file_exists(LISTINGS_FILE) ? filemtime(LISTINGS_FILE) : 0;
    $paramSig = md5($id . '|' . $q . '|' . $category . '|' . $limit . '|' . $offset);
    $etag = '"' . dechex($fileMtime) . '-' . $paramSig . '"';

    header('ETag: ' . $etag);
    header('Cache-Control: public, max-age=30, stale-while-revalidate=60');

    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit();
    }
} else {
    header('Cache-Control: private, no-cache, no-store, must-revalidate');
}

// result cache 30s เฉพาะ catalog สาธารณะแบบ list (?id= / ?mine=1 ข้าม — ถูกและต้องสดเสมอ)
// key ตาม params + mtime ของ listings.json — ไฟล์เปลี่ยน cache หลุดเอง
$useResultCache = ($isPublic && $id === '');
if ($useResultCache) {
    $cached = cacheGet('listings:' . $paramSig, $fileMtime, 30);
    if (is_array($cached)) {
        jsonResponse($cached);
    }
}

$listings = loadJson(LISTINGS_FILE);

// ดึงรายการเดียวโดยตรงตาม ID (?id=LST-...)
if ($id !== '') {
    foreach ($listings as $l) {
        if (($l['id'] ?? '') === $id) {
            jsonResponse(['success' => true, 'total' => 1, 'items' => [$l], 'count' => 1]);
        }
    }
    jsonResponse(['success' => false, 'message' => 'ไม่พบข้อมูลรายการลงขายนี้', 'items' => [], 'total' => 0], 404);
}

// ?mine=1 ต้องล็อกอิน — ดูเฉพาะรายการของตัวเอง (รวมทุก status)
$ownerId = null;
if ($mine === '1') {
    $token = getBearerToken();
    $ownerId = $token !== null ? validateToken($token) : null;
    if ($ownerId === null) {
        jsonResponse(['success' => false, 'message' => 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง'], 401);
    }
}

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
            ($l['id'] ?? '') . ' ' . ($l['title'] ?? '') . ' ' . ($l['author'] ?? '') . ' ' . ($l['isbn'] ?? '')
        );
        if (!str_contains($haystack, $q)) {
            return false;
        }
    }
    return true;
}));

$total = count($filtered);
$items = array_slice($filtered, $offset, $limit);

$response = ['success' => true, 'total' => $total, 'items' => $items, 'count' => count($items)];
if ($useResultCache) {
    cacheSet('listings:' . $paramSig, $fileMtime, $response);
}
jsonResponse($response);
