<?php
/*
 * POST /api/auth_onboarding.php (ต้องแนบ Bearer token)
 *
 * บันทึกหมวดหนังสือที่ผู้ใช้สนใจหลังสมัครสมาชิก (first-time onboarding)
 * และส่ง personalized welcome email แบบ non-blocking + idempotent
 *
 * Request JSON:
 * {
 *   "categories": ["novel", "growth", ...],   // สูงสุด 8 id (core + expansion)
 *   "favoriteBooks": ["b1", "b2", ...],       // optional, id หนังสือที่ชอบ สูงสุด 20
 *   "recommendedBooks": [                      // optional, สูงสุด 6 เล่ม (frontend คำนวณมาให้)
 *     { "id","title","author","price","category","cover","url" }
 *   ],
 *   "skipped": false
 * }
 *
 * Response 200:
 * { "success": true, "user": {...}, "welcomeEmailQueued": true|false }
 */

require_once __DIR__ . '/../auth/auth.php';
require_once BASE_PATH . '/Services/RateLimiter.php';
require_once BASE_PATH . '/Services/BackgroundMail.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$token = getBearerToken();

if (!$token) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบ token กรุณาเข้าสู่ระบบ'], 401);
}

$userId = validateToken($token);

if (!$userId) {
    jsonResponse(['success' => false, 'message' => 'Token หมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่'], 401);
}

// กันยิงซ้ำรัวๆ: สูงสุด 30 ครั้งต่อชั่วโมงต่อ IP
if (!rateLimitCheck(clientRateLimitKey('onboarding'), 30, 3600)) {
    jsonResponse(['success' => false, 'message' => 'ทำรายการบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'], 429);
}

$user = findUserById($userId);

if (!$user) {
    jsonResponse(['success' => false, 'message' => 'ไม่พบข้อมูลผู้ใช้งาน'], 404);
}

$data = getRequestData();
$skipped = filter_var($data['skipped'] ?? false, FILTER_VALIDATE_BOOLEAN);

$rawCategories = $data['categories'] ?? [];
if (!is_array($rawCategories)) {
    $rawCategories = [];
}

// whitelist หมวดหลัก 8 + หมวดเสริม 8 (รองรับ expansion โดยไม่ต้องแก้ UI)
$allowedCategoryIds = [
    'novel', 'growth', 'business', 'knowledge', 'comic', 'education', 'kids', 'rare',
    'science', 'history', 'technology', 'psychology', 'finance', 'health', 'art', 'language',
];

$categories = [];
foreach ($rawCategories as $raw) {
    $id = strtolower(trim((string)$raw));
    if ($id !== '' && in_array($id, $allowedCategoryIds, true) && !in_array($id, $categories, true)) {
        $categories[] = $id;
    }
    if (count($categories) >= 8) {
        break;
    }
}

if ($skipped) {
    $categories = [];
}

// id หนังสือที่ผู้ใช้กดชอบ (เก็บไว้ใช้ปรับ recommendation ภายหลัง, สูงสุด 20)
$rawFavBooks = $data['favoriteBooks'] ?? [];
if (!is_array($rawFavBooks)) {
    $rawFavBooks = [];
}
$favoriteBooks = [];
foreach ($rawFavBooks as $rawFav) {
    $favId = substr(trim((string)$rawFav), 0, 64);
    if ($favId !== '' && !in_array($favId, $favoriteBooks, true)) {
        $favoriteBooks[] = $favId;
    }
    if (count($favoriteBooks) >= 20) {
        break;
    }
}
if ($skipped) {
    $favoriteBooks = [];
}

// sanitize หนังสือแนะนำจาก client (สูงสุด 6 เล่ม, เฉพาะ field ที่ต้องใช้ในอีเมล)
$rawBooks = $data['recommendedBooks'] ?? [];
if (!is_array($rawBooks)) {
    $rawBooks = [];
}
$recommendedBooks = [];
foreach ($rawBooks as $rawBook) {
    if (!is_array($rawBook)) {
        continue;
    }
    $cover = trim((string)($rawBook['cover'] ?? ''));
    $url = trim((string)($rawBook['url'] ?? ''));
    // รับเฉพาะ http(s) ป้องกัน javascript:/data: URI ในอีเมล
    if ($cover !== '' && !preg_match('#^https?://#i', $cover)) {
        $cover = '';
    }
    if ($url !== '' && !preg_match('#^https?://#i', $url)) {
        $url = '';
    }
    $recommendedBooks[] = [
        'id'       => substr((string)($rawBook['id'] ?? ''), 0, 64),
        'title'    => mb_substr(trim((string)($rawBook['title'] ?? 'หนังสือแนะนำ')), 0, 200),
        'author'   => mb_substr(trim((string)($rawBook['author'] ?? '')), 0, 200),
        'price'    => max(0, (float)($rawBook['price'] ?? 0)),
        'category' => mb_substr(trim((string)($rawBook['category'] ?? '')), 0, 100),
        'cover'    => substr($cover, 0, 500),
        'url'      => substr($url, 0, 500),
    ];
    if (count($recommendedBooks) >= 6) {
        break;
    }
}

$existingPrefs = (isset($user['preferences']) && is_array($user['preferences'])) ? $user['preferences'] : [];
$welcomeSentAt = $existingPrefs['welcomeEmailSentAt'] ?? null;

$preferences = [
    'categories' => $categories,
    'favoriteBooks' => $favoriteBooks,
    'onboardingCompleted' => true,
    'skipped' => $skipped,
    'preferencesUpdatedAt' => date('c'),
    'welcomeEmailSentAt' => $welcomeSentAt,
];

// ส่ง personalized welcome email เฉพาะ: ไม่ข้าม + เลือกอย่างน้อย 1 หมวด + ยังไม่เคยส่ง
$shouldSendWelcome = !$skipped && !empty($categories) && empty($welcomeSentAt);

if ($shouldSendWelcome) {
    // mark ไว้ก่อนกันส่งซ้ำ (idempotent) — ถ้า SMTP fail ก็ไม่ rollback onboarding
    $preferences['welcomeEmailSentAt'] = date('c');
}

updateUser($userId, ['preferences' => $preferences]);

if ($shouldSendWelcome) {
    $safeName = $user['name'] ?? '';
    $safeEmail = $user['email'] ?? '';
    $prefsSnapshot = $preferences;
    $booksSnapshot = $recommendedBooks;
    // ส่งอีเมลแบบ non-blocking — fail แล้วไม่กระทบ response
    runAfterResponse(function () use ($safeEmail, $safeName, $prefsSnapshot, $booksSnapshot) {
        require_once __DIR__ . '/../Services/emailService.php';
        require_once BASE_PATH . '/Services/Logger.php';
        try {
            $result = sendOnboardingWelcomeEmailService($safeEmail, $safeName, $prefsSnapshot['categories'], $booksSnapshot);
            if (empty($result['success'])) {
                Logger::getInstance()->log('WARNING', 'Onboarding welcome email failed', [
                    'email' => $safeEmail,
                    'error' => $result['error'] ?? 'unknown',
                ]);
            }
        } catch (Throwable $e) {
            // email fail ไม่กระทบ onboarding — log ไว้เฉยๆ + console
            try {
                Logger::getInstance()->log('ERROR', 'Onboarding welcome email exception', [
                    'email' => $safeEmail,
                    'error' => $e->getMessage(),
                ]);
            } catch (Throwable $ignored) {
                error_log("[BookLoop][ERROR] Onboarding welcome email exception: " . $e->getMessage() . " to={$safeEmail}");
            }
        }
    });
}

$freshUser = findUserById($userId);
unset($freshUser['password']);

jsonResponse([
    'success' => true,
    'user' => $freshUser,
    'welcomeEmailQueued' => $shouldSendWelcome,
]);
