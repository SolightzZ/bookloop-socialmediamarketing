<?php
// BookLoop backend — System Dashboard (สายระบบ · สาธารณะ · อ่านอย่างเดียว)
// ไฟล์นี้อยู่ root ของ package ซึ่งตรงกับ htdocs/ บน server 1:1
// หน้านี้ไม่แตะข้อมูลผู้ใช้ (users/orders) และไม่แสดงค่าใด ๆ จาก .env (โชว์แค่มี/ไม่มี)
// โหมด read-only: ไม่มีปุ่มลบ/ล้าง/แก้สถานะใด ๆ ทั้งสิ้น

$checks = [];
$appOk = true;
$envError = '';
$requestHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
header('Permissions-Policy: unload=self');

// 1) config + .env โหลดได้หรือไม่ (config.php จะ throw ถ้าไม่มี .env)
try {
    require_once __DIR__ . '/config/config.php';
    $checks['env'] = ['ok' => true, 'label' => 'config + .env', 'detail' => ''];
} catch (Throwable $e) {
    $appOk = false;
    $envError = $e->getMessage();
    error_log("[BookLoop][ERROR] dashboard config load failed: " . $e->getMessage());
    $checks['env'] = [
        'ok' => false,
        'label' => 'config + .env (.env หาย?)',
        'detail' => $envError,
    ];
}

// 2) composer vendor (PHPMailer)
if (!empty($checks['env']['ok'])) {
    $vendorOk = file_exists(BASE_PATH . '/vendor/autoload.php');
    $checks['vendor'] = [
        'ok' => $vendorOk,
        'label' => 'vendor/autoload.php',
        'detail' => $vendorOk ? '' : 'ลืมอัปโหลดโฟลเดอร์ vendor/ (รัน composer install ในเครื่องก่อน แล้วอัปโหลดขึ้น htdocs/)',
    ];
    $appOk = $appOk && $vendorOk;
}

// 3) โฟลเดอร์ data เขียนได้ (ที่เก็บไฟล์แบบ file-based)
if (!empty($checks['env']['ok'])) {
    if (!is_dir(DATA_PATH)) {
        @mkdir(DATA_PATH, 0755, true);
    }
    $dataOk = is_dir(DATA_PATH) && is_writable(DATA_PATH);
    $checks['data'] = [
        'ok' => $dataOk,
        'label' => 'data/ เขียนได้',
        'detail' => $dataOk ? '' : 'สร้างโฟลเดอร์ data/ ใน htdocs/ แล้วตั้งสิทธิ์ 755/775 ให้ PHP เขียนได้',
    ];
    $appOk = $appOk && $dataOk;
}

// 4) .htaccess อยู่ครบ (CORS/authorization passthrough พึ่งไฟล์นี้)
$htOk = is_file(__DIR__ . '/.htaccess');
$checks['htaccess'] = [
    'ok' => $htOk,
    'label' => '.htaccess',
    'detail' => $htOk ? '' : 'ไม่พบ .htaccess ใน htdocs/ — อัปโหลดจาก infinityfree_package/.htaccess',
];
$appOk = $appOk && $htOk;

// 5) ไฟล์ api/ อยู่ครบ (นับไฟล์จริง ไม่ hardcode)
$apiFiles = glob(__DIR__ . '/api/*.php') ?: [];
$apiCount = count(array_filter($apiFiles, fn($f) => basename($f) !== 'index.php'));
$apiOk = $apiCount >= 10;
$checks['api'] = [
    'ok' => $apiOk,
    'label' => "api/ ($apiCount endpoints)",
    'detail' => $apiOk ? '' : 'ไฟล์ใน api/ หายไปหลายไฟล์ — อัปโหลดเนื้อใน infinityfree_package/ ทับของเดิมให้ครบ',
];
$appOk = $appOk && $apiOk;

// 6) ตั้งค่าเมลครบพอส่งได้ไหม (โชว์แค่มี/ไม่มี — ห้ามโชว์ค่า .env)
if (!empty($checks['env']['ok'])) {
    $mailReady = SMTP_HOST !== '' && SMTP_USERNAME !== '' && SMTP_PASSWORD !== '' && MAIL_FROM_ADDRESS !== '';
    $checks['mail'] = [
        'ok' => $mailReady,
        'label' => 'ตั้งค่าอีเมล (SMTP)',
        'detail' => $mailReady ? '' : 'SMTP_HOST / SMTP_USERNAME / SMTP_PASSWORD / MAIL_FROM_ADDRESS ใน .env ยังว่าง — ระบบสมัคร/แจ้งเตือนจะส่งเมลไม่ได้',
    ];
    // เมลไม่พร้อม = เตือน แต่ไม่ถือว่าระบบล่ม (API หลักยังรันได้)
} else {
    $mailReady = false;
}

// 7) PHP extensions ที่ backend ต้องใช้
$needExt = ['curl' => 'ยิง selftest loopback', 'mbstring' => 'ตัด/ค้นข้อความไทย', 'openssl' => 'SMTP TLS', 'json' => 'ตอบ API'];
$missingExt = [];
foreach ($needExt as $ext => $why) {
    if (!extension_loaded($ext)) {
        $missingExt[] = $ext . ' (' . $why . ')';
    }
}
$extOk = count($missingExt) === 0;
$checks['php'] = [
    'ok' => $extOk,
    'label' => 'PHP ' . PHP_VERSION,
    'detail' => $extOk ? '' : 'extension หาย: ' . implode(', ', $missingExt),
];
$appOk = $appOk && $extOk;

// ─── Endpoint catalog: ค้นไฟล์จริงใน api/ + คำอธิบายคงที่ ───
// method/auth/desc อ่านจาก map นี้ (เพิ่มไฟล์ใหม่แล้วตารางจะโผล่เองพร้อมคำอธิบาย default)
$ENDPOINT_META = [
    'auth_login.php' => ['POST', 'เปิด', 'เข้าสู่ระบบ'],
    'auth_register.php' => ['POST', 'เปิด', 'สมัครสมาชิก'],
    'auth_logout.php' => ['POST', 'token', 'ออกจากระบบ'],
    'auth_me.php' => ['GET/POST', 'token', 'ข้อมูล session ปัจจุบัน (POST: token ใน body)'],
    'auth_update_profile.php' => ['POST', 'token', 'แก้โปรไฟล์'],
    'auth_delete_account.php' => ['POST', 'token', 'ลบบัญชี'],
    'auth_onboarding.php' => ['POST', 'token', 'onboarding'],
    'auth_change_password.php' => ['POST', 'token', 'เปลี่ยนรหัสผ่าน'],
    'auth_forgot_password.php' => ['POST', 'เปิด', 'ขอรีเซ็ตรหัสผ่าน'],
    'auth_reset_password.php' => ['POST', 'เปิด', 'ตั้งรหัสผ่านใหม่'],
    'books.php' => ['GET', 'เปิด', 'แค็ตตาล็อกหนังสือ (ค้นหา/หมวด/เรียง)'],
    'listings_list.php' => ['GET/POST', 'เปิด/mine=token', 'ดูรายการลงขาย (mine=1 ควรใช้ POST)'],
    'listings_create.php' => ['POST', 'token', 'ลงขายหนังสือ'],
    'listings_update.php' => ['POST', 'token', 'แก้ไขข้อมูลและรูปภาพรายการลงขาย'],
    'listings_moderate.php' => ['POST', 'admin-token', 'อนุมัติ / ปฏิเสธรายการลงขาย (เฉพาะผู้ดูแล)'],
    'orders_create.php' => ['POST', 'token', 'สร้างคำสั่งซื้อ'],
    'orders_list.php' => ['GET/POST', 'token', 'ดูคำสั่งซื้อของตัวเอง (POST: token ใน body)'],
    'orders_detail.php' => ['GET', 'token', 'รายละเอียดคำสั่งซื้อ'],
    'orders_update_status.php' => ['POST', 'token', 'ยกเลิก / ยืนยันชำระ'],
    'subscribe.php' => ['POST', 'เปิด', 'สมัครรับข่าวสาร'],
    'subscribe_newsletter.php' => ['POST', 'เปิด', 'สมัคร newsletter'],
    'newsletter_status.php' => ['POST/DELETE', 'เปิด', 'เช็กสถานะ (POST) / ยกเลิก subscribe'],
    'track.php' => ['POST', 'เปิด', 'ส่ง event (page_view/cart/purchase/…)'],
    'log.php' => ['POST', 'เปิด*', 'รับ log จาก frontend (rate-limit)'],
    'logs.php' => ['GET/DELETE', 'token', 'ดู/ล้าง app log'],
    'request_log.php' => ['GET/DELETE', 'token', 'ดู/ล้าง access log'],
    'user_state.php' => ['GET/POST', 'token', 'sync ตะกร้า + รายการโปรด'],
];
$endpoints = [];
foreach ($apiFiles as $f) {
    $base = basename($f);
    if ($base === 'index.php') {
        continue;
    }
    $meta = $ENDPOINT_META[$base] ?? ['—', '?', ''];
    $endpoints[] = [$meta[0], '/api/' . $base, $meta[2], $meta[1]];
}
usort($endpoints, fn($a, $b) => strcmp($a[1], $b[1]));

// ─── สถานะไฟล์ data/ (ชื่อ + ขนาด + จำนวนบรรทัด — ไม่อ่านเนื้อหาโชว์) ───
function bl_file_stat(string $file): ?array
{
    if (!is_file($file) || !is_readable($file)) {
        return null;
    }
    $size = filesize($file);
    $lines = 0;
    $fp = @fopen($file, 'r');
    if ($fp !== false) {
        while (!feof($fp)) {
            $chunk = fread($fp, 8192);
            if ($chunk === false) {
                break;
            }
            $lines += substr_count($chunk, "\n");
        }
        fclose($fp);
    }
    return ['size' => $size === false ? 0 : $size, 'lines' => $lines];
}

function bl_human_size(int $bytes): string
{
    if ($bytes < 1024) {
        return $bytes . ' B';
    }
    if ($bytes < 1048576) {
        return round($bytes / 1024, 1) . ' KB';
    }
    return round($bytes / 1048576, 2) . ' MB';
}

$dataDir = (!empty($checks['env']['ok']) && defined('DATA_PATH')) ? DATA_PATH : __DIR__ . '/data';
$dataWatch = ['request.log' => 'access log ทุก request', 'error.log' => 'app log (WARNING+)', 'selftest.log' => 'หลักฐาน selftest'];
$dataFiles = [];
foreach ($dataWatch as $name => $desc) {
    $st = bl_file_stat($dataDir . '/' . $name);
    $dataFiles[] = [
        'name' => 'data/' . $name,
        'desc' => $desc,
        'exists' => $st !== null,
        'size' => $st !== null ? bl_human_size($st['size']) : '—',
        'lines' => $st !== null ? $st['lines'] : null,
    ];
}

// ─── รายการลงขาย (อ่านจาก data/listings.json — โชว์แค่ข้อมูลขาย ไม่โชว์ userId/token) ───
$moderateListings = [];
$moderateFile = $dataDir . '/listings.json';
if (is_file($moderateFile) && is_readable($moderateFile)) {
    $decodedMod = json_decode((string) @file_get_contents($moderateFile), true);
    if (is_array($decodedMod)) {
        foreach ($decodedMod as $ml) {
            if (!is_array($ml)) {
                continue;
            }
            $moderateListings[] = [
                'id' => (string) ($ml['id'] ?? ''),
                'title' => (string) ($ml['title'] ?? '—'),
                'author' => (string) ($ml['author'] ?? ''),
                'category' => (string) ($ml['category'] ?? ''),
                'condition' => (string) ($ml['condition'] ?? ''),
                'image' => (string) ($ml['image'] ?? ''),
                'story' => (string) ($ml['story'] ?? ''),
                'defects' => (string) ($ml['defects'] ?? ''),
                'price' => isset($ml['price']) ? (float) $ml['price'] : 0,
                'originalPrice' => isset($ml['originalPrice']) ? (float) $ml['originalPrice'] : null,
                'status' => (string) ($ml['status'] ?? 'active'),
                'createdAt' => (string) ($ml['createdAt'] ?? ''),
            ];
        }
    }
}
usort($moderateListings, fn($a, $b) => strcmp((string)($b['createdAt'] ?? ''), (string)($a['createdAt'] ?? '')));
$pendingCount = count(array_values(array_filter($moderateListings, fn($ml) => $ml['status'] === 'pending')));
$totalListingCount = count($moderateListings);
$activeListingCount = count(array_values(array_filter($moderateListings, fn($ml) => $ml['status'] === 'active')));

if (!function_exists('bl_icon')) {
    /**
     * คืนค่า SVG icon เรขาคณิตสไตล์ Swiss (สำหรับทดแทน emoji ทั้งระบบ)
     */
    function bl_icon(string $name, string $class = 'bl-icon'): string
    {
        $icons = [
            'api' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>',
            'book' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>',
            'chart' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 17V12"/><path d="M12 17V8"/><path d="M16 17V14"/></svg>',
            'inbox' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
            'log' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
            'plug' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 2v6"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></svg>',
            'box' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
            'tools' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            'bolt' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            'folder' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
            'server' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
            'refresh' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
            'search' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
            'play' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
            'pause' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
            'trash' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
            'check' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
            'x' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
            'shield-ban' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="4.5" y1="4.5" x2="19.5" y2="19.5"/></svg>',
            'alert' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            'beaker' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>',
            'globe' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
            'mail' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
            'lock' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
            'wrench' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            'info' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
            'clock' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
            'eye' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
            'eye-off' => '<svg class="' . $class . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>',
        ];
        return $icons[$name] ?? '';
    }
}

if (!function_exists('bl_render_listing_status')) {
    function bl_render_listing_status(string $status): string
    {
        if ($status === 'pending') return '<span class="st-warn">' . bl_icon('clock') . 'รอตรวจสอบ</span>';
        if ($status === 'active') return '<span class="pass">' . bl_icon('check') . 'วางขาย</span>';
        if ($status === 'paused') return '<span class="st-warn" style="color:#f59e0b">' . bl_icon('pause') . 'พักการขาย</span>';
        if ($status === 'rejected') return '<span class="fail">' . bl_icon('x') . 'ปฏิเสธ</span>';
        if ($status === 'sold') return '<span class="soft">' . bl_icon('box') . 'ขายแล้ว</span>';
        if ($status === 'archived') return '<span class="soft" style="color:#94a3b8">' . bl_icon('trash') . 'เก็บถาวร</span>';
        return '<span class="soft">' . htmlspecialchars($status, ENT_QUOTES, 'UTF-8') . '</span>';
    }
}

if (!function_exists('bl_render_condition_badge')) {
    function bl_render_condition_badge(string $cond): string
    {
        $cond = trim($cond);
        if ($cond === '') return '';
        $map = [
            'mint' => ['เหมือนใหม่', '#052e16', '#86efac'],
            'like_new' => ['เหมือนใหม่', '#052e16', '#86efac'],
            'เหมือนใหม่' => ['เหมือนใหม่', '#052e16', '#86efac'],
            'very_good' => ['ดีมาก', '#082f49', '#7dd3fc'],
            'ดีมาก' => ['ดีมาก', '#082f49', '#7dd3fc'],
            'good' => ['ดี', '#451a03', '#fde68a'],
            'ดี' => ['ดี', '#451a03', '#fde68a'],
            'fair' => ['พอใช้', '#431407', '#fdba74'],
            'พอใช้' => ['พอใช้', '#431407', '#fdba74'],
            'acceptable' => ['พอใช้', '#431407', '#fdba74'],
        ];
        $target = $map[mb_strtolower($cond)] ?? [$cond, '#1e293b', '#cbd5e1'];
        return '<span class="cond-badge" style="background:' . $target[1] . ';color:' . $target[2] . '">' . htmlspecialchars($target[0], ENT_QUOTES, 'UTF-8') . '</span>';
    }
}

if (!function_exists('bl_render_listing_cover')) {
    function bl_render_listing_cover(string $img, string $title): string
    {
        $titleEsc = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
        if ($img !== '') {
            $srcEsc = htmlspecialchars($img, ENT_QUOTES, 'UTF-8');
            return '<div class="book-cover-cell"><img src="' . $srcEsc . '" alt="' . $titleEsc . '" class="book-thumb" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div class="book-thumb-fallback" style="display:none">' . bl_icon('book') . '</div></div>';
        }
        return '<div class="book-cover-cell"><div class="book-thumb-fallback">' . bl_icon('book') . '</div></div>';
    }
}

if (!function_exists('bl_render_listing_actions')) {
    function bl_render_listing_actions(string $id, string $status, string $title = ''): string
    {
        $idEsc = htmlspecialchars($id, ENT_QUOTES, 'UTF-8');
        $titleEsc = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
        $out = '<div class="mod-btn-group" role="group" aria-label="จัดการ ' . $titleEsc . '">';
        if ($status === 'pending') {
            $out .= '<button type="button" class="btn btn-sm" data-mod="approve" data-id="' . $idEsc . '" aria-label="อนุมัติ ' . $titleEsc . '">' . bl_icon('check') . 'อนุมัติ</button>';
            $out .= '<button type="button" class="btn btn-sm ghost" data-mod="reject" data-id="' . $idEsc . '" aria-label="ปฏิเสธ ' . $titleEsc . '">' . bl_icon('x') . 'ปฏิเสธ</button>';
        } elseif ($status === 'active') {
            $out .= '<button type="button" class="btn btn-sm ghost btn-warn" data-mod="pause" data-id="' . $idEsc . '" aria-label="หยุดขาย ' . $titleEsc . '">' . bl_icon('pause') . 'หยุดขาย</button>';
        } elseif ($status === 'paused') {
            $out .= '<button type="button" class="btn btn-sm" data-mod="resume" data-id="' . $idEsc . '" aria-label="เริ่มขายใหม่ ' . $titleEsc . '">' . bl_icon('play') . 'เริ่มขายใหม่</button>';
        } elseif ($status === 'archived' || $status === 'rejected') {
            $out .= '<button type="button" class="btn btn-sm ghost" data-mod="resume" data-id="' . $idEsc . '" aria-label="กู้คืนรายการ ' . $titleEsc . '">' . bl_icon('refresh') . 'กู้คืน</button>';
        }
        if ($status !== 'archived') {
            $out .= '<button type="button" class="btn btn-sm ghost btn-danger" data-mod="archive" data-id="' . $idEsc . '" aria-label="เก็บถาวร ' . $titleEsc . '">' . bl_icon('trash') . 'เก็บถาวร</button>';
        } else {
            $out .= '<button type="button" class="btn btn-sm ghost btn-danger" data-mod="delete_permanent" data-id="' . $idEsc . '" aria-label="ลบถาวร ' . $titleEsc . '">' . bl_icon('trash') . 'ลบถาวร</button>';
        }
        $out .= '</div>';
        return $out;
    }
}

// ─── เว็บแอป same-origin (app/ = output ของ `npm run build:app`) ───
// โชว์แค่มี/ไม่มี + ขนาด — เป็นข้อมูลประกอบ ไม่นับเป็น health ของ backend
$appIndexFile = __DIR__ . '/app/index.html';
$appIndexStat = bl_file_stat($appIndexFile);
$appInfo = [
    'exists' => $appIndexStat !== null,
    'size' => $appIndexStat !== null ? bl_human_size($appIndexStat['size']) : '—',
    'htaccess' => is_file(__DIR__ . '/app/.htaccess'),
];

// ─── นับ level ใน error.log (tail เดียว ไม่โหลดทั้งไฟล์) ───
if (!function_exists('bl_read_log_tail')) {
    /** อ่าน N บรรทัดท้ายไฟล์ log โดยไม่โหลดทั้งไฟล์ (log อาจโตเป็น MB) — คืน array เรียงเก่า→ใหม่ */
    function bl_read_log_tail(string $file, int $maxLines): array
    {
        if (!is_file($file) || !is_readable($file)) {
            return [];
        }
        $fp = @fopen($file, 'r');
        if ($fp === false) {
            return [];
        }
        fseek($fp, 0, SEEK_END);
        $pos = (int) ftell($fp);
        $buf = '';
        $chunk = 65536;
        while ($pos > 0 && substr_count($buf, "\n") <= $maxLines) {
            $read = min($chunk, $pos);
            $pos -= $read;
            fseek($fp, $pos);
            $part = fread($fp, $read);
            $buf = ($part === false ? '' : $part) . $buf;
        }
        fclose($fp);
        $lines = explode("\n", $buf);
        $lines = array_values(array_filter(array_map('trim', $lines), fn($l) => $l !== ''));
        return array_slice($lines, -$maxLines);
    }
}

if (!function_exists('bl_parse_req_log_line')) {
    /** แตกบรรทัด log ของ RequestLogger — คืน null ถ้าไม่ใช่รูปแบบ [METHOD /uri] event */
    function bl_parse_req_log_line(string $line): ?array
    {
        if (!preg_match('/^\[([\d\- :]+)\] \[(\w+)\] \[([A-Z]+) ([^\]]+)\] (\S+)( \{.*\})?$/', $line, $m)) {
            return null;
        }
        $ctx = [];
        if (isset($m[6]) && trim($m[6]) !== '') {
            $decoded = json_decode(trim($m[6]), true);
            if (is_array($decoded)) {
                $ctx = $decoded;
            }
        }
        return ['time' => $m[1], 'level' => $m[2], 'method' => $m[3], 'uri' => $m[4], 'event' => $m[5], 'ctx' => $ctx];
    }
}

if (!function_exists('bl_summarize_requests')) {
    /**
     * จับคู่ incoming_request + response ของ request เดียวกันให้เหลือ 1 แถวต่อ 1 request
     * RequestLogger เขียน incoming ตอนเริ่ม request และ response ตอน shutdown
     * จับคู่ด้วย key = METHOD|uri แบบคิว FIFO (log เรียงตามเวลาอยู่แล้ว)
     * อันที่ไม่เจอคู่ = request ล่าสุดที่ยังไม่จบ / ถูกตัดท้ายไฟล์ — โชว์สถานะ "…"
     */
    function bl_summarize_requests(array $lines, int $limit): array
    {
        $entries = [];
        $pending = [];
        $totals = ['GET' => 0, 'POST' => 0, 'DELETE' => 0, 'OPTIONS' => 0, 'OTHER' => 0];
        $errCount = 0;

        foreach ($lines as $line) {
            $p = bl_parse_req_log_line($line);
            if ($p === null) {
                continue;
            }
            $key = $p['method'] . '|' . $p['uri'];

            if ($p['event'] === 'incoming_request') {
                $method = $p['method'];
                $totals[array_key_exists($method, $totals) ? $method : 'OTHER']++;
                $pending[$key][] = [
                    'time' => $p['time'],
                    'method' => $method,
                    'uri' => $p['uri'],
                    'ip' => (string) ($p['ctx']['ip'] ?? ''),
                    'ua' => (string) ($p['ctx']['user_agent'] ?? ''),
                    'status' => null,
                    'ms' => null,
                ];
            } elseif ($p['event'] === 'response') {
                $queue = $pending[$key] ?? [];
                $entry = array_shift($queue);
                if (is_array($queue) && $queue !== []) {
                    $pending[$key] = $queue;
                } else {
                    unset($pending[$key]);
                }
                if (!is_array($entry)) {
                    $entry = [
                        'time' => $p['time'],
                        'method' => $p['method'],
                        'uri' => $p['uri'],
                        'ip' => '',
                        'ua' => '',
                    ];
                }
                $entry['status'] = (int) ($p['ctx']['status'] ?? 0);
                $entry['ms'] = isset($p['ctx']['duration_ms']) ? round((float) $p['ctx']['duration_ms'], 1) : null;
                if ($entry['status'] >= 400) {
                    $errCount++;
                }
                $entries[] = $entry;
            }
        }

        foreach ($pending as $queue) {
            foreach ($queue as $entry) {
                $entries[] = $entry;
            }
        }

        usort($entries, fn($a, $b) => strcmp($b['time'], $a['time']));

        return [
            'entries' => array_slice($entries, 0, $limit),
            'totals' => $totals,
            'errorCount' => $errCount,
        ];
    }
}

if (!function_exists('bl_rejected_origins')) {
    /** ดึง cors_origin_not_allowed จาก error.log — นี่คือ "เว็บที่ยิงเข้ามาแล้วโดนบล็อก" */
    function bl_rejected_origins(array $errLines): array
    {
        $map = [];
        foreach ($errLines as $line) {
            if (strpos($line, 'cors_origin_not_allowed') === false) {
                continue;
            }
            if (!preg_match('/^\[([\d\- :]+)\] \[\w+\] cors_origin_not_allowed (\{.*\})$/', $line, $m)) {
                continue;
            }
            $ctx = json_decode($m[2], true);
            $origin = is_array($ctx) ? (string) ($ctx['origin'] ?? '') : '';
            if ($origin === '') {
                continue;
            }
            if (!isset($map[$origin])) {
                $map[$origin] = ['origin' => $origin, 'count' => 0, 'last' => $m[1]];
            }
            $map[$origin]['count']++;
            if ($m[1] > $map[$origin]['last']) {
                $map[$origin]['last'] = $m[1];
            }
        }
        usort($map, fn($a, $b) => strcmp($b['last'], $a['last']));
        return array_values($map);
    }
}

if (!function_exists('bl_truncate_utf8')) {
    /** ตัดข้อความยาวแบบไม่หักคนละครึ่งอักษรไทย (กัน json_encode คืน false) */
    function bl_truncate_utf8(string $text, int $max): string
    {
        if (strlen($text) <= $max) {
            return $text;
        }
        return (function_exists('mb_substr') ? mb_substr($text, 0, $max) : substr($text, 0, $max)) . '…';
    }
}

if (!function_exists('bl_recent_log_events')) {
    /** เหตุการณ์ WARNING/ERROR ล่าสุดจาก error.log (ช่วยตอบ "ทำไมส่งมาไม่ได้") */
    function bl_recent_log_events(array $errLines, int $limit): array
    {
        $out = [];
        foreach (array_reverse($errLines) as $line) {
            if (!preg_match('/^\[([\d\- :]+)\] \[(\w+)\] (.+)$/', $line, $m)) {
                continue;
            }
            if (strtoupper($m[2]) === 'INFO') {
                continue;
            }
            $out[] = ['time' => $m[1], 'level' => strtoupper($m[2]), 'message' => bl_truncate_utf8($m[3], 200)];
            if (count($out) >= $limit) {
                break;
            }
        }
        return $out;
    }
}

if (!function_exists('bl_log_level_counts')) {
    /** นับจำนวนแต่ละ level ใน error.log tail — ใช้วาดแถบสรุป */
    function bl_log_level_counts(array $errLines): array
    {
        $counts = ['DEBUG' => 0, 'INFO' => 0, 'WARNING' => 0, 'ERROR' => 0, 'CRITICAL' => 0];
        foreach ($errLines as $line) {
            if (preg_match('/^\[[\d\- :]+\] \[(\w+)\]/', $line, $m)) {
                $lv = strtoupper($m[1]);
                if (isset($counts[$lv])) {
                    $counts[$lv]++;
                }
            }
        }
        return $counts;
    }
}

// เตรียมข้อมูล monitor (หน้า HTML กับ ?format=json ใช้ชุดเดียวกัน)
$reqLogFile = $dataDir . '/request.log';
$errLogFile = $dataDir . '/error.log';
$reqLogLines = bl_read_log_tail($reqLogFile, 1200);
$errLogLines = bl_read_log_tail($errLogFile, 400);
$reqSummary = bl_summarize_requests($reqLogLines, 50);
$logCounts = bl_log_level_counts($errLogLines);
$requestsData = [
    'available' => $appOk || count($reqSummary['entries']) > 0,
    'recent' => $reqSummary['entries'],
    'totals' => $reqSummary['totals'],
    'errorCount' => $reqSummary['errorCount'],
    'rejectedOrigins' => bl_rejected_origins($errLogLines),
    'warnings' => bl_recent_log_events($errLogLines, 8),
];

// ─── Self-test: พิสูจน์ว่า POST/GET ถึง PHP จริงไหม (หลักฐาน = marker ลง data/selftest.log) ──
// ?selftest=1 → เซิร์ฟเวอร์ยิง GET+POST กลับเข้าตัวเอง (loopback) แล้วเช็กว่าแต่ละ request
// เขียน marker ลงไฟล์จริง — marker ลง = request ถึง PHP แน่นอน (ไม่ใช่แค่ได้ 200 จาก cache)
$selftestPing = (string) ($_GET['selftest_ping'] ?? '');
if ($selftestPing !== '' && preg_match('/^[a-z0-9_]{4,32}$/', $selftestPing)) {
    register_shutdown_function(function () use ($selftestPing) {
        $dir = defined('DATA_PATH') ? DATA_PATH : __DIR__ . '/data';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        @file_put_contents($dir . '/selftest.log', $selftestPing . '|' . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND | LOCK_EX);
    });
}

// Base URL ของ backend — แสดงผลทุก host (local + production + custom domain)
// ใช้ host ปัจจุบันของ request เสมอ จะได้รันได้ทั้ง localhost และ production;
// มี fallback เป็น production URL เฉพาะตอนไม่มี HTTP_HOST (เช่น รันผ่าน CLI)
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = $host !== '' && (
    str_contains(strtolower($host), 'localhost') || str_starts_with($host, '127.') || str_starts_with($host, '192.168.') || str_starts_with($host, '[::1]')
);
if ($host !== '') {
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
    $forwardedProto = strtolower(trim((explode(',', $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''))[0] ?? ''));
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $forwardedProto === 'https'
        || (!str_contains($host, 'localhost') && !str_starts_with($host, '127.') && !str_starts_with($host, '192.168.'));
    $scheme = $isHttps ? 'https' : 'http';
    $BASE_URL = $scheme . '://' . $host . ($scriptDir === '' || $scriptDir === '/' ? '' : $scriptDir);
} else {
    $BASE_URL = 'https://panitijahem.xo.je';
}
$BACKEND_BASE = $BASE_URL;

// แยกสาเหตุ: ไฟล์หลักไม่ครบ (config/ ฯลฯ) vs แค่ .env หาย — วิธีแก้คนละอย่างกัน
$isEnvMissing = !$appOk && str_contains($envError, '.env file not found');

if (($_GET['selftest'] ?? '') === '1') {
    if (!function_exists('bl_selftest_http')) {
        /** ยิง HTTP แบบง่าย (cURL ก่อน, ไม่มีค่อยใช้ file_get_contents) — คืน [httpCode, body] */
        function bl_selftest_http(string $url, string $method, ?string $body, int $timeout): array
        {
            if (function_exists('curl_init')) {
                $ch = curl_init($url);
                curl_setopt_array($ch, [
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CUSTOMREQUEST => $method,
                    CURLOPT_TIMEOUT => $timeout,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTPHEADER => ['User-Agent: BookLoop-SelfTest/1.0', 'Content-Type: application/json'],
                ]);
                if ($body !== null) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
                }
                $resp = curl_exec($ch);
                $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
                return [$code, is_string($resp) ? $resp : false];
            }
            $ctx = stream_context_create(['http' => [
                'method' => $method,
                'timeout' => $timeout,
                'ignore_errors' => true,
                'header' => "User-Agent: BookLoop-SelfTest/1.0\r\nContent-Type: application/json\r\n",
                'content' => (string) $body,
            ]]);
            $resp = @file_get_contents($url, false, $ctx);
            $code = 0;
            foreach (($http_response_header ?? []) as $h) {
                if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
                    $code = (int) $m[1];
                }
            }
            return [$code, is_string($resp) ? $resp : false];
        }
    }

    while (ob_get_level() > 0 && ob_get_length() > 0) {
        ob_end_clean();
    }
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    $results = [];
    foreach (['get' => 'GET', 'post' => 'POST'] as $name => $method) {
        $marker = 'st_' . bin2hex(random_bytes(4));
        $body = $method === 'POST' ? json_encode(['selftest' => $marker]) : null;
        $t0 = microtime(true);
        [$code] = bl_selftest_http($BASE_URL . '/?selftest_ping=' . $marker, $method, $body, 8);
        $ms = (int) round((microtime(true) - $t0) * 1000);

        $dir = defined('DATA_PATH') ? DATA_PATH : __DIR__ . '/data';
        $logContent = @file_get_contents($dir . '/selftest.log');
        $verified = is_string($logContent) && strpos($logContent, $marker . '|') !== false;

        $results[$name] = [
            'ok' => $verified,
            'http' => $code,
            'ms' => $ms,
            'detail' => $verified
                ? ''
                : ($code === 0
                    ? 'ยิง request ออกจากเซิร์ฟเวอร์ไม่สำเร็จ — โฮสต์อาจบล็อกการเรียก loopback (ผลนี้ไม่ได้แปลว่า API พัง ให้ดูตาราง Request เข้าล่าสุดจากการใช้งานจริงแทน)'
                    : 'request กลับมาเป็น HTTP ' . $code . ' แต่ไม่เจอ marker — อาจถูก redirect/ติดหน้า challenge ของโฮสต์ก่อนถึง PHP'),
        ];
    }

    $stFile = (defined('DATA_PATH') ? DATA_PATH : __DIR__ . '/data') . '/selftest.log';
    $stLines = @file($stFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (is_array($stLines) && count($stLines) > 200) {
        @file_put_contents($stFile, implode("\n", array_slice($stLines, -200)) . "\n", LOCK_EX);
    }

    echo json_encode([
        'success' => $results['get']['ok'] || $results['post']['ok'],
        'time' => date('c'),
        'results' => $results,
        'note' => 'เทสนี้ยิงจากเซิร์ฟเวอร์เข้าตัวเอง (loopback) เพื่อพิสูจน์ว่า PHP รับ POST/GET ได้จริง — ส่วนเว็บอื่นเรียกข้ามโดเมนได้หรือไม่ ขึ้นกับ CORS/ALLOWED_ORIGIN',
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ─── Dashboard admin gate ───
// ?all_listings / ?moderate_listing เดิมไม่ตรวจ auth เลย (ใครก็ approve/delete ได้)
// จึงต้องใช้ ADMIN_TOKEN จาก server .env — ว่าง = ปิดทั้งหมด (fail-closed)
// dashboard ส่งมาทาง header X-Admin-Token (หรือ field admin_token ใน body)
if (!function_exists('bl_require_admin_token')) {
    function bl_require_admin_token(?array $body = null): void
    {
        while (ob_get_level() > 0 && ob_get_length() > 0) { ob_end_clean(); }
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        $expected = (defined('ADMIN_TOKEN') ? (string) ADMIN_TOKEN : '');
        $provided = (string) ($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '');
        if ($provided === '' && $body !== null && isset($body['admin_token'])) {
            $provided = (string) $body['admin_token'];
        }
        if ($expected === '') {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'ยังไม่ได้ตั้ง ADMIN_TOKEN บนเซิร์ฟเวอร์ (.env) — ปิดการจัดการผ่าน dashboard ไว้ก่อน'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        if ($provided === '' || !hash_equals($expected, $provided)) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'รหัสผู้ดูแลไม่ถูกต้อง'], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }
}

// ?all_listings=1 — คืน listings ทุก status สำหรับ dashboard moderation (ต้องมี ADMIN_TOKEN)
if (($_GET['all_listings'] ?? '') === '1' && !empty($checks['env']['ok'])) {
    bl_require_admin_token();
    while (ob_get_level() > 0 && ob_get_length() > 0) { ob_end_clean(); }
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    // หมายเหตุ: ไม่สะท้อน Access-Control-Allow-Origin ตาม Origin ที่ส่งมา
    // (dashboard เรียกแบบ same-origin จึงไม่ต้องมี CORS header)

    // อ่าน listings ทั้งหมดจากไฟล์โดยตรง
    $alFile = $dataDir . '/listings.json';
    $alAll = [];
    if (is_file($alFile) && is_readable($alFile)) {
        $alDecoded = json_decode((string) @file_get_contents($alFile), true);
        if (is_array($alDecoded)) {
            $alAll = $alDecoded;
        }
    }
    // เรียงใหม่สุดก่อน
    usort($alAll, fn($a, $b) => strcmp((string)($b['createdAt'] ?? ''), (string)($a['createdAt'] ?? '')));
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'total' => count($alAll),
        'items' => $alAll,
        'count' => count($alAll),
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ?moderate_listing=1 — จัดการรายการลงขายจาก dashboard (ต้องมี ADMIN_TOKEN)
if (($_GET['moderate_listing'] ?? '') === '1' && $_SERVER['REQUEST_METHOD'] === 'POST' && !empty($checks['env']['ok'])) {
    $raw = (string) file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $data = $_POST;
    }
    bl_require_admin_token($data);
    while (ob_get_level() > 0 && ob_get_length() > 0) { ob_end_clean(); }
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    $id = trim((string) ($data['id'] ?? ''));
    $action = trim((string) ($data['action'] ?? ''));

    if ($id === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'กรุณาระบุ id รายการลงขาย'], JSON_UNESCAPED_UNICODE);
        exit();
    }
    $allowed = ['approve', 'reject', 'pause', 'resume', 'activate', 'archive', 'delete', 'delete_permanent'];
    if (!in_array($action, $allowed, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'action ไม่ถูกต้อง'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $alFile = $dataDir . '/listings.json';
    $listings = [];
    if (is_file($alFile) && is_readable($alFile)) {
        $decoded = json_decode((string) @file_get_contents($alFile), true);
        if (is_array($decoded)) {
            $listings = $decoded;
        }
    }

    $found = null;
    foreach ($listings as $idx => $item) {
        if (($item['id'] ?? '') === $id) {
            $found = $idx;
            break;
        }
    }
    if ($found === null) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'ไม่พบรายการลงขายนี้'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $now = date('c');
    if ($action === 'delete_permanent') {
        $delItem = $listings[$found];
        if (!empty($delItem['image']) && str_starts_with($delItem['image'], 'images/listings/')) {
            $imgPath = __DIR__ . '/' . $delItem['image'];
            if (is_file($imgPath)) {
                @unlink($imgPath);
            }
        }
        array_splice($listings, $found, 1);
        @file_put_contents($alFile, json_encode($listings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'ลบรายการและไฟล์รูปภาพถาวรเรียบร้อยแล้ว', 'id' => $id, 'action' => 'delete_permanent'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $newStatus = 'active';
    $msg = 'อนุมัติให้วางขายแล้ว';
    if ($action === 'approve') {
        $newStatus = 'active';
        $msg = 'อนุมัติให้วางขายแล้ว';
    } elseif ($action === 'reject') {
        $newStatus = 'rejected';
        $msg = 'ปฏิเสธรายการนี้แล้ว';
    } elseif ($action === 'pause') {
        $newStatus = 'paused';
        $msg = 'หยุดขายรายการนี้ชั่วคราวแล้ว';
    } elseif ($action === 'resume' || $action === 'activate') {
        $newStatus = 'active';
        $msg = 'เปิดวางขาย/กู้คืนรายการนี้แล้ว';
    } elseif ($action === 'archive' || $action === 'delete') {
        $newStatus = 'archived';
        $msg = 'ย้ายรายการไปเก็บถาวรแล้ว (ข้อมูลและรูปภาพยังคงอยู่ สามารถกู้คืนได้)';
    }

    $listings[$found]['status'] = $newStatus;
    $listings[$found]['updatedAt'] = $now;
    $listings[$found]['moderatedBy'] = 'backend-admin';
    $listings[$found]['moderatedAt'] = $now;

    @file_put_contents($alFile, json_encode($listings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $msg,
        'id' => $id,
        'status' => $newStatus,
        'action' => $action,
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ─── Data explorer: ดู/เพิ่ม/แก้/ลบแถวใน data/ ผ่าน dashboard (ADMIN_TOKEN, fail-closed) ───
// ?data_files=1 (GET) — รายชื่อไฟล์ + จำนวนแถว/ขนาด/kind
// ?data_rows=1&file=X&q= (GET) — แถวทั้งหมด (cap 1000) + คอลัมน์ (union key)
// ?data_row=1 (POST) — {file, action: create|update|delete, key, row}
// กฎ: whitelist เฉพาะ basename .json ใน DATA_PATH (realpath กัน traversal),
// .txt/.log อ่านอย่างเดียว, ฟิลด์ password ล็อกห้ามเขียน (แสดง •••),
// ทุก write: backup .bak 1 ชุด + เขียนแบบ atomic (tmp + rename)
if (!function_exists('bl_data_is_list')) {
    function bl_data_is_list(array $a): bool
    {
        if ($a === []) return true;
        return array_keys($a) === range(0, count($a) - 1);
    }
}
if (!function_exists('bl_data_file_list')) {
    function bl_data_file_list(string $dataDir): array
    {
        $out = [];
        foreach ((array) glob($dataDir . '/*.{json,txt,log}', GLOB_BRACE) as $path) {
            $path = (string) $path;
            $name = basename($path);
            if (str_ends_with($name, '.bak') || str_ends_with($name, '.tmp') || !is_file($path) || !is_readable($path)) {
                continue;
            }
            $entry = [
                'name' => $name,
                'bytes' => (int) @filesize($path),
                'mtime' => (int) @filemtime($path),
                'writable' => false,
                'kind' => 'lines',
                'rows' => 0,
            ];
            if (str_ends_with($name, '.json')) {
                $decoded = json_decode((string) @file_get_contents($path), true);
                if (is_array($decoded)) {
                    $entry['writable'] = true;
                    $entry['kind'] = bl_data_is_list($decoded) ? 'list' : 'map';
                    $entry['rows'] = count($decoded);
                } else {
                    $entry['kind'] = 'scalar';
                }
            } else {
                $entry['rows'] = count(@file($path, FILE_IGNORE_NEW_LINES) ?: []);
            }
            $out[] = $entry;
        }
        usort($out, fn($a, $b) => strcmp($a['name'], $b['name']));
        return $out;
    }
}
if (!function_exists('bl_data_json')) {
    // ตอบ JSON แล้วจบ (pattern เดียวกับ handler อื่นในไฟล์นี้)
    function bl_data_json(array $payload, int $status = 200): void
    {
        while (ob_get_level() > 0 && ob_get_length() > 0) { ob_end_clean(); }
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        http_response_code($status);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit();
    }
}
if (!function_exists('bl_data_resolve')) {
    // คืน [path, decoded] ของไฟล์ .json ใน whitelist หรือจบด้วย 4xx
    function bl_data_resolve(string $dataDir, string $file): array
    {
        $file = basename(trim($file));
        if ($file === '' || !str_ends_with($file, '.json')) {
            bl_data_json(['success' => false, 'message' => 'ไฟล์ไม่ถูกต้อง (รองรับเฉพาะ .json ใน data/)'], 400);
        }
        $base = (string) realpath($dataDir);
        $path = $dataDir . '/' . $file;
        $real = realpath($path);
        if ($real === false || dirname($real) !== $base || !is_readable($path)) {
            bl_data_json(['success' => false, 'message' => 'ไม่พบไฟล์ข้อมูลนี้'], 404);
        }
        $decoded = json_decode((string) @file_get_contents($path), true);
        if (!is_array($decoded)) {
            bl_data_json(['success' => false, 'message' => 'ไฟล์นี้ไม่ใช่ JSON object/array ที่แก้ไขได้'], 400);
        }
        return [$path, $decoded];
    }
}
if (!function_exists('bl_data_row_key')) {
    // คีย์ระบุแถว: ฟิลด์ id ก่อน, ไม่มีใช้ _idx (list) / _key (map)
    function bl_data_row_key(array $row, $idx): string
    {
        if (isset($row['id']) && (is_string($row['id']) || is_numeric($row['id']))) {
            return (string) $row['id'];
        }
        return (string) $idx;
    }
}

// ?data_files=1 — รายชื่อไฟล์ใน data/
if (($_GET['data_files'] ?? '') === '1' && !empty($checks['env']['ok'])) {
    bl_require_admin_token();
    bl_data_json(['success' => true, 'files' => bl_data_file_list($dataDir)]);
}

// ?data_rows=1&file=X&q= — แถว + คอลัมน์ (union key, cap 12 คอลัมน์ / 1000 แถว)
if (($_GET['data_rows'] ?? '') === '1' && !empty($checks['env']['ok'])) {
    bl_require_admin_token();
    $rqFile = trim((string) ($_GET['file'] ?? ''));
    if ($rqFile === '') {
        bl_data_json(['success' => false, 'message' => 'กรุณาระบุ file'], 400);
    }
    // ไฟล์ .txt/.log: คืนเป็นบรรทัด (อ่านอย่างเดียว)
    if (!str_ends_with(basename($rqFile), '.json')) {
        $base = (string) realpath($dataDir);
        $tpath = $dataDir . '/' . basename($rqFile);
        $treal = realpath($tpath);
        if ($treal === false || dirname($treal) !== $base || !is_readable($tpath)) {
            bl_data_json(['success' => false, 'message' => 'ไม่พบไฟล์ข้อมูลนี้'], 404);
        }
        $lines = @file($tpath, FILE_IGNORE_NEW_LINES) ?: [];
        $q = mb_strtolower(trim((string) ($_GET['q'] ?? '')));
        $rows = [];
        foreach ($lines as $i => $ln) {
            if ($q !== '' && mb_stripos((string) $ln, $q) === false) continue;
            $rows[] = ['_idx' => $i, 'line' => mb_substr((string) $ln, 0, 500)];
            if (count($rows) >= 1000) break;
        }
        bl_data_json(['success' => true, 'kind' => 'lines', 'writable' => false, 'total' => count($lines), 'columns' => ['line'], 'rows' => $rows, 'truncated' => count($rows) < count($lines)]);
    }
    [$rpath, $decoded] = bl_data_resolve($dataDir, $rqFile);
    $isList = bl_data_is_list($decoded);
    $q = mb_strtolower(trim((string) ($_GET['q'] ?? '')));
    $rows = [];
    $colOrder = [];
    foreach ($decoded as $idx => $item) {
        $row = is_array($item) ? $item : ['_value' => $item];
        if ($isList) {
            $row['_idx'] = $idx;
        } else {
            $row['_key'] = (string) $idx;
        }
        if (array_key_exists('password', $row)) {
            $row['password'] = '•••';
        }
        if ($q !== '' && mb_stripos(json_encode($row, JSON_UNESCAPED_UNICODE) ?: '', $q) === false) {
            continue;
        }
        foreach ($row as $ck => $_) {
            if (!in_array($ck, $colOrder, true)) $colOrder[] = $ck;
        }
        $rows[] = $row;
        if (count($rows) >= 1000) break;
    }
    // password ไว้ท้ายสุดเสมอ (ถ้ามี)
    $colOrder = array_values(array_filter($colOrder, fn($c) => $c !== 'password'));
    if (!empty($decoded)) {
        $hasPw = false;
        foreach ($rows as $r) { if (array_key_exists('password', $r)) { $hasPw = true; break; } }
        if ($hasPw) $colOrder[] = 'password';
    }
    // _idx/_key ไว้คอลัมน์แรก
    foreach (['_key', '_idx'] as $meta) {
        if (in_array($meta, $colOrder, true)) {
            $colOrder = array_merge([$meta], array_values(array_filter($colOrder, fn($c) => $c !== $meta)));
        }
    }
    $colOrder = array_slice($colOrder, 0, 12);
    bl_data_json([
        'success' => true,
        'kind' => $isList ? 'list' : 'map',
        'writable' => true,
        'total' => count($decoded),
        'columns' => $colOrder,
        'rows' => $rows,
        'truncated' => count($rows) >= 1000,
    ]);
}

// ?data_row=1 (POST) — create/update/delete แถวเดียว
if (($_GET['data_row'] ?? '') === '1' && $_SERVER['REQUEST_METHOD'] === 'POST' && !empty($checks['env']['ok'])) {
    $raw = (string) file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $data = $_POST;
    }
    bl_require_admin_token($data);
    $wFile = trim((string) ($data['file'] ?? ''));
    $action = trim((string) ($data['action'] ?? ''));
    if (!in_array($action, ['create', 'update', 'delete'], true)) {
        bl_data_json(['success' => false, 'message' => 'action ไม่ถูกต้อง (create/update/delete)'], 400);
    }
    [$wpath, $wdecoded] = bl_data_resolve($dataDir, $wFile);
    $wIsList = bl_data_is_list($wdecoded);
    $wKey = (string) ($data['key'] ?? '');
    $wRow = $data['row'] ?? null;
    if (in_array($action, ['create', 'update'], true) && !is_array($wRow)) {
        bl_data_json(['success' => false, 'message' => 'row ต้องเป็น object'], 400);
    }
    if (is_array($wRow)) {
        unset($wRow['_idx'], $wRow['_key']);
        if (array_key_exists('password', $wRow)) {
            bl_data_json(['success' => false, 'message' => 'ฟิลด์ password ล็อกไว้ เปลี่ยนผ่าน auth endpoints'], 400);
        }
    }
    if ($wIsList) {
        $found = null;
        foreach ($wdecoded as $idx => $item) {
            if (!is_array($item)) continue;
            if ($wKey !== '' && bl_data_row_key($item, $idx) === $wKey) {
                $found = $idx;
                break;
            }
        }
        if ($action === 'create') {
            if ($found !== null) {
                bl_data_json(['success' => false, 'message' => 'id นี้มีอยู่แล้ว'], 409);
            }
            $wdecoded[] = $wRow;
            $msg = 'เพิ่มแถวใหม่แล้ว';
        } else {
            if ($wKey === '' || $found === null) {
                bl_data_json(['success' => false, 'message' => 'ไม่พบแถวนี้'], 404);
            }
            if ($action === 'update') {
                $base = is_array($wdecoded[$found]) ? $wdecoded[$found] : [];
                $wdecoded[$found] = array_merge($base, $wRow);
                $msg = 'แก้ไขแถวแล้ว';
            } else {
                array_splice($wdecoded, $found, 1);
                $msg = 'ลบแถวถาวรแล้ว';
            }
        }
    } else {
        if ($wKey === '') {
            bl_data_json(['success' => false, 'message' => 'กรุณาระบุ key'], 400);
        }
        if ($action === 'create') {
            if (array_key_exists($wKey, $wdecoded)) {
                bl_data_json(['success' => false, 'message' => 'key นี้มีอยู่แล้ว'], 409);
            }
            $wdecoded[$wKey] = $wRow;
            $msg = 'เพิ่มแถวใหม่แล้ว';
        } else {
            if (!array_key_exists($wKey, $wdecoded)) {
                bl_data_json(['success' => false, 'message' => 'ไม่พบแถวนี้'], 404);
            }
            if ($action === 'update') {
                $base = is_array($wdecoded[$wKey]) ? $wdecoded[$wKey] : [];
                $wdecoded[$wKey] = array_merge($base, $wRow);
                $msg = 'แก้ไขแถวแล้ว';
            } else {
                unset($wdecoded[$wKey]);
                $msg = 'ลบแถวถาวรแล้ว';
            }
        }
    }
    @copy($wpath, $wpath . '.bak');
    $tmp = $wpath . '.tmp.' . bin2hex(random_bytes(4));
    if (@file_put_contents($tmp, json_encode($wdecoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) {
        @unlink($tmp);
        bl_data_json(['success' => false, 'message' => 'เขียนไฟล์ไม่สำเร็จ'], 500);
    }
    if (!@rename($tmp, $wpath)) {
        @unlink($tmp);
        bl_data_json(['success' => false, 'message' => 'เขียนไฟล์ไม่สำเร็จ'], 500);
    }
    bl_data_json(['success' => true, 'message' => $msg, 'rows' => count($wdecoded)]);
}

// ?data_file=1 — อ่าน/เขียนไฟล์ JSON ทั้งไฟล์ (ADMIN_TOKEN, fail-closed)
// GET ?data_file=1&file=X → content ทั้งไฟล์ (mask password เป็น •••)
// POST ?data_file=1 {file, content} → แทนที่ทั้งไฟล์ (คืนค่า password เดิมทุกแถว — password ล็อกเสมอ)
if (!function_exists('bl_data_mask_passwords')) {
    function bl_data_mask_passwords($data)
    {
        if (!is_array($data)) {
            return $data;
        }
        foreach ($data as $k => $v) {
            if ($k === 'password') {
                $data[$k] = '•••';
            } elseif (is_array($v)) {
                $data[$k] = bl_data_mask_passwords($v);
            }
        }
        return $data;
    }
}
if (!function_exists('bl_data_orig_pw_map')) {
    // map password เดิมไว้คืนค่าตอนเซฟ: list → id (มี id) / idx:N, map → key
    function bl_data_orig_pw_map($decoded): array
    {
        $map = [];
        if (!is_array($decoded)) {
            return $map;
        }
        $isList = bl_data_is_list($decoded);
        foreach ($decoded as $idx => $item) {
            if (!is_array($item) || !array_key_exists('password', $item)) {
                continue;
            }
            $k = $isList
                ? (isset($item['id']) && (is_string($item['id']) || is_numeric($item['id'])) ? (string) $item['id'] : 'idx:' . $idx)
                : (string) $idx;
            $map[$k] = $item['password'];
        }
        return $map;
    }
}
if (($_GET['data_file'] ?? '') === '1' && !empty($checks['env']['ok'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        bl_require_admin_token();
        [$gpath, $gdecoded] = bl_data_resolve($dataDir, trim((string) ($_GET['file'] ?? '')));
        $gout = json_encode(bl_data_mask_passwords($gdecoded), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($gout === false) {
            bl_data_json(['success' => false, 'message' => 'อ่านไฟล์ไม่สำเร็จ'], 500);
        }
        bl_data_json([
            'success' => true,
            'file' => basename($gpath),
            'kind' => bl_data_is_list($gdecoded) ? 'list' : 'map',
            'content' => $gout,
        ]);
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = (string) file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            $data = $_POST;
        }
        bl_require_admin_token($data);
        $content = (string) ($data['content'] ?? '');
        if ($content === '' || strlen($content) > 2097152) {
            bl_data_json(['success' => false, 'message' => 'เนื้อหา JSON ว่างเปล่าหรือใหญ่เกินไป (สูงสุด 2MB)'], 400);
        }
        [$fpath, $forig] = bl_data_resolve($dataDir, trim((string) ($data['file'] ?? '')));
        $fnew = json_decode($content, true);
        if (!is_array($fnew)) {
            bl_data_json(['success' => false, 'message' => 'JSON ไม่ถูกต้อง: ' . json_last_error_msg()], 400);
        }
        if (bl_data_is_list($forig) !== bl_data_is_list($fnew)) {
            bl_data_json(['success' => false, 'message' => 'โครงสร้างต้องเป็นแบบเดิม (list หรือ map อย่างใดอย่างหนึ่ง)'], 400);
        }
        $origPw = bl_data_orig_pw_map($forig);
        $fIsList = bl_data_is_list($fnew);
        foreach ($fnew as $fidx => &$frow) {
            if (!is_array($frow)) {
                continue;
            }
            $fk = $fIsList
                ? (isset($frow['id']) && (is_string($frow['id']) || is_numeric($frow['id'])) ? (string) $frow['id'] : 'idx:' . $fidx)
                : (string) $fidx;
            if (array_key_exists('password', $frow)) {
                if ($frow['password'] !== '•••') {
                    bl_data_json(['success' => false, 'message' => 'ฟิลด์ password ล็อกไว้ เปลี่ยนผ่าน auth endpoints'], 400);
                }
                if (array_key_exists($fk, $origPw)) {
                    $frow['password'] = $origPw[$fk];
                } else {
                    unset($frow['password']);
                }
            } elseif (array_key_exists($fk, $origPw)) {
                $frow['password'] = $origPw[$fk];
            }
        }
        unset($frow);
        $fout = json_encode($fnew, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($fout === false) {
            bl_data_json(['success' => false, 'message' => 'บันทึกไม่ได้ (เข้ารหัส JSON ไม่สำเร็จ)'], 500);
        }
        @copy($fpath, $fpath . '.bak');
        $ftmp = $fpath . '.tmp.' . bin2hex(random_bytes(4));
        if (@file_put_contents($ftmp, $fout, LOCK_EX) === false) {
            @unlink($ftmp);
            bl_data_json(['success' => false, 'message' => 'เขียนไฟล์ไม่สำเร็จ'], 500);
        }
        if (!@rename($ftmp, $fpath)) {
            @unlink($ftmp);
            bl_data_json(['success' => false, 'message' => 'เขียนไฟล์ไม่สำเร็จ'], 500);
        }
        bl_data_json(['success' => true, 'message' => 'บันทึกทั้งไฟล์แล้ว', 'rows' => count($fnew)]);
    }
}


$isJson = (($_GET['format'] ?? '') === 'json');
// poll=1 = dashboard เรียลไทม์เรียกเอง: ส่ง 200 เสมอ กัน console ขึ้น 500 หลอกตอนระบบมีปัญหา
// (uptime monitor ใช้ ?format=json เพียว ๆ — พัง = 500 เหมือนเดิม จะได้ alert)
$isPoll = (($_GET['poll'] ?? '') === '1');

if ($isJson) {
    // health check สำหรับ uptime monitor: พัง = 500 (จะได้ alert)
    http_response_code(($appOk || $isPoll) ? 200 : 500);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    echo json_encode([
        'success' => $appOk,
        'service' => 'bookloop-api',
        'php' => PHP_VERSION,
        'time' => date('c'),
        'checks' => array_map(fn($c) => $c['ok'], $checks),
        'error' => $appOk ? null : $envError,
        'requests' => $requestsData,
        // ฟิลด์เสริม (ไม่กระทบ monitor เดิม — อ่านเพิ่มได้ถ้าต้องการ)
        'endpointCount' => $apiCount,
        'mailReady' => $mailReady,
        'logCounts' => $logCounts,
        'dataFiles' => array_map(fn($f) => ['file' => $f['name'], 'exists' => $f['exists'], 'size' => $f['size'], 'lines' => $f['lines']], $dataFiles),
        'app' => $appInfo,
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// หน้า HTML เป็น dashboard สำหรับคนดู — ส่ง 200 เสมอ (สถานะดูที่ badge)
// กัน browser console ขึ้น "Failed to load resource: 500" หลอกตอนระบบมีปัญหา
http_response_code(200);
$totGet = $reqSummary['totals']['GET'] ?? 0;
$totPost = $reqSummary['totals']['POST'] ?? 0;
$totDel = $reqSummary['totals']['DELETE'] ?? 0;
$totOpt = $reqSummary['totals']['OPTIONS'] ?? 0;
$totErr = $reqSummary['errorCount'] ?? 0;
$rejCount = count($requestsData['rejectedOrigins']);
$warnCount = ($logCounts['WARNING'] ?? 0) + ($logCounts['ERROR'] ?? 0) + ($logCounts['CRITICAL'] ?? 0);
?>
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BookLoop API — <?= $appOk ? 'ออนไลน์' : 'มีปัญหา' ?></title>
<style>
  :root {
    --bg-canvas: #090d16;
    --bg-surface: #0f172a;
    --bg-surface-elevated: #1e293b;
    --bg-surface-subtle: #0b1324;
    --border-hairline: #1e293b;
    --border-strong: #334155;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #8096ae;
    --swiss-blue: #1976d2;
    --swiss-blue-hover: #0284c7;
    --swiss-blue-bg: rgba(25, 118, 210, 0.18);
    --signal-ok: #10b981;
    --signal-ok-bg: #06402e;
    --signal-ok-text: #6ee7b7;
    --signal-err: #ef4444;
    --signal-err-bg: #451010;
    --signal-err-text: #fca5a5;
    --signal-warn: #f59e0b;
    --signal-warn-bg: #452405;
    --signal-warn-text: #fde68a;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  ::selection {
    background: rgba(25, 118, 210, 0.4);
    color: #ffffff;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--border-strong) var(--bg-surface);
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-surface);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border-strong);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }
  input, textarea, select {
    caret-color: var(--swiss-blue);
  }
  :focus-visible {
    outline: 2px solid var(--swiss-blue);
    outline-offset: 2px;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans Thai", sans-serif;
    background: var(--bg-canvas);
    color: var(--text-primary);
    padding: 40px 24px 80px;
    line-height: 1.5;
    letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1200px; margin: 0 auto; }

  /* ═══ Swiss Masthead (Asymmetric Composition) ═══ */
  .masthead {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    padding-bottom: 24px;
    margin-bottom: 28px;
    border-bottom: 1px solid var(--border-hairline);
  }
  .masthead-left { flex: 1; min-width: 0; }
  .masthead-brand-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .masthead-logo-badge {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--swiss-blue);
    box-shadow: 0 4px 12px rgba(4, 15, 28, 0.35);
  }
  .masthead-logo-badge .bl-icon-lg {
    margin: 0;
    vertical-align: 0;
  }
  .masthead-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  h1.masthead-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: 0;
  }
  .env-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    background: var(--swiss-blue-bg);
    color: #90caf9;
    border: 1px solid rgba(25, 118, 210, 0.35);
  }
  .masthead-sub {
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.4;
  }
  .masthead-right {
    text-align: right;
    flex-shrink: 0;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 2px;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
  .badge.ok { background: var(--signal-ok-bg); color: var(--signal-ok-text); border: 1px solid rgba(16,185,129,0.3); }
  .badge.bad { background: var(--signal-err-bg); color: var(--signal-err-text); border: 1px solid rgba(239,68,68,0.3); }
  .live-line { color: var(--text-muted); font-size: 12px; }
  .live-line b { color: var(--text-primary); font-variant-numeric: tabular-nums; }

  /* ═══ Geometric Swiss SVG Icons ═══ */
  .bl-icon {
    width: 14px;
    height: 14px;
    display: inline-block;
    vertical-align: -2px;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .bl-icon-lg {
    width: 26px;
    height: 26px;
    display: inline-block;
    vertical-align: -4px;
    margin-right: 10px;
    color: var(--swiss-blue);
    flex-shrink: 0;
  }
  .bl-icon-sm {
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: -1px;
    margin-right: 4px;
    flex-shrink: 0;
  }
  .bl-icon-spin {
    animation: bl-spin 1.4s linear infinite;
  }
  @keyframes bl-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .btn .bl-icon {
    width: 13px;
    height: 13px;
    margin-right: 5px;
    vertical-align: -1px;
  }
  .card h2 .bl-icon {
    width: 16px;
    height: 16px;
    vertical-align: -2px;
    margin-right: 8px;
    color: var(--swiss-blue);
  }
  .tab .bl-icon {
    width: 14px;
    height: 14px;
    vertical-align: -2px;
    margin-right: 6px;
  }
  .badge .bl-icon {
    width: 12px;
    height: 12px;
    vertical-align: -1px;
    margin-right: 4px;
  }

  /* ═══ Architectural Tab Navigation ═══ */
  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border-hairline);
    margin-bottom: 28px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab {
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-bottom: 2px solid transparent;
    padding: 12px 18px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    border-radius: 0;
  }
  .tab:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.02);
  }
  .tab.active,
  .tab[aria-selected="true"] {
    color: var(--text-primary);
    border-bottom-color: var(--swiss-blue);
    background: rgba(15, 108, 240, 0.06);
  }
  .tab-badge {
    background: var(--signal-warn-bg);
    color: var(--signal-warn-text);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 2px;
    padding: 1px 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-left: 6px;
  }

  .pane { display: none; }
  .pane.active { display: block; }

  /* ═══ Modular Metric Grid (Backwards Compatibility) ═══ */
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1px;
    background: var(--border-hairline);
    border: 1px solid var(--border-hairline);
    margin-bottom: 28px;
  }
  .stat {
    background: var(--bg-surface);
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .stat .n {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
    color: var(--text-primary);
  }
  .stat .l {
    margin-top: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    font-weight: 700;
  }

  /* ═══ High-Hierarchy Command Deck (Differentiated Hero Panels) ═══ */
  .command-deck {
    display: grid;
    grid-template-columns: 1.15fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .deck-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-hairline);
    border-radius: 4px;
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-shadow: 0 4px 16px rgba(4, 15, 28, 0.25);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .deck-card:hover {
    border-color: var(--border-strong);
    box-shadow: 0 6px 20px rgba(4, 15, 28, 0.35);
  }
  .deck-card-pulse {
    border-top: 3px solid var(--swiss-blue);
  }
  .deck-card-queue {
    border-top: 3px solid var(--signal-warn);
  }
  .deck-card-queue.is-empty {
    border-top: 3px solid var(--signal-ok);
  }
  .deck-card-sentry {
    border-top: 3px solid var(--signal-ok);
  }
  .deck-card-sentry.has-alerts {
    border-top: 3px solid var(--signal-err);
    background: linear-gradient(180deg, rgba(69, 16, 16, 0.22) 0%, var(--bg-surface) 100%);
  }

  .deck-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .deck-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .deck-tag {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 2px;
    letter-spacing: 0.04em;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .deck-tag-blue {
    background: var(--swiss-blue-bg);
    color: #90caf9;
    border: 1px solid rgba(25, 118, 210, 0.35);
  }
  .deck-tag-warn {
    background: var(--signal-warn-bg);
    color: var(--signal-warn-text);
    border: 1px solid rgba(245, 158, 11, 0.35);
  }
  .deck-tag-ok {
    background: var(--signal-ok-bg);
    color: var(--signal-ok-text);
    border: 1px solid rgba(16, 185, 129, 0.35);
  }
  .deck-tag-err {
    background: var(--signal-err-bg);
    color: var(--signal-err-text);
    border: 1px solid rgba(239, 68, 68, 0.35);
  }

  .deck-hero {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 6px;
  }
  .deck-hero-num {
    font-size: 38px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
    color: var(--text-primary);
  }
  .deck-hero-unit {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }
  .deck-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
    margin-bottom: 14px;
  }

  .deck-sub-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--border-hairline);
    margin-top: auto;
  }
  .deck-sub-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .deck-sub-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    font-weight: 600;
  }
  .deck-sub-val {
    font-size: 16px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--text-primary);
  }

  .deck-action-row {
    padding-top: 12px;
    border-top: 1px solid var(--border-hairline);
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .deck-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
    border-radius: 2px;
    border: 1px solid transparent;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s ease, border-color 0.15s ease;
    text-decoration: none;
    min-height: 38px;
    width: 100%;
  }
  .deck-btn-warn {
    background: var(--signal-warn-bg);
    color: var(--signal-warn-text);
    border-color: rgba(245, 158, 11, 0.4);
  }
  .deck-btn-warn:hover {
    background: rgba(245, 158, 11, 0.25);
    border-color: rgba(245, 158, 11, 0.7);
  }
  .deck-btn-secondary {
    background: var(--bg-surface-elevated);
    color: var(--text-primary);
    border-color: var(--border-hairline);
  }
  .deck-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-strong);
  }

  .sentry-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 6px;
    margin-top: auto;
  }
  .sentry-box {
    background: var(--bg-surface-subtle);
    border: 1px solid var(--border-hairline);
    padding: 10px 12px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .sentry-box.has-err {
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(69, 16, 16, 0.25);
  }
  .sentry-box.has-warn {
    border-color: rgba(245, 158, 11, 0.4);
    background: rgba(69, 36, 5, 0.25);
  }
  .sentry-box-num {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .sentry-box-lbl {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 600;
    line-height: 1.3;
  }

  /* ═══ Specifications Ribbon (Tier 2 Metadata) ═══ */
  .spec-ribbon {
    background: var(--bg-surface-subtle);
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 28px;
    font-size: 12px;
  }
  .spec-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
  }
  .spec-item .spec-title {
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
  }
  .spec-item .spec-val {
    color: var(--text-primary);
    font-weight: 700;
  }
  .spec-divider {
    width: 1px;
    height: 14px;
    background: var(--border-hairline);
  }

  .text-err { color: var(--signal-err); }
  .text-warn { color: var(--signal-warn); }
  .text-ok { color: var(--signal-ok); }
  .text-muted { color: var(--text-muted); }

  /* ═══ Asymmetric 2-Column Split ═══ */
  .swiss-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  .swiss-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  /* 4 overview cards สมมาตร: ระยะห่างใช้ gap อย่างเดียว ไม่ซ้อน margin */
  .swiss-col .card { margin-bottom: 0; }

  /* ═══ Swiss Structural Cards ═══ */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 22px 24px;
    margin-bottom: 24px;
  }
  .card h2 {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-primary);
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-hairline);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }
  /* หัวข้อชิดซ้ายตาม Swiss grid — subtitle (.soft ท้ายสุด) เท่านั้นที่ชิดขวา (เฉพาะ desktop) */
  @media (min-width: 541px) {
    .card h2 > .soft:last-child {
      margin-left: auto;
    }
  }
  .check {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-hairline);
    font-size: 13px;
  }
  .pass, .st-ok {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--signal-ok-bg);
    color: var(--signal-ok-text);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 2px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .fail, .st-err {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--signal-err-bg);
    color: var(--signal-err-text);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 2px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .st-warn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--signal-warn-bg);
    color: var(--signal-warn-text);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 2px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .stat .n.st-err { color: var(--signal-err); background: none; border: none; padding: 0; display: block; font-size: 32px; }
  .stat .n.st-warn { color: var(--signal-warn); background: none; border: none; padding: 0; display: block; font-size: 32px; }
  .st-unknown { color: var(--text-muted); }
  .detail { color: var(--signal-warn); font-size: 12px; margin: 4px 0 8px; }

  /* ═══ Tabular Data Alignment ═══ */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  th, td {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border-hairline);
    vertical-align: middle;
  }
  th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 700;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid var(--border-strong);
  }
  tr:hover td { background: rgba(255, 255, 255, 0.015); }
  .method { font-family: var(--font-mono, monospace); color: #38bdf8; white-space: nowrap; font-weight: 700; font-size: 12px; }
  .path { font-family: var(--font-mono, monospace); color: var(--text-primary); word-break: break-all; font-size: 12px; }
  .meta {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--border-hairline);
    font-variant-numeric: tabular-nums;
  }
  a {
    color: #38bdf8;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.15s ease, text-decoration-color 0.15s ease;
  }
  a:hover {
    color: #7dd3fc;
  }

  /* ═══ Buttons & Inputs (Clean Rectangular Precision) ═══ */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 2px;
    background: var(--swiss-blue);
    color: #ffffff !important;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-decoration: none;
    border: 1px solid var(--swiss-blue);
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .btn:hover { background: var(--swiss-blue-hover); border-color: var(--swiss-blue-hover); text-decoration: none; }
  .btn:active:not(:disabled) { transform: translateY(1px); }
  .btn:disabled { opacity: .5; cursor: wait; }
  .btn.ghost {
    background: transparent;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-strong);
  }
  .btn.ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text-secondary);
  }
  .btn-sm {
    font-size: 11px;
    padding: 5px 10px;
    min-height: 28px;
  }
  .btn-warn {
    color: #f59e0b !important;
    border-color: rgba(245, 158, 11, 0.5) !important;
  }
  .btn-warn:hover {
    background: rgba(245, 158, 11, 0.1) !important;
    border-color: #f59e0b !important;
  }
  .btn-danger {
    color: #ef4444 !important;
    border-color: rgba(239, 68, 68, 0.5) !important;
  }
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.1) !important;
    border-color: #ef4444 !important;
  }
  .mod-btn-group {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .mod-btn-group .btn {
    min-height: 32px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
  }
  .book-cover-cell {
    width: 44px;
    height: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .book-thumb {
    width: 44px;
    height: 60px;
    object-fit: cover;
    border-radius: 3px;
    border: 1px solid var(--border-hairline);
    background: var(--bg-surface-subtle);
    display: block;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }
  .book-thumb:hover {
    transform: scale(1.08);
    border-color: var(--swiss-blue);
    z-index: 2;
  }
  .book-thumb-fallback {
    width: 44px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface-subtle);
    border: 1px solid var(--border-hairline);
    border-radius: 3px;
    color: var(--text-muted);
  }
  .book-thumb-fallback .bl-icon {
    width: 20px;
    height: 20px;
    margin: 0;
  }
  .cond-badge {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .category-pill {
    display: inline-block;
    padding: 1px 6px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    font-size: 10px;
    color: var(--text-secondary);
    margin-left: 4px;
  }
  .story-toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #38bdf8;
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    padding: 2px 0;
    margin-top: 4px;
    font-family: inherit;
  }
  .story-toggle:hover {
    color: #7dd3fc;
  }
  .story-box {
    margin-top: 6px;
    padding: 8px 10px;
    background: rgba(0, 0, 0, 0.3);
    border-left: 2px solid var(--swiss-blue);
    border-radius: 2px;
    font-size: 12px;
    line-height: 1.45;
    color: var(--text-secondary);
    max-width: 440px;
  }
  .story-box b {
    color: var(--text-primary);
  }
  .pwd-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface-subtle);
    border: 1px solid var(--border-hairline);
    color: var(--text-secondary);
    border-radius: 2px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    transition: background 0.15s, color 0.15s;
    min-height: 36px;
  }
  .pwd-toggle-btn:hover {
    background: var(--border-hairline);
    color: var(--text-primary);
  }
  .mod-toast {
    display: none;
    padding: 10px 14px;
    margin-bottom: 12px;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid var(--border-hairline);
  }
  .mod-toast.ok {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--signal-ok-bg);
    color: var(--signal-ok-text);
    border-color: rgba(16, 185, 129, 0.4);
  }
  .mod-toast.err {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--signal-err-bg);
    color: var(--signal-err-text);
    border-color: rgba(239, 68, 68, 0.4);
  }

  .control-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    font-size: 13px;
    color: var(--text-secondary);
  }
  .control-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--swiss-blue);
    cursor: pointer;
  }

  .fix {
    background: var(--signal-warn-bg);
    border: 1px solid rgba(245, 158, 11, 0.4);
    border-radius: 2px;
    padding: 20px;
    margin-bottom: 24px;
  }
  .fix h2 { font-size: 14px; margin-bottom: 10px; color: var(--signal-warn-text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: none; padding: 0; }
  .fix ol { margin: 8px 0 8px 20px; font-size: 13px; line-height: 1.6; }
  .fix li { margin-bottom: 6px; }
  .code {
    background: #020617;
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 14px;
    font-family: var(--font-mono, monospace);
    font-size: 12px;
    white-space: pre;
    overflow-x: auto;
    margin-top: 10px;
    color: #cbd5e1;
    line-height: 1.5;
  }

  .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
  .dot.ok { background: var(--signal-ok); box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); animation: pulse 1.6s ease-in-out infinite; }
  .dot.bad { background: var(--signal-err); box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); animation: pulse 1.6s ease-in-out infinite; }
  .dot.idle { background: var(--text-muted); }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(0.9); } }

  .row-flex { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .row-flex select, .row-flex button {
    background: var(--bg-canvas);
    color: var(--text-primary);
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
  }
  .row-flex button { cursor: pointer; background: var(--swiss-blue); border-color: var(--swiss-blue); font-weight: 600; color: #fff; }
  .row-flex button:hover { background: var(--swiss-blue-hover); }
  /* ลิงก์ทดสอบ API: ปุ่มสมมาตร 2 คอลัมน์ เต็มความกว้างเท่ากัน */
  .api-link-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .api-link-grid .btn { width: 100%; }

  .mono { font-family: var(--font-mono, monospace); }
  .soft { color: var(--text-muted); font-weight: 400; font-size: 12px; }
  .hint { color: var(--text-secondary); font-size: 13px; margin-bottom: 12px; line-height: 1.5; }
  .chip {
    display: inline-flex;
    align-items: center;
    background: var(--bg-canvas);
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    margin: 0 8px 8px 0;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .req-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    margin-bottom: 8px;
    background: var(--bg-surface);
  }
  .req-wrap table {
    margin: 0;
    min-width: 580px;
  }

  .text-input, .text-area, .sel {
    background: var(--bg-canvas);
    color: var(--text-primary);
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .text-input:focus, .text-area:focus, .sel:focus {
    outline: none;
    border-color: var(--swiss-blue);
  }
  .text-area { min-height: 90px; font-family: var(--font-mono, monospace); resize: vertical; }
  .bar { height: 6px; border-radius: 1px; background: #020617; overflow: hidden; margin-top: 6px; }
  .bar > div { height: 100%; border-radius: 1px; }
  .lvl { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid var(--border-hairline); }
  .lvl:last-child { border-bottom: none; }
  .note {
    background: rgba(0, 0, 0, 0.25);
    border-left: 2px solid var(--swiss-blue);
    padding: 10px 14px;
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 14px;
    line-height: 1.5;
  }
  pre.out {
    background: #020617;
    border: 1px solid var(--border-hairline);
    border-radius: 2px;
    padding: 12px 14px;
    font-size: 12px;
    overflow-x: auto;
    max-height: 320px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--font-mono, monospace);
  }

  /* ═══ Multi-Device Responsive System (Desktop, Tablet, Mobile) ═══ */

  /* 1. Tablet Landscape & Medium Desktops (max-width: 1024px) */
  @media (max-width: 1024px) {
    body { padding: 32px 20px 70px; }
    .command-deck { grid-template-columns: 1fr; gap: 14px; }
    .grid { grid-template-columns: repeat(3, 1fr); gap: 1px; }
    .swiss-split { grid-template-columns: 1fr; gap: 20px; }
    .stat { padding: 16px 18px; }
    .stat .n { font-size: 28px; }
    .card { padding: 20px 22px; margin-bottom: 20px; }
  }

  /* 2. Tablet Portrait & Large Phones (max-width: 768px) */
  @media (max-width: 768px) {
    body { padding: 20px 16px 60px; }
    .masthead {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      padding-bottom: 20px;
      margin-bottom: 22px;
    }
    .masthead-brand-row { gap: 12px; }
    .masthead-logo-badge { width: 42px; height: 42px; }
    .masthead-right {
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    h1.masthead-title {
      font-size: clamp(20px, 5vw, 24px);
      line-height: 1.2;
    }
    .masthead-sub { font-size: 12px; }
    .command-deck { grid-template-columns: 1fr; gap: 14px; }
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      margin-bottom: 22px;
    }
    .stat { padding: 14px 16px; }
    .stat .n { font-size: 24px; }
    .stat .l { font-size: 10px; margin-top: 4px; }
    .card { padding: 18px 16px; margin-bottom: 18px; }
    .tabs {
      gap: 2px;
      margin-bottom: 22px;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
    }
    .tab {
      padding: 10px 14px;
      font-size: 12px;
      flex-shrink: 0;
      min-height: 44px;
      scroll-snap-align: start;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .check {
      font-size: 12px;
      gap: 12px;
      padding: 8px 0;
      flex-wrap: wrap;
      row-gap: 6px;
    }
    .check > span:first-child {
      min-width: 0;
      flex: 1 1 180px;
      overflow-wrap: anywhere;
    }
    /* Overview 2-col tables (PHP env): fit without h-scroll; 4-col logs keep scroll */
    .req-wrap--fit table { min-width: 0; }
    .req-wrap--fit th, .req-wrap--fit td { white-space: normal; overflow-wrap: anywhere; }
    th, td {
      padding: 8px 10px;
      font-size: 12px;
    }
    .btn { min-height: 44px; }
    .btn-sm {
      min-height: 44px;
      padding: 10px 14px;
      font-size: 12px;
    }
    .control-label {
      min-height: 44px;
    }
    .control-label input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }
  }

  /* 3. Mobile Phones (max-width: 540px) */
  @media (max-width: 540px) {
    body { padding: 14px 10px 50px; }
    .masthead-brand-row { flex-direction: column; align-items: flex-start; gap: 10px; }
    h1.masthead-title { font-size: 20px; }
    .badge { padding: 5px 12px; font-size: 11px; }
    .command-deck { grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px; }
    .deck-card { padding: 16px 14px; }
    .deck-hero-num { font-size: 32px; }
    .deck-btn { min-height: 44px; }
    .spec-ribbon {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 12px 14px;
      margin-bottom: 20px;
    }
    .spec-divider { display: none; }
    .card { padding: 14px 12px; margin-bottom: 14px; }
    .card h2 {
      font-size: 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .row-flex {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
    .row-flex > * {
      width: 100% !important;
      min-width: 0 !important;
    }
    .row-flex select,
    .row-flex input,
    .row-flex button {
      min-height: 44px;
      font-size: 13px;
    }
    .api-link-grid { grid-template-columns: 1fr; }
    .btn {
      min-height: 44px;
      font-size: 12px;
      padding: 10px 16px;
    }
    .btn-sm {
      min-height: 44px;
      font-size: 12px;
      padding: 10px 14px;
    }
    .grid { grid-template-columns: repeat(2, 1fr); }
    .stat { padding: 12px 10px; }
    .stat .n { font-size: 20px; }
    .stat .l { font-size: 9px; letter-spacing: 0.04em; }
    .req-wrap table { min-width: 500px; }
    /* 4 overview divs: PHP-env 2-col fits without h-scroll; .check wraps (wins over 500px floor) */
    .req-wrap--fit table { min-width: 0; }
    .req-wrap--fit th, .req-wrap--fit td { white-space: normal; overflow-wrap: anywhere; }
    .swiss-split .check { flex-wrap: wrap; row-gap: 6px; }
    .swiss-split .check > span:first-child { min-width: 0; flex: 1 1 180px; overflow-wrap: anywhere; }
    /* 393px: overview tables fit container — no h-scroll in these 4 cards */
    #p-overview .req-wrap table { min-width: 0; width: 100%; table-layout: auto; }
    #p-overview .req-wrap th, #p-overview .req-wrap td { white-space: normal; overflow-wrap: anywhere; }
    #p-overview .req-wrap td.mono, #p-overview .req-wrap td.path { word-break: break-all; }
    pre.out, .code {
      font-size: 11px;
      padding: 10px;
    }
    .fix ol {
      margin-left: 16px;
      font-size: 12px;
    }
  }

  /* 4. Ultra-compact / Small Mobile (max-width: 360px) */
  @media (max-width: 360px) {
    .command-deck { grid-template-columns: 1fr; }
    .deck-hero-num { font-size: 28px; }
    .deck-sub-grid, .sentry-grid { grid-template-columns: 1fr; }
    .grid { grid-template-columns: 1fr; }
    body { padding: 10px 8px 40px; }
    .stat .n { font-size: 18px; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header class="masthead">
    <div class="masthead-left">
      <div class="masthead-brand-row">
        <div class="masthead-logo-badge" aria-hidden="true">
          <?= bl_icon('book', 'bl-icon-lg') ?>
        </div>
        <div>
          <div class="masthead-title-wrap">
            <h1 class="masthead-title">BookLoop API & Telemetry</h1>
            <span class="env-pill"><?= $isLocal ? 'Dev Node (Local)' : 'Production' ?> · <?= htmlspecialchars($host !== '' ? $host : 'panitijahem.xo.je', ENT_QUOTES, 'UTF-8') ?></span>
          </div>
          <p class="masthead-sub">ศูนย์ควบคุมระบบหลังบ้าน & สุขภาพ API แบบเรียลไทม์</p>
        </div>
      </div>
    </div>
    <div class="masthead-right">
      <div class="badge <?= $appOk ? 'ok' : 'bad' ?>" id="liveBadge"><?= $appOk ? (bl_icon('check', 'bl-icon-sm') . 'ออนไลน์') : (bl_icon('alert', 'bl-icon-sm') . 'มีปัญหา — เช็กด้านล่าง') ?></div>
      <p class="live-line" id="liveLine"><?= bl_icon('refresh', 'bl-icon bl-icon-spin') ?>กำลังเชื่อมต่อแบบเรียลไทม์… (รีเฟรชอัตโนมัติทุก <b id="liveEvery">5</b> วินาที)</p>
    </div>
  </header>

  <?php if (!$appOk && $envError !== '' && !$isEnvMissing): ?>
  <div class="fix">
    <h2><?= bl_icon('wrench') ?>วิธีแก้: อัปโหลดไฟล์ขึ้นเซิร์ฟเวอร์ยังไม่ครบ</h2>
    <ol>
      <li>อัปโหลด <b>เนื้อในโฟลเดอร์ infinityfree_package/</b> ทั้งหมดไปไว้ใน <b>htdocs/</b> ของโดเมน — ห้ามอัปโหลดทั้งโฟลเดอร์ทับลงไป ไม่งั้นจะได้ htdocs ซ้อนกัน</li>
      <li>บนเซิร์ฟเวอร์ต้องมีครบ: <b>.htaccess, api/, auth/, config/, Services/, email/, vendor/</b> — ตอนนี้ขาดไฟล์ตามข้อความ error ด้านล่าง</li>
      <li>ลบไฟล์ <b>index2.html</b> (หน้า default ของ InfinityFree) ออกจาก htdocs/ ถ้ายังมี</li>
      <li>รีเฟรชหน้านี้ — ขั้นต่อไปจะบอกให้สร้างไฟล์ .env เอง</li>
    </ol>
  </div>
  <?php endif; ?>

  <?php if ($isEnvMissing): ?>
  <div class="fix">
    <h2><?= bl_icon('wrench') ?>วิธีแก้: สร้างไฟล์ .env บนเซิร์ฟเวอร์</h2>
    <ol>
      <li>เข้า InfinityFree → File Manager → โฟลเดอร์ <b>htdocs</b> → New File ชื่อ <b>.env</b></li>
      <li>วางเนื้อหาด้านล่าง แล้วกรอกอีเมลผู้ส่ง + App Password ของจริง</li>
      <li>รีเฟรชหน้านี้ — ต้องขึ้น <b>ออนไลน์</b></li>
    </ol>
    <div class="code">SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=ใส่อีเมลผู้ส่ง@gmail.com
SMTP_PASSWORD=ใส่AppPassword16หลักที่ไม่มีช่องว่าง
SMTP_ENCRYPTION=tls
MAIL_TIMEOUT=15
MAIL_FROM_ADDRESS=ใส่อีเมลผู้ส่ง@gmail.com
MAIL_FROM_NAME=BookLoop
ALLOWED_ORIGIN=https://solightzz.github.io,https://panitijahem.xo.je,http://localhost:3000
SUBSCRIBERS_FILE=subscribers.txt
ACTIVITIES_FILE=activities.txt
LOG_FILE=error.log
REQUEST_LOG_FILE=request.log
TEMPLATE_IMAGE=images/template.png
FONT_PATH=images/fonts/NotoSansThai.ttf
GENERATED_IMAGES_PATH=images/generated</div>
  </div>
  <?php endif; ?>

  <div class="tabs" role="tablist" aria-label="หมวดหมู่ระบบ">
    <button class="tab active" data-pane="p-overview" id="tab-overview" role="tab" aria-selected="true" aria-controls="p-overview" type="button"><?= bl_icon('chart') ?>ภาพรวม</button>
    <button class="tab" data-pane="p-req" id="tab-req" role="tab" aria-selected="false" aria-controls="p-req" type="button"><?= bl_icon('inbox') ?>Requests</button>
    <button class="tab" data-pane="p-logs" id="tab-logs" role="tab" aria-selected="false" aria-controls="p-logs" type="button"><?= bl_icon('log') ?>Logs</button>
    <button class="tab" data-pane="p-ep" id="tab-ep" role="tab" aria-selected="false" aria-controls="p-ep" type="button"><?= bl_icon('plug') ?>Endpoints (<span id="epCount"><?= count($endpoints) ?></span>)</button>
    <button class="tab" data-pane="p-listings" id="tab-listings" role="tab" aria-selected="false" aria-controls="p-listings" type="button"><?= bl_icon('box') ?>รายการลงขาย<?= $pendingCount > 0 ? ' <span class="tab-badge">' . $pendingCount . ' รอ</span>' : '' ?></button>
    <button class="tab" data-pane="p-data" id="tab-data" role="tab" aria-selected="false" aria-controls="p-data" type="button"><?= bl_icon('server') ?>ข้อมูล</button>
    <button class="tab" data-pane="p-tools" id="tab-tools" role="tab" aria-selected="false" aria-controls="p-tools" type="button"><?= bl_icon('tools') ?>เครื่องมือ</button>
  </div>

  <!-- ═══ ภาพรวม ═══ -->
  <div class="pane active" id="p-overview" role="tabpanel" aria-labelledby="tab-overview">
    <!-- ═══ Command Deck (High-Hierarchy Operational Panels) ═══ -->
    <div class="command-deck">
      <!-- 1. Live Pulse & Latency -->
      <div class="deck-card deck-card-pulse">
        <div class="deck-header">
          <span class="deck-label"><?= bl_icon('bolt') ?> สัญญาณ API & ทราฟฟิก</span>
          <span class="deck-tag <?= $appOk ? 'deck-tag-ok' : 'deck-tag-err' ?>" id="heroPulseTag"><?= $appOk ? 'ออนไลน์ (สด)' : 'มีปัญหา' ?></span>
        </div>
        <div class="deck-hero">
          <span class="deck-hero-num mono" id="heroLatency">—</span>
          <span class="deck-hero-unit">ms</span>
        </div>
        <div class="deck-desc">ความเร็วการตอบสนองเฉลี่ย (Live Ping)</div>
        <div class="deck-sub-grid">
          <div class="deck-sub-stat">
            <span class="deck-sub-label">GET Requests</span>
            <span class="deck-sub-val mono" id="stGet"><?= $totGet ?></span>
          </div>
          <div class="deck-sub-stat">
            <span class="deck-sub-label">POST Requests</span>
            <span class="deck-sub-val mono" id="stPost"><?= $totPost ?></span>
          </div>
        </div>
      </div>

      <!-- 2. BookLoop C2C Review Queue -->
      <div class="deck-card deck-card-queue <?= $pendingCount === 0 ? 'is-empty' : '' ?>">
        <div class="deck-header">
          <span class="deck-label"><?= bl_icon('box') ?> คิวอนุมัติหนังสือ C2C</span>
          <span class="deck-tag <?= $pendingCount > 0 ? 'deck-tag-warn' : 'deck-tag-ok' ?>" id="heroQueueTag"><?= $pendingCount > 0 ? ($pendingCount . ' รายการใหม่') : 'คิวว่าง' ?></span>
        </div>
        <div class="deck-hero">
          <span class="deck-hero-num <?= $pendingCount > 0 ? 'text-warn' : 'text-ok' ?>" id="heroPendingCount"><?= $pendingCount ?></span>
          <span class="deck-hero-unit">เล่ม</span>
        </div>
        <div class="deck-desc">ทั้งหมด <?= $totalListingCount ?> เล่ม · เผยแพร่อยู่ <?= $activeListingCount ?> เล่ม</div>
        <div class="deck-action-row">
          <button type="button" class="deck-btn <?= $pendingCount > 0 ? 'deck-btn-warn' : 'deck-btn-secondary' ?>" id="heroListingsBtn" onclick="document.getElementById('tab-listings').click();">
            <?= bl_icon('box') ?><?= $pendingCount > 0 ? 'เปิดตรวจคิว (' . $pendingCount . ' เล่ม) →' : 'จัดการคลังหนังสือ →' ?>
          </button>
        </div>
      </div>

      <!-- 3. Friction & Sentry Guard -->
      <div class="deck-card deck-card-sentry <?= ($totErr > 0 || $rejCount > 0) ? 'has-alerts' : '' ?>" id="heroSentryCard">
        <div class="deck-header">
          <span class="deck-label"><?= bl_icon('alert') ?> ตัวเฝ้าระวังข้อผิดพลาด</span>
          <span class="deck-tag <?= ($totErr > 0 || $rejCount > 0) ? 'deck-tag-err' : 'deck-tag-ok' ?>" id="sentryStatusTag">
            <?= ($totErr > 0 || $rejCount > 0) ? (bl_icon('alert') . ' พบ ' . ($totErr + $rejCount) . ' ปัญหา') : (bl_icon('check') . ' ปลอดภัย 100%') ?>
          </span>
        </div>
        <div class="deck-desc" style="margin-bottom:8px">ตรวจจับคำขอล้มเหลว & ปฏิเสธ CORS</div>
        <div class="sentry-grid">
          <div class="sentry-box <?= $totErr > 0 ? 'has-err' : '' ?>" id="sentryBoxErr">
            <div class="sentry-box-num <?= $totErr > 0 ? 'text-err' : 'text-muted' ?>" id="stErr"><?= $totErr ?></div>
            <div class="sentry-box-lbl">ติด 4xx / 5xx</div>
          </div>
          <div class="sentry-box <?= $rejCount > 0 ? 'has-warn' : '' ?>" id="sentryBoxRej">
            <div class="sentry-box-num <?= $rejCount > 0 ? 'text-warn' : 'text-muted' ?>" id="stRej"><?= $rejCount ?></div>
            <div class="sentry-box-lbl">Origin ถูกปฏิเสธ</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Specifications Ribbon (Tier 2 Metadata) ═══ -->
    <div class="spec-ribbon">
      <div class="spec-item">
        <span class="spec-title">API Endpoints:</span>
        <span class="spec-val mono"><span id="stEp"><?= count($endpoints) ?></span> เส้นทาง</span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <span class="spec-title">PHP Engine:</span>
        <span class="spec-val mono" id="stPhp"><?= htmlspecialchars(PHP_VERSION, ENT_QUOTES, 'UTF-8') ?></span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <span class="spec-title">Mail Gateway:</span>
        <span class="spec-val" id="stMail"><?= $mailReady ? 'SMTP พร้อมส่ง' : 'SMTP ยังไม่พร้อม' ?></span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <span class="spec-title">Data Store:</span>
        <span class="spec-val">JSON (Atomic flock)</span>
      </div>
      <div class="spec-divider"></div>
      <div class="spec-item">
        <span class="spec-title">Node Environment:</span>
        <span class="spec-val"><?= $isLocal ? 'Local Development' : 'Production' ?> · <?= htmlspecialchars($host !== '' ? $host : 'panitijahem.xo.je', ENT_QUOTES, 'UTF-8') ?></span>
      </div>
    </div>

    <div class="swiss-split">
      <div class="swiss-col">
        <div class="card">
          <h2><?= bl_icon('bolt') ?>การเชื่อมต่อ API แบบเรียลไทม์</h2>
          <div class="check">
            <span><span class="dot idle" id="apiDot"></span><span id="apiLabel">กำลังทดสอบการเชื่อมต่อ…</span></span>
            <span class="mono" id="apiLatency">—</span>
          </div>
          <p class="detail" id="apiDetail" style="color:#94a3b8"></p>
          <div class="row-flex" style="margin-top:12px">
            <label class="control-label"><input type="checkbox" id="autoRefresh" checked> อัปเดตอัตโนมัติ</label>
            <label class="control-label">ทุก <select id="refreshSec" aria-label="ความถี่รีเฟรช">
              <option value="3">3 วินาที</option>
              <option value="5" selected>5 วินาที</option>
              <option value="10">10 วินาที</option>
              <option value="30">30 วินาที</option>
            </select></label>
            <button type="button" id="refreshNow" class="btn"><?= bl_icon('refresh') ?>ทดสอบตอนนี้</button>
          </div>
        </div>

        <div class="card">
          <h2><?= bl_icon('server') ?>สถานะระบบ <span class="soft">(System Health)</span></h2>
          <div id="liveChecks">
          <?php foreach ($checks as $key => $c): ?>
            <div class="check" data-check="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8') ?>">
              <span><?= htmlspecialchars($c['label'], ENT_QUOTES, 'UTF-8') ?></span>
              <span class="<?= $c['ok'] ? 'pass' : 'fail' ?>" data-role="status"><?= $c['ok'] ? 'ผ่าน' : 'ไม่ผ่าน' ?></span>
            </div>
            <?php if (!$c['ok'] && $c['detail'] !== ''): ?>
              <p class="detail" data-role="detail"><?= htmlspecialchars($c['detail'], ENT_QUOTES, 'UTF-8') ?></p>
            <?php endif; ?>
          <?php endforeach; ?>
          </div>
        </div>
      </div>

      <div class="swiss-col">
        <div class="card">
          <h2><?= bl_icon('folder') ?>ไฟล์ log ของระบบ <span class="soft">(System Logs)</span></h2>
          <div class="req-wrap">
          <table>
            <thead>
              <tr><th scope="col">ไฟล์</th><th scope="col">คำอธิบาย</th><th scope="col">ขนาด</th><th scope="col">บรรทัด</th></tr>
            </thead>
            <tbody>
            <?php foreach ($dataFiles as $f): ?>
            <tr>
              <td class="path"><?= htmlspecialchars($f['name'], ENT_QUOTES, 'UTF-8') ?></td>
              <td><?= htmlspecialchars($f['desc'], ENT_QUOTES, 'UTF-8') ?></td>
              <td class="mono"><?= $f['exists'] ? htmlspecialchars($f['size'], ENT_QUOTES, 'UTF-8') : '<span class="soft">ยังไม่มีไฟล์</span>' ?></td>
              <td class="mono"><?= $f['lines'] !== null ? number_format($f['lines']) : '—' ?></td>
            </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
          </div>
          <div class="note"><?= bl_icon('info') ?>หาก request.log โตเร็วผิดปกติ ให้ตรวจสอบที่แท็บ Requests</div>
        </div>

        <div class="card">
          <h2><?= bl_icon('server') ?>สภาพแวดล้อม PHP</h2>
          <div class="req-wrap req-wrap--fit">
          <table>
            <thead>
              <tr><th scope="col">หัวข้อ</th><th scope="col">ค่า</th></tr>
            </thead>
            <tbody>
              <tr><td>PHP version</td><td class="mono"><?= htmlspecialchars(PHP_VERSION, ENT_QUOTES, 'UTF-8') ?></td></tr>
              <tr><td>Extensions (curl · mbstring · openssl · json)</td><td class="mono"><?= $extOk ? '<span class="pass">' . bl_icon('check') . 'ครบ</span>' : '<span class="fail">' . bl_icon('x') . htmlspecialchars(implode(', ', $missingExt), ENT_QUOTES, 'UTF-8') . '</span>' ?></td></tr>
              <tr><td>max_execution_time / memory_limit</td><td class="mono"><?= htmlspecialchars((string) ini_get('max_execution_time'), ENT_QUOTES, 'UTF-8') ?>s / <?= htmlspecialchars((string) ini_get('memory_limit'), ENT_QUOTES, 'UTF-8') ?></td></tr>
              <tr><td>disk ว่าง (docroot)</td><td class="mono"><?php $df = @disk_free_space(__DIR__);
                echo $df === false ? '—' : htmlspecialchars(bl_human_size((int) $df), ENT_QUOTES, 'UTF-8'); ?></td></tr>
              <tr><td>SMTP พร้อมส่งเมล</td><td><?= $mailReady ? '<span class="pass">' . bl_icon('check') . 'พร้อม</span>' : '<span class="st-warn">' . bl_icon('alert') . 'ยังไม่พร้อม (เช็ก .env)</span>' ?></td></tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ Requests ═══ -->
  <div class="pane" id="p-req" role="tabpanel" aria-labelledby="tab-req">
    <div class="card">
      <h2><?= bl_icon('inbox') ?>Request ล่าสุด <span class="soft">(request.log)</span></h2>
      <p class="hint" id="reqHint">กำลังโหลดจาก data/request.log…</p>
      <div id="reqStats" style="margin-bottom:8px"></div>
      <div class="req-wrap">
        <table>
          <thead>
            <tr><th scope="col">เวลา</th><th scope="col">Method</th><th scope="col">Path</th><th scope="col">ที่มา (IP · client)</th><th scope="col">สถานะ</th><th scope="col">ms</th></tr>
          </thead>
          <tbody id="reqBody">
            <tr><td colspan="6" class="soft">กำลังโหลด…</td></tr>
          </tbody>
        </table>
      </div>
      <p class="detail" id="reqDetail"></p>
    </div>

    <div class="card">
      <h2><?= bl_icon('shield-ban') ?>Origin ที่ถูกปฏิเสธ <span class="soft">(CORS / ALLOWED_ORIGIN)</span></h2>
      <div id="originBox" class="hint">กำลังโหลด…</div>
      <div class="row-flex" style="margin-top:12px">
        <input type="text" id="originInput" class="text-input" style="flex:1;min-width:220px" placeholder="https://domain.com ที่ต้องการทดสอบ" aria-label="ที่อยู่ Origin ที่ต้องการทดสอบ">
        <button type="button" id="originCheck" class="btn"><?= bl_icon('search') ?>เช็ก Origin นี้</button>
      </div>
      <p class="detail" id="originResult"></p>
    </div>
  </div>

  <!-- ═══ Logs ═══ -->
  <div class="pane" id="p-logs" role="tabpanel" aria-labelledby="tab-logs">
    <div class="card">
      <h2><?= bl_icon('log') ?>สรุป error.log <span class="soft">(400 บรรทัดล่าสุด)</span></h2>
      <div id="logLevels"><p class="hint">กำลังโหลด…</p></div>
    </div>
    <div class="card">
      <h2><?= bl_icon('alert') ?>เหตุการณ์ล่าสุด <span class="soft">(WARNING ขึ้นไป)</span></h2>
      <div id="logEvents"><p class="hint">กำลังโหลด…</p></div>
      <div class="note"><?= bl_icon('lock') ?>อ่านอย่างเดียว — จัดการ log เต็มรูปแบบได้ที่ <span class="mono">GET/DELETE /api/logs.php</span> (ต้องใช้ Token)</div>
    </div>
  </div>

  <!-- ═══ Endpoints ═══ -->
  <div class="pane" id="p-ep" role="tabpanel" aria-labelledby="tab-ep">
    <div class="card">
      <h2><?= bl_icon('plug') ?>Endpoints <span class="soft">(api/*.php)</span></h2>
      <div class="row-flex" style="margin-bottom:10px">
        <input type="text" id="epSearch" class="text-input" style="flex:1;min-width:220px" placeholder="ค้น เช่น auth / order / log …" aria-label="ค้นหา Endpoint">
        <select id="epFilter" class="sel" aria-label="กรองประเภท Auth">
          <option value="">ทุกแบบ</option>
          <option value="open">เปิด (ไม่ต้อง login)</option>
          <option value="lock">ต้องใช้ token</option>
        </select>
      </div>
      <div class="req-wrap">
      <table>
        <thead>
          <tr><th scope="col">Method</th><th scope="col">Path</th><th scope="col">คำอธิบาย</th><th scope="col">Auth</th></tr>
        </thead>
        <tbody>
        <?php foreach ($endpoints as [$m, $p, $d, $auth]): ?>
          <tr data-ep="<?= htmlspecialchars(strtolower($p . ' ' . $d . ' ' . $auth), ENT_QUOTES, 'UTF-8') ?>" data-auth="<?= htmlspecialchars($auth, ENT_QUOTES, 'UTF-8') ?>">
            <td class="method"><?= htmlspecialchars($m, ENT_QUOTES, 'UTF-8') ?></td>
            <td class="path"><?= htmlspecialchars($p, ENT_QUOTES, 'UTF-8') ?></td>
            <td><?= htmlspecialchars($d, ENT_QUOTES, 'UTF-8') ?></td>
            <td><?= ($auth === 'token' || strpos($auth, 'token') !== false) ? ('<span class="st-warn">' . bl_icon('lock') . 'token</span>') : ('<span class="pass">' . bl_icon('check') . 'เปิด</span>') ?><?= $auth === 'เปิด*' ? '<span class="soft"> (rate-limit)</span>' : '' ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      </div>
      <p class="hint" style="margin-top:10px;margin-bottom:0" id="epCountLine"><?= count($endpoints) ?> endpoints · <?= bl_icon('lock') ?> = ต้องส่ง token ผ่าน ?token= หรือ JSON field</p>
    </div>

    <div class="card">
      <h2><?= bl_icon('beaker') ?>ทดสอบ Endpoint <span class="soft">(GET/OPTIONS)</span></h2>
      <p class="hint">เลือก endpoint เพื่อตรวจสอบ HTTP Status และการตอบกลับของเซิร์ฟเวอร์</p>
      <div class="row-flex" style="margin-bottom:10px">
        <select id="tryEp" class="sel" style="flex:1;min-width:220px" aria-label="เลือก Endpoint สำหรับทดสอบ">
          <option value="/api/">/api/ (รายชื่อ endpoint)</option>
          <option value="/api/books.php?limit=1">/api/books.php?limit=1 (หนังสือ 1 เล่ม)</option>
          <option value="/api/listings_list.php?limit=1">/api/listings_list.php?limit=1 (รายการลงขาย)</option>
          <option value="/api/auth_me.php">/api/auth_me.php (ต้องได้ 401 ถ้าไม่ส่ง token — ปกติ)</option>
          <option value="/api/newsletter_status.php?email=test@example.com">/api/newsletter_status.php (เช็ก subscribe)</option>
        </select>
        <button type="button" id="tryBtn" class="btn"><?= bl_icon('play') ?>ยิง GET</button>
      </div>
      <pre class="out" id="tryOut">ยังไม่ได้ยิง — เลือก endpoint แล้วกดปุ่ม</pre>
    </div>
  </div>

  <!-- ═══ รายการลงขาย ═══ -->
  <div class="pane" id="p-listings" role="tabpanel" aria-labelledby="tab-listings">
    <div class="card">
      <h2><?= bl_icon('box') ?>จัดการและอนุมัติรายการลงขาย <span class="soft" id="listingsPendingBadge">(<?= $pendingCount ?> รอตรวจสอบ)</span></h2>
      <p class="hint">จัดการสถานะหนังสือ: อนุมัติ, หยุดขาย หรือลบรายการ (ต้องเข้าสู่ระบบด้วย ADMIN_TOKEN)</p>
      <form class="row-flex" id="adminLoginBar" style="margin-bottom:12px;gap:8px;align-items:center;flex-wrap:wrap" action="#" onsubmit="return false">
        <input type="text" id="adminUser" name="username" value="admin" autocomplete="username" aria-label="ชื่อผู้ใช้ผู้ดูแล" tabindex="-1" style="position:absolute;left:-10000px;width:1px;height:1px;opacity:0;pointer-events:none" readonly>
        <div style="position:relative;display:inline-flex;align-items:center;flex:1;min-width:240px">
          <input type="password" id="adminPass" name="password" class="text-input" style="width:100%;padding-right:42px" placeholder="รหัสผู้ดูแล (ADMIN_TOKEN)" aria-label="รหัสผู้ดูแล" autocomplete="current-password">
          <button type="button" id="adminPassToggle" class="pwd-toggle-btn" style="position:absolute;right:3px;top:3px;bottom:3px;border:none;min-height:auto;padding:4px 8px" aria-label="แสดง/ซ่อนรหัสผ่าน"><?= bl_icon('eye') ?></button>
        </div>
        <button type="button" id="adminLoginBtn" class="btn"><?= bl_icon('lock') ?>เข้าสู่ระบบผู้ดูแล</button>
        <button type="button" id="adminLogoutBtn" class="btn ghost" style="display:none"><?= bl_icon('x') ?>ออกจากระบบ</button>
        <span class="soft" id="adminLoginState">ยังไม่ได้เข้าสู่ระบบ</span>
      </form>
      <div id="modToast" class="mod-toast" role="status" aria-live="polite"></div>
      <div class="row-flex" style="margin-bottom:12px;gap:8px">
        <button type="button" id="listingsReload" class="btn"><?= bl_icon('refresh') ?>โหลดรายการใหม่ (รีเฟรช)</button>
      </div>
      <div class="req-wrap">
      <table id="listingsTable">
        <thead>
          <tr>
            <th scope="col" style="width:48px;text-align:center">ปก</th>
            <th scope="col">หนังสือ & ข้อมูล</th>
            <th scope="col">ราคา</th>
            <th scope="col">สถานะ</th>
            <th scope="col">ลงเมื่อ</th>
            <th scope="col">จัดการ</th>
          </tr>
        </thead>
        <tbody id="listingsBody">
          <?php if (count($moderateListings) === 0): ?>
            <tr><td colspan="6" class="soft">ยังไม่มีรายการลงขาย — ลงขายผ่านหน้า /sell แล้วรายการจะโผล่ที่นี่</td></tr>
          <?php else: ?>
            <?php foreach ($moderateListings as $ml): ?>
            <tr data-lid="<?= htmlspecialchars($ml['id'], ENT_QUOTES, 'UTF-8') ?>">
              <td style="text-align:center"><?= bl_render_listing_cover($ml['image'], $ml['title']) ?></td>
              <td>
                <div style="font-weight:600"><?= htmlspecialchars($ml['title'], ENT_QUOTES, 'UTF-8') ?></div>
                <div style="margin-top:3px;display:flex;align-items:center;gap:4px;flex-wrap:wrap">
                  <?php if ($ml['author'] !== ''): ?><span class="soft"><?= htmlspecialchars($ml['author'], ENT_QUOTES, 'UTF-8') ?></span><?php endif; ?>
                  <?= bl_render_condition_badge($ml['condition']) ?>
                  <?php if ($ml['category'] !== ''): ?><span class="category-pill"><?= htmlspecialchars($ml['category'], ENT_QUOTES, 'UTF-8') ?></span><?php endif; ?>
                </div>
                <?php if ($ml['story'] !== '' || $ml['defects'] !== ''): ?>
                  <button type="button" class="story-toggle" data-toggle-story="<?= htmlspecialchars($ml['id'], ENT_QUOTES, 'UTF-8') ?>"><?= bl_icon('info') ?>ดูเรื่องราว/ตำหนิ</button>
                  <div class="story-box" id="story-<?= htmlspecialchars($ml['id'], ENT_QUOTES, 'UTF-8') ?>" style="display:none">
                    <?php if ($ml['story'] !== ''): ?><div><b>เรื่องราว:</b> <?= htmlspecialchars($ml['story'], ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
                    <?php if ($ml['defects'] !== ''): ?><div style="margin-top:4px"><b>ตำหนิ:</b> <?= htmlspecialchars($ml['defects'], ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
                  </div>
                <?php endif; ?>
                <div class="mono soft" style="font-size:10px;margin-top:4px">ID: <?= htmlspecialchars($ml['id'], ENT_QUOTES, 'UTF-8') ?></div>
              </td>
              <td class="mono">
                <b>฿<?= htmlspecialchars(number_format($ml['price'], 0), ENT_QUOTES, 'UTF-8') ?></b>
                <?php if ($ml['originalPrice'] !== null && $ml['originalPrice'] > $ml['price']): ?>
                  <div class="soft" style="text-decoration:line-through;font-size:11px">฿<?= htmlspecialchars(number_format($ml['originalPrice'], 0), ENT_QUOTES, 'UTF-8') ?></div>
                <?php endif; ?>
              </td>
              <td class="listing-status">
                <?= bl_render_listing_status($ml['status']) ?>
              </td>
              <td class="mono" style="white-space:nowrap;font-size:11px"><?= htmlspecialchars(substr($ml['createdAt'], 0, 16), ENT_QUOTES, 'UTF-8') ?></td>
              <td style="white-space:nowrap" class="listing-actions">
                <?= bl_render_listing_actions($ml['id'], $ml['status'], $ml['title']) ?>
              </td>
            </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
      </div>
      <pre class="out" id="listingsOut" style="display:none;margin-top:12px"></pre>
    </div>
  </div>

  <!-- ═══ ข้อมูล (data/) ═══ -->
  <div class="pane" id="p-data" role="tabpanel" aria-labelledby="tab-data">
    <div class="card">
      <h2><?= bl_icon('server') ?>ข้อมูลใน data/ <span class="soft" id="dataFileMeta"></span></h2>
      <p class="hint">ดู เพิ่ม แก้ไข ลบ แถว หรือแก้ทั้งไฟล์ JSON (txt/log อ่านอย่างเดียว, ฟิลด์ password ล็อกไว้) — ต้องเข้าสู่ระบบด้วย ADMIN_TOKEN</p>
      <form class="row-flex" id="dataAdminBar" style="margin-bottom:12px;gap:8px;align-items:center;flex-wrap:wrap" action="#" onsubmit="return false">
        <input type="text" id="dataAdminUser" name="username" value="admin" autocomplete="username" aria-label="ชื่อผู้ใช้ผู้ดูแล" tabindex="-1" style="position:absolute;left:-10000px;width:1px;height:1px;opacity:0;pointer-events:none" readonly>
        <div style="position:relative;display:inline-flex;align-items:center;flex:1;min-width:240px">
          <input type="password" id="dataAdminPass" name="password" class="text-input" style="width:100%;padding-right:42px" placeholder="รหัสผู้ดูแล (ADMIN_TOKEN)" aria-label="รหัสผู้ดูแล" autocomplete="current-password">
          <button type="button" id="dataAdminPassToggle" class="pwd-toggle-btn" style="position:absolute;right:3px;top:3px;bottom:3px;border:none;min-height:auto;padding:4px 8px" aria-label="แสดง/ซ่อนรหัสผ่าน"><?= bl_icon('eye') ?></button>
        </div>
        <button type="button" id="dataAdminLoginBtn" class="btn"><?= bl_icon('lock') ?>เข้าสู่ระบบผู้ดูแล</button>
        <button type="button" id="dataAdminLogoutBtn" class="btn ghost" style="display:none"><?= bl_icon('x') ?>ออกจากระบบ</button>
        <span class="soft" id="dataAdminLoginState">ยังไม่ได้เข้าสู่ระบบ</span>
      </form>
      <div id="dataToast" class="mod-toast" role="status" aria-live="polite" style="display:none"></div>
      <div class="row-flex" style="margin-bottom:12px;gap:8px;align-items:center;flex-wrap:wrap">
        <select id="dataFileSel" class="text-input" style="flex:1;min-width:220px" aria-label="เลือกไฟล์ข้อมูล">
          <option value="">— เลือกไฟล์ —</option>
        </select>
        <button type="button" id="dataReload" class="btn"><?= bl_icon('refresh') ?>โหลดใหม่</button>
        <button type="button" id="dataAddRow" class="btn ghost"><?= bl_icon('check') ?>เพิ่มแถว</button>
        <button type="button" id="dataEditFile" class="btn ghost"><?= bl_icon('wrench') ?>แก้ไขทั้งไฟล์ (JSON)</button>
      </div>
      <div class="row-flex" style="margin-bottom:12px;gap:8px;align-items:center">
        <input type="search" id="dataSearch" class="text-input" style="flex:1;min-width:200px" placeholder="ค้นหาในตาราง…" aria-label="ค้นหาในตาราง">
        <span class="soft mono" id="dataCount" style="font-size:11px;white-space:nowrap"></span>
      </div>
      <div class="req-wrap">
      <table id="dataTable">
        <thead id="dataHead"></thead>
        <tbody id="dataBody">
          <tr><td class="soft" style="text-align:center;padding:24px">เลือกไฟล์แล้วกดโหลดใหม่ (ต้องเข้าสู่ระบบผู้ดูแลก่อน)</td></tr>
        </tbody>
      </table>
      </div>
      <div class="row-flex" style="margin-top:12px;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <span class="soft mono" id="dataPageInfo" style="font-size:11px"></span>
        <div style="display:flex;gap:8px">
          <button type="button" id="dataPrev" class="btn ghost">← ก่อนหน้า</button>
          <button type="button" id="dataNext" class="btn ghost">ถัดไป →</button>
        </div>
      </div>
      <div id="dataEditor" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border-hairline)">
        <h2 id="dataEditorTitle">แก้ไขแถว</h2>
        <p class="hint">แก้ JSON ระดับแถว หรือกด «แก้ไขทั้งไฟล์» เพื่อแก้ทั้งไฟล์แล้วบันทึก (ฟิลด์ password ล็อกไว้เสมอ, _idx/_key ใช้อ้างอิงแถวเท่านั้น)</p>
        <textarea id="dataEditorJson" class="mono" rows="12" spellcheck="false" style="width:100%;background:#090D16;border:1px solid #1E293B;border-radius:8px;color:#E2E8F0;padding:12px;font-size:12px;line-height:1.6;box-sizing:border-box" aria-label="ข้อมูลแถวรูปแบบ JSON"></textarea>
        <div class="row-flex" style="margin-top:12px;gap:8px">
          <button type="button" id="dataEditorSave" class="btn"><?= bl_icon('check') ?>บันทึก</button>
          <button type="button" id="dataEditorCancel" class="btn ghost"><?= bl_icon('x') ?>ยกเลิก</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ เครื่องมือ ═══ -->
  <div class="pane" id="p-tools" role="tabpanel" aria-labelledby="tab-tools">
    <div class="card">
      <h2><?= bl_icon('box') ?>คิวตรวจหนังสือ <span class="soft">(<?= $pendingCount ?> รอตรวจสอบ)</span></h2>
      <p class="hint">เปิดตรวจสอบและอนุมัติรายการที่แท็บรายการลงขาย</p>
      <p><button type="button" class="btn" onclick="document.querySelector('[data-pane=p-listings]').click()"><?= bl_icon('box') ?>ไปที่แท็บรายการลงขาย</button></p>
    </div>

    <div class="card">
      <h2><?= bl_icon('beaker') ?>ทดสอบ Loopback Request (GET/POST)</h2>
      <p class="hint">ส่ง request ทดสอบเข้าเซิร์ฟเวอร์เพื่อยืนยันการรับส่งข้อมูลและการบันทึก log</p>
      <button type="button" id="selfTestBtn" class="btn"><?= bl_icon('play') ?>เริ่มเทส GET + POST</button>
      <div id="selfTestOut" style="margin-top:12px"></div>
    </div>

    <div class="card">
      <h2><?= bl_icon('globe') ?>เว็บแอป Same-Origin <span class="soft">(/app/)</span></h2>
      <div class="check">
        <span>app/index.html <?= $appInfo['htaccess'] ? '+ .htaccess (SPA fallback)' : '(ไม่มี .htaccess)' ?></span>
        <?php if ($appInfo['exists']): ?>
          <span class="pass"><?= bl_icon('check') ?>มีแล้ว (<?= htmlspecialchars($appInfo['size'], ENT_QUOTES, 'UTF-8') ?>)</span>
        <?php else: ?>
          <span class="fail"><?= bl_icon('x') ?>ยังไม่มี</span>
        <?php endif; ?>
      </div>
      <?php if (!$appInfo['exists']): ?>
        <p class="detail">รัน <span class="mono">npm run build:app</span> แล้วคัดลอกไฟล์ลงโฟลเดอร์ <span class="mono">app/</span></p>
      <?php endif; ?>
      <p style="margin-top:10px">
        <a class="btn" href="<?= $BACKEND_BASE ?>/app/"><?= bl_icon('globe') ?>เปิดเว็บแอป (/app/)</a>
        <button type="button" id="appCheckBtn" class="btn ghost"><?= bl_icon('search') ?>เช็ก /app/ ตอบไหม</button>
      </p>
      <pre class="out" id="appCheckOut" style="display:none"></pre>
    </div>

    <div class="card">
      <h2><?= bl_icon('tools') ?>ลิงก์ทดสอบ API</h2>
      <p style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
        <a class="btn" href="<?= $BACKEND_BASE ?>/email/subscribe_form.php"><?= bl_icon('mail') ?>ฟอร์มทดสอบอีเมล</a>
        <a class="btn ghost" href="<?= $BACKEND_BASE ?>/api/auth_me.php"><?= bl_icon('plug') ?>เทส API</a>
      </p>
      <div class="api-link-grid">
        <a class="btn ghost" href="<?= $BASE_URL ?>/?format=json"><?= bl_icon('chart') ?>ดูสถานะแบบ JSON</a>
        <a class="btn ghost" href="<?= $BACKEND_BASE ?>/api/"><?= bl_icon('plug') ?>api/ รายชื่อ endpoint</a>
        <a class="btn ghost" href="<?= $BACKEND_BASE ?>/api/auth_me.php"><?= bl_icon('lock') ?>api/auth_me.php (JSON)</a>
        <a class="btn ghost" href="<?= $BACKEND_BASE ?>/email/subscribe_form.php"><?= bl_icon('mail') ?>ฟอร์ม subscribe ทดสอบ</a>
      </div>
    </div>
  </div>

  <p class="meta">PHP <?= PHP_VERSION ?> · <span id="metaTime"><?= date('Y-m-d H:i:s') ?></span> · <a href="<?= $BASE_URL ?>/?format=json">?format=json</a> · dashboard อ่านอย่างเดียว (Read-Only Telemetry)</p>
</div>
<script>
// Tabs (pure JS — ไม่มี dependency)
(function () {
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) {
        x.classList.remove('active');
        x.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.pane').forEach(function (p) {
        p.classList.remove('active');
      });
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      var pane = document.getElementById(t.getAttribute('data-pane'));
      if (pane) pane.classList.add('active');
    });
  });

  // Endpoint search/filter
  var epSearch = document.getElementById('epSearch');
  var epFilter = document.getElementById('epFilter');
  function filterEp() {
    var q = (epSearch.value || '').toLowerCase().trim();
    var f = epFilter.value;
    var shown = 0;
    document.querySelectorAll('tr[data-ep]').forEach(function (row) {
      var okQ = !q || row.getAttribute('data-ep').indexOf(q) !== -1;
      var auth = row.getAttribute('data-auth') || '';
      var okF = !f || (f === 'lock' ? auth.indexOf('token') !== -1 : auth.indexOf('token') === -1);
      var show = okQ && okF;
      row.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    document.getElementById('epCountLine').textContent = shown + ' endpoints (จากทั้งหมด ' + document.querySelectorAll('tr[data-ep]').length + ')';
  }
  if (epSearch) epSearch.addEventListener('input', filterEp);
  if (epFilter) epFilter.addEventListener('change', filterEp);
})();

// Realtime dashboard: poll ?format=json + api/ โดยไม่ต้องรีเฟรชหน้า
(function () {
  var BASE = <?= json_encode($BASE_URL, JSON_UNESCAPED_SLASHES) ?>;
  var APIBASE = <?= json_encode($BACKEND_BASE . '/api', JSON_UNESCAPED_SLASHES) ?>;
  var FETCH_OPTS = { cache: 'no-store' };
  var badge = document.getElementById('liveBadge');
  var line = document.getElementById('liveLine');
  var everyLabel = document.getElementById('liveEvery');
  var checksBox = document.getElementById('liveChecks');
  var metaTime = document.getElementById('metaTime');
  var apiDot = document.getElementById('apiDot');
  var apiLabel = document.getElementById('apiLabel');
  var apiLatency = document.getElementById('apiLatency');
  var apiDetail = document.getElementById('apiDetail');
  var autoBox = document.getElementById('autoRefresh');
  var secSel = document.getElementById('refreshSec');
  var nowBtn = document.getElementById('refreshNow');
  var reqHint = document.getElementById('reqHint');
  var reqStats = document.getElementById('reqStats');
  var reqBody = document.getElementById('reqBody');
  var reqDetail = document.getElementById('reqDetail');
  var originBox = document.getElementById('originBox');
  var originInput = document.getElementById('originInput');
  var originCheckBtn = document.getElementById('originCheck');
  var originResult = document.getElementById('originResult');
  var selfTestBtn = document.getElementById('selfTestBtn');
  var selfTestOut = document.getElementById('selfTestOut');
  var logLevels = document.getElementById('logLevels');
  var logEvents = document.getElementById('logEvents');
  var tryBtn = document.getElementById('tryBtn');
  var tryEp = document.getElementById('tryEp');
  var tryOut = document.getElementById('tryOut');
  var stGet = document.getElementById('stGet');
  var stPost = document.getElementById('stPost');
  var stErr = document.getElementById('stErr');
  var stRej = document.getElementById('stRej');
  var timer = null;
  var busy = false;
  var SVG_CHECK = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var SVG_X = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var SVG_ALERT = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  function setBadge(ok, realtime) {
    badge.className = 'badge ' + (ok ? 'ok' : 'bad');
    badge.innerHTML = ok
      ? (SVG_CHECK + (realtime ? 'ออนไลน์ (เรียลไทม์)' : 'ออนไลน์'))
      : (SVG_ALERT + 'มีปัญหา — เช็กด้านล่าง');
    document.title = 'BookLoop API — ' + (ok ? 'ออนไลน์' : 'มีปัญหา');
    var heroPulseTag = document.getElementById('heroPulseTag');
    if (heroPulseTag) {
      heroPulseTag.className = 'deck-tag ' + (ok ? 'deck-tag-ok' : 'deck-tag-err');
      heroPulseTag.textContent = ok ? (realtime ? 'ออนไลน์ (สด)' : 'ออนไลน์') : 'มีปัญหา';
    }
  }

  function renderChecks(checks) {
    if (!checks || !checksBox) return;
    var rows = checksBox.querySelectorAll('[data-check]');
    rows.forEach(function (row) {
      var key = row.getAttribute('data-check');
      if (!(key in checks)) return;
      var ok = !!checks[key];
      var st = row.querySelector('[data-role="status"]');
      if (st) {
        st.className = ok ? 'pass' : 'fail';
        st.textContent = ok ? 'ผ่าน' : 'ไม่ผ่าน';
      }
      var next = row.nextElementSibling;
      if (ok && next && next.getAttribute && next.getAttribute('data-role') === 'detail') next.remove();
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function setApi(state, label, latency, detail) {
    apiDot.className = 'dot ' + state;
    apiLabel.textContent = label;
    apiLatency.textContent = latency;
    apiDetail.textContent = detail || '';
    var heroLat = document.getElementById('heroLatency');
    if (heroLat) {
      if (latency && latency.indexOf('ms') !== -1) {
        heroLat.textContent = latency.replace(' ms', '').trim();
      } else {
        heroLat.textContent = latency || '—';
      }
    }
  }

  var METHOD_COLORS = { GET: '#7dd3fc', POST: '#86efac', DELETE: '#fca5a5', PUT: '#fbbf24', OPTIONS: '#94a3b8', HEAD: '#94a3b8' };

  function statusCls(s) {
    if (!s) return 'st-unknown';
    if (s >= 500) return 'st-err';
    if (s >= 400) return 'st-warn';
    return 'st-ok';
  }

  function uaShort(ua) {
    if (!ua) return '';
    if (/curl/i.test(ua)) return 'curl';
    if (/python|urllib|okhttp/i.test(ua)) return 'script';
    if (/bot|spider|crawler|slurp|uptime|monitor|pingdom/i.test(ua)) return 'bot/monitor';
    if (/mozilla/i.test(ua)) return 'browser';
    return ua.slice(0, 20);
  }

  function maskIp(ip) {
    if (!ip) return '—';
    var p = ip.split('.');
    if (p.length === 4) return p[0] + '.' + p[1] + '.' + p[2] + '.xxx';
    return ip.slice(0, 10) + '…';
  }

  function renderRequests(req) {
    if (!req || !reqHint) return;
    reqHint.textContent = req.available
      ? 'บันทึกคำขอล่าสุด เรียงใหม่ → เก่า (ซ่อนท้าย IP เพื่อความเป็นส่วนตัว)'
      : 'ยังอ่าน request.log ไม่ได้ (ต้องมี .env และโฟลเดอร์ data/)';
    var t = req.totals || {};
    var errCount = req.errorCount || 0;
    var rejList = req.rejectedOrigins || [];
    var rejCount = rejList.length;

    if (stGet) stGet.textContent = t.GET || 0;
    if (stPost) stPost.textContent = t.POST || 0;
    if (stErr) {
      stErr.textContent = errCount;
      stErr.className = 'sentry-box-num ' + (errCount > 0 ? 'text-err' : 'text-muted');
      var bErr = document.getElementById('sentryBoxErr');
      if (bErr) bErr.className = 'sentry-box ' + (errCount > 0 ? 'has-err' : '');
    }
    if (stRej) {
      stRej.textContent = rejCount;
      stRej.className = 'sentry-box-num ' + (rejCount > 0 ? 'text-warn' : 'text-muted');
      var bRej = document.getElementById('sentryBoxRej');
      if (bRej) bRej.className = 'sentry-box ' + (rejCount > 0 ? 'has-warn' : '');
    }

    var sentryCard = document.getElementById('heroSentryCard');
    var sentryTag = document.getElementById('sentryStatusTag');
    if (sentryCard && sentryTag) {
      var hasFaults = (errCount > 0 || rejCount > 0);
      sentryCard.className = 'deck-card deck-card-sentry' + (hasFaults ? ' has-alerts' : '');
      sentryTag.className = 'deck-tag ' + (hasFaults ? 'deck-tag-err' : 'deck-tag-ok');
      sentryTag.innerHTML = hasFaults
        ? (SVG_ALERT + ' พบ ' + (errCount + rejCount) + ' ปัญหา')
        : (SVG_CHECK + ' ปลอดภัย 100%');
    }

    var chips = [];
    ['GET', 'POST', 'DELETE', 'OPTIONS', 'OTHER'].forEach(function (m) {
      if (t[m]) chips.push('<span class="chip"><b style="color:' + (METHOD_COLORS[m] || '#e2e8f0') + '">' + m + '</b> × ' + t[m] + '</span>');
    });
    if (req.errorCount) chips.push('<span class="chip" style="border-color:#7f1d1d;color:#fca5a5">ติด 4xx/5xx × ' + req.errorCount + '</span>');
    chips.push('<span class="chip">' + (req.recent || []).length + ' request ล่าสุด</span>');
    reqStats.innerHTML = chips.join('');

    var rows = (req.recent || []).slice(0, 15).map(function (r) {
      var uri = String(r.uri || '');
      if (uri.length > 60) uri = uri.slice(0, 57) + '…';
      var ua = uaShort(r.ua);
      var caller = esc(maskIp(r.ip));
      if (ua) caller += ' <span class="soft">(' + esc(ua) + ')</span>';
      return '<tr>' +
        '<td class="mono" style="white-space:nowrap">' + esc(r.time) + '</td>' +
        '<td class="mono" style="color:' + (METHOD_COLORS[r.method] || '#e2e8f0') + ';font-weight:700;white-space:nowrap">' + esc(r.method) + '</td>' +
        '<td class="path">' + esc(uri) + '</td>' +
        '<td>' + caller + '</td>' +
        '<td class="' + statusCls(r.status) + '">' + (r.status ? r.status : '…') + '</td>' +
        '<td class="mono">' + (r.ms != null ? r.ms : '—') + '</td>' +
        '</tr>';
    });
    reqBody.innerHTML = rows.length
      ? rows.join('')
      : '<tr><td colspan="6" class="soft">ยังไม่มี Request ล่าสุด</td></tr>';

    var warns = req.warnings || [];
    reqDetail.innerHTML = warns.length
      ? '<b>' + SVG_ALERT + ' ' + warns.length + ' เหตุการณ์ล่าสุด (error.log)</b>' + warns.slice(0, 3).map(function (w) {
          return '<br>· <span class="mono">[' + esc(w.time) + ']</span> ' + esc(w.message);
        }).join('')
      : '';
  }

  function renderOrigins(req) {
    if (!req || !originBox) return;
    var list = req.rejectedOrigins || [];
    if (!req.available) {
      originBox.innerHTML = '<span class="soft">ยังอ่าน error.log ไม่ได้ (ต้องมี .env + data/ เขียนได้ก่อน)</span>';
      return;
    }
    if (!list.length) {
      originBox.innerHTML = '<span class="pass">' + SVG_CHECK + 'ไม่มี Origin ถูกปฏิเสธ</span> <span class="soft">— ผ่าน allow-list ทั้งหมด</span>';
      return;
    }
    originBox.innerHTML = list.map(function (o) {
      return '<div class="check"><span class="mono">' + esc(o.origin) + '</span>' +
        '<span class="fail">' + o.count + ' ครั้ง · ล่าสุด ' + esc(o.last) + '</span></div>';
    }).join('') +
      '<p class="detail">Origin เหล่านี้ถูกปฏิเสธเพราะไม่อยู่ใน ALLOWED_ORIGIN ใน .env</p>';
  }

  var LV_COLORS = { DEBUG: '#94a3b8', INFO: '#7dd3fc', WARNING: '#fbbf24', ERROR: '#fca5a5', CRITICAL: '#f87171' };
  function renderLogLevels(j) {
    if (!logLevels) return;
    var c = (j && j.logCounts) || {};
    var order = ['CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'];
    var total = order.reduce(function (a, k) { return a + (c[k] || 0); }, 0);
    if (!total) {
      logLevels.innerHTML = '<p class="hint">ยังไม่มี log ใน 400 บรรทัดท้าย — ระบบปกติ ' + SVG_CHECK + '</p>';
      return;
    }
    logLevels.innerHTML = order.map(function (k) {
      var n = c[k] || 0;
      var pct = Math.round(n / total * 100);
      return '<div class="lvl"><span><b style="color:' + LV_COLORS[k] + '">' + k + '</b> × ' + n + '</span><span class="soft">' + pct + '%</span></div>' +
        '<div class="bar"><div style="width:' + pct + '%;background:' + LV_COLORS[k] + '"></div></div>';
    }).join('') + '<p class="hint" style="margin-top:8px;margin-bottom:0">รวม ' + total + ' บรรทัดท้ายไฟล์</p>';
  }

  function renderLogEvents(req) {
    if (!logEvents) return;
    var warns = (req && req.warnings) || [];
    if (!warns.length) {
      logEvents.innerHTML = '<p class="hint">ไม่มี WARNING/ERROR ล่าสุด ' + SVG_CHECK + '</p>';
      return;
    }
    logEvents.innerHTML = warns.map(function (w) {
      var col = w.level === 'WARNING' ? '#fbbf24' : '#fca5a5';
      return '<div class="lvl"><span><b style="color:' + col + '">[' + esc(w.level) + ']</b> <span class="mono">' + esc(w.time) + '</span><br><span style="color:#cbd5e1">' + esc(w.message) + '</span></span></div>';
    }).join('');
  }

  async function refresh(manual) {
    if (busy) return;
    busy = true;
    var t0 = performance.now();
    try {
      var res = await fetch(BASE + '/?format=json&poll=1', FETCH_OPTS);
      if (res.url && res.url.indexOf('errors.infinityfree.net') !== -1) {
        setBadge(false, true);
        setApi('bad', 'โฮสต์ส่งไปหน้า 404 (ไฟล์บนเซิร์ฟเวอร์ไม่ครบหรือ index.php เก่า)', 'HTTP ' + res.status,
          'อัปโหลดเนื้อใน infinityfree_package/ ทับของเดิมให้ครบ (api/ auth/ config/ Services/ vendor/) แล้วรีเฟรชหน้านี้');
        line.innerHTML = SVG_X + ' โฮสต์ redirect ไปหน้า 404 · อัปโหลดไฟล์ตัวใหม่ทับ แล้วจะลองใหม่ใน ' + secSel.value + ' วินาที';
        return;
      }
      var text = await res.text();
      var data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { console.warn('[BookLoop][dashboard] refresh: non-JSON response', e); data = null; }
      var ms = Math.round(performance.now() - t0);

      if (!data || typeof data.success === 'undefined') {
        setBadge(false, true);
        setApi('bad', 'เชื่อมต่อไม่ได้ — เซิร์ฟเวอร์ตอบกลับไม่ใช่ JSON', ms + ' ms',
          'HTTP ' + res.status + ' — อาจติดหน้า challenge ของโฮสต์ หรือ PHP error (เปิด ?format=json ดูตรงๆ)');
        line.innerHTML = SVG_X + ' ตอบกลับไม่ใช่ JSON (HTTP ' + res.status + ') · ลองใหม่ใน ' + secSel.value + ' วินาที';
      } else {
        setBadge(!!data.success, true);
        renderChecks(data.checks || null);
        renderRequests(data.requests);
        renderOrigins(data.requests);
        renderLogLevels(data);
        renderLogEvents(data.requests);
        var sysHint = '';
        if (!data.success && data.error) {
          sysHint = String(data.error);
          if (sysHint.indexOf('.env') !== -1) {
            sysHint = 'ยังไม่สร้างไฟล์ .env บนเซิร์ฟเวอร์ — ทำตามกล่องสีเหลืองด้านบน (' + sysHint + ')';
          }
        }
        if (data.time && metaTime) {
          try { metaTime.textContent = new Date(data.time).toLocaleString('th-TH'); }
          catch (e) { console.warn('[BookLoop][dashboard] metaTime date parse failed', e); metaTime.textContent = data.time; }
        }
        try {
          var t1 = performance.now();
          var r2 = await fetch(APIBASE + '/', FETCH_OPTS);
          var b2 = await r2.text();
          var j2 = null;
          try { j2 = b2 ? JSON.parse(b2) : null; } catch (e) { console.warn('[BookLoop][dashboard] /api/ non-JSON response', e); j2 = null; }
          var ms2 = Math.round(performance.now() - t1);
          if (r2.url && r2.url.indexOf('errors.infinityfree.net') !== -1) {
            setApi('bad', 'ไฟล์ api/ ยังไม่อยู่บนเซิร์ฟเวอร์ (โฮสต์ส่งไปหน้า 404)', 'HTTP ' + r2.status,
              'อัปโหลดโฟลเดอร์ api/ + auth/ + config/ + Services/ + vendor/ ขึ้น htdocs/ ให้ครบ แล้วสร้างไฟล์ .env');
          } else if (j2 && j2.success === true && typeof j2.count !== 'undefined') {
            setApi('ok', 'เชื่อม API ได้แล้ว — /api/ ตอบกลับเป็น JSON (HTTP ' + r2.status + ', ' + j2.count + ' endpoints)', ms2 + ' ms',
              'เส้นทาง API ใช้งานได้ (endpoint ที่ต้องใช้ token จะตรวจสิทธิ์ตามปกติ)');
          } else {
            setApi('bad', 'API ตอบกลับไม่ใช่ JSON (HTTP ' + r2.status + ')', ms2 + ' ms',
              'อาจติด anti-bot ของโฮสต์ — ลองเปิด /api/ ตรงๆ ในเบราว์เซอร์');
          }
        } catch (e2) {
          setApi('bad', 'เรียก /api/ ไม่สำเร็จ', '—', String((e2 && e2.message) || e2));
        }
        var when = new Date().toLocaleTimeString('th-TH');
        line.innerHTML = SVG_CHECK + ' อัปเดตล่าสุด <b>' + esc(when) + '</b> · ตอบใน <b>' + ms + ' ms</b> · รีเฟรชทุก <b>' + esc(secSel.value) + '</b> วินาที'
          + (sysHint ? '<br>' + SVG_ALERT + ' ' + esc(sysHint) : '');
      }
    } catch (err) {
      setBadge(false, true);
      setApi('bad', 'เชื่อมต่อไม่ได้ — fetch ล้มเหลว', '—', String((err && err.message) || err));
      line.innerHTML = SVG_X + ' เชื่อมต่อไม่ได้ — จะลองใหม่ใน ' + secSel.value + ' วินาที';
    } finally {
      busy = false;
    }
  }

  function restart() {
    if (timer) clearInterval(timer);
    timer = null;
    everyLabel.textContent = secSel.value;
    if (autoBox.checked) timer = setInterval(refresh, parseInt(secSel.value, 10) * 1000);
  }

  autoBox.addEventListener('change', restart);
  secSel.addEventListener('change', function () { restart(); refresh(true); });
  nowBtn.addEventListener('click', function () { refresh(true); });

  originCheckBtn.addEventListener('click', async function () {
    var raw = originInput.value.trim();
    if (!raw) {
      originResult.innerHTML = '<span class="soft">ใส่ origin ก่อน เช่น https://solightzz.github.io</span>';
      return;
    }
    var m = raw.match(/^(https?:\/\/[^/]+)/i);
    var o = m ? m[1] : raw.replace(/\/+$/, '');
    var cutNote = (o !== raw) ? '<br><span class="detail">ตัด path ออกเหลือ ' + esc(o) + ' (เบราว์เซอร์ส่ง Origin แค่ host)</span>' : '';
    originResult.innerHTML = 'กำลังเช็ก…';
    try {
      var r = await fetch(APIBASE + '/index.php?check-origin=' + encodeURIComponent(o), FETCH_OPTS);
      var text = await r.text();
      var j = null;
      try { j = JSON.parse(text); } catch (e) { console.warn('[BookLoop][dashboard] origin-check non-JSON response', e); j = null; }
      if (!j) {
        originResult.innerHTML = '<span class="fail">เซิร์ฟเวอร์ตอบไม่ใช่ JSON (HTTP ' + r.status + ') — อาจติด challenge ของโฮสต์</span>' + cutNote;
        return;
      }
      originResult.innerHTML = (j.allowed
        ? '<span class="pass">' + SVG_CHECK + esc(j.origin) + ' อยู่ใน allow-list — เว็บนี้ยิง POST/GET เข้ามาได้ (ส่วน endpoint ที่ต้องใช้ token ก็ต้องส่ง token ตามปกติ)</span>'
        : '<span class="fail">' + SVG_X + esc(j.origin) + ' โดนบล็อก</span>' + (j.reason ? '<br><span class="detail">' + esc(j.reason) + '</span>' : '')) + cutNote;
    } catch (e) {
      console.warn('[BookLoop][dashboard] origin-check request failed:', (e && e.message) || e);
      originResult.innerHTML = '<span class="fail">เรียกไม่สำเร็จ: ' + esc(String((e && e.message) || e)) + '</span>';
    }
  });

  selfTestBtn.addEventListener('click', async function () {
    selfTestBtn.disabled = true;
    selfTestOut.innerHTML = '<span class="soft">กำลังยิง GET + POST จากเซิร์ฟเวอร์เข้าหาตัวเอง… (นานสุด ~25 วินาที)</span>';
    try {
      var r = await fetch(BASE + '/?selftest=1', FETCH_OPTS);
      var text = await r.text();
      var j = null;
      try { j = JSON.parse(text); } catch (e) { console.warn('[BookLoop][dashboard] selftest non-JSON response', e); j = null; }
      if (!j || !j.results) {
        selfTestOut.innerHTML = '<span class="fail">อ่านผลเทสไม่ได้ — เซิร์ฟเวอร์ตอบไม่ใช่ JSON (HTTP ' + r.status + ')</span>';
        return;
      }
      function testLine(name, x) {
        if (!x) return '<div class="check"><span>' + name + '</span><span class="st-unknown">ไม่ทราบผล</span></div>';
        var head = '<div class="check"><span>' + name + ' <span class="soft">HTTP ' + (x.http || '—') + ' · ' + x.ms + ' ms</span></span>' +
          '<span class="' + (x.ok ? 'pass' : 'fail') + '">' + (x.ok ? 'ถึง PHP จริง ' + SVG_CHECK : 'ไม่ถึง ' + SVG_X) + '</span></div>';
        return head + (x.detail ? '<p class="detail">' + esc(x.detail) + '</p>' : '');
      }
      selfTestOut.innerHTML = testLine('GET', j.results.get) + testLine('POST', j.results.post) +
        '<p class="hint" style="margin-top:8px;margin-bottom:0">' + esc(j.note || '') + '</p>' +
        '<p class="soft" style="margin-top:6px">ดู request ที่เพิ่งยิงได้ในแท็บ Requests (path จะมี selftest_ping=…)</p>';
    } catch (e) {
      console.warn('[BookLoop][dashboard] selftest request failed:', (e && e.message) || e);
      selfTestOut.innerHTML = '<span class="fail">เรียก selftest ไม่สำเร็จ: ' + esc(String((e && e.message) || e)) + '</span>';
    } finally {
      selfTestBtn.disabled = false;
    }
  });

  if (tryBtn) tryBtn.addEventListener('click', async function () {
    tryBtn.disabled = true;
    tryOut.textContent = 'กำลังยิง GET ' + tryEp.value + ' …';
    try {
      var t0 = performance.now();
      var r = await fetch(BASE + tryEp.value, FETCH_OPTS);
      var body = await r.text();
      var ms = Math.round(performance.now() - t0);
      var pretty = body;
      try { pretty = JSON.stringify(JSON.parse(body), null, 2); } catch (e) { console.debug('[BookLoop][dashboard] try-endpoint non-JSON, showing raw', e); /* HTML/error — โชว์ดิบ */ }
      if (pretty.length > 4000) pretty = pretty.slice(0, 4000) + '\n… (ตัดเหลือ 4000 ตัวอักษร)';
      tryOut.textContent = 'HTTP ' + r.status + ' · ' + ms + ' ms\n' + pretty;
    } catch (e) {
      console.warn('[BookLoop][dashboard] try-endpoint request failed:', (e && e.message) || e);
      tryOut.textContent = 'ยิงไม่สำเร็จ: ' + String((e && e.message) || e);
    } finally {
      tryBtn.disabled = false;
    }
  });

  // เช็กเว็บแอป same-origin: GET /app/ แล้วดูว่าได้ HTML ของแอปจริงไหม (อ่านอย่างเดียว)
  var appCheckBtn = document.getElementById('appCheckBtn');
  var appCheckOut = document.getElementById('appCheckOut');
  if (appCheckBtn) appCheckBtn.addEventListener('click', async function () {
    appCheckBtn.disabled = true;
    appCheckOut.style.display = 'block';
    appCheckOut.textContent = 'กำลังเรียก GET /app/ …';
    try {
      var t0 = performance.now();
      var r = await fetch(BASE + '/app/', FETCH_OPTS);
      var body = await r.text();
      var ms = Math.round(performance.now() - t0);
      var ct = r.headers.get('content-type') || '—';
      var lines = [];
      lines.push('HTTP ' + r.status + ' · ' + ms + ' ms · ' + body.length + ' bytes');
      lines.push('Content-Type: ' + ct);
      if (r.url && r.url.indexOf('errors.infinityfree.net') !== -1) {
        lines.push('[404] โฮสต์ redirect ไปหน้า 404 — ยังไม่มีโฟลเดอร์ app/ บนเซิร์ฟเวอร์ (รัน npm run build:app แล้วอัปโหลด)');
      } else if (r.status === 200 && /<div id="root"|__BOOKLOOP__|vite|src="\/app\/assets\//i.test(body)) {
        lines.push('[OK] เจอหน้าเว็บแอปแล้ว — เปิด /app/ ใช้งานได้ (โดเมนเดียวกับ API ไม่ติด CORS)');
      } else if (r.status === 200) {
        lines.push('[WARN] ได้ HTTP 200 แต่เนื้อหาไม่ใช่หน้าแอปที่คุ้น — ลองเปิด /app/ ตรงๆ ในเบราว์เซอร์ดู');
      } else {
        lines.push('[ERR] /app/ ตอบ HTTP ' + r.status + ' — ตรวจว่าโฟลเดอร์ app/ + index.html อยู่บน htdocs/ ครบไหม');
      }
      appCheckOut.textContent = lines.join('\n');
    } catch (e) {
      console.warn('[BookLoop][dashboard] /app/ check request failed:', (e && e.message) || e);
      appCheckOut.textContent = 'เรียกไม่สำเร็จ: ' + String((e && e.message) || e);
    } finally {
      appCheckBtn.disabled = false;
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (timer) clearInterval(timer); timer = null; }
    else { restart(); refresh(true); }
  });

  restart();
  refresh(true);
})();

// ─── Listings Moderation Handler ───
(function () {
  var BASE = <?= json_encode($BASE_URL, JSON_UNESCAPED_SLASHES) ?>;
  var APIBASE = <?= json_encode($BACKEND_BASE . '/api', JSON_UNESCAPED_SLASHES) ?>;
  var listingsBody = document.getElementById('listingsBody');
  var listingsOut = document.getElementById('listingsOut');
  var listingsReload = document.getElementById('listingsReload');
  var listingsBadge = document.getElementById('listingsPendingBadge');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var SVG_CHECK = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var SVG_X = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var SVG_PAUSE = '<svg class="bl-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  var SVG_PLAY = '<svg class="bl-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
  var SVG_TRASH = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
  var SVG_CLOCK = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  var SVG_BOX = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>';
  var SVG_BOOK = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>';
  var SVG_INFO = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  var SVG_REFRESH = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>';
  var SVG_EYE = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var SVG_EYE_OFF = '<svg class="bl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';

  function statusBadge(status) {
    if (status === 'pending') return '<span class="st-warn">' + SVG_CLOCK + 'รอตรวจสอบ</span>';
    if (status === 'active') return '<span class="pass">' + SVG_CHECK + 'วางขาย</span>';
    if (status === 'paused') return '<span class="st-warn" style="color:#f59e0b">' + SVG_PAUSE + 'พักการขาย</span>';
    if (status === 'rejected') return '<span class="fail">' + SVG_X + 'ปฏิเสธ</span>';
    if (status === 'sold') return '<span class="soft">' + SVG_BOX + 'ขายแล้ว</span>';
    if (status === 'archived') return '<span class="soft" style="color:#94a3b8">' + SVG_TRASH + 'เก็บถาวร</span>';
    return '<span class="soft">' + esc(status) + '</span>';
  }

  function conditionBadge(cond) {
    if (!cond) return '';
    var c = String(cond).trim().toLowerCase();
    var map = {
      'mint': ['เหมือนใหม่', '#052e16', '#86efac'],
      'like_new': ['เหมือนใหม่', '#052e16', '#86efac'],
      'เหมือนใหม่': ['เหมือนใหม่', '#052e16', '#86efac'],
      'very_good': ['ดีมาก', '#082f49', '#7dd3fc'],
      'ดีมาก': ['ดีมาก', '#082f49', '#7dd3fc'],
      'good': ['ดี', '#451a03', '#fde68a'],
      'ดี': ['ดี', '#451a03', '#fde68a'],
      'fair': ['พอใช้', '#431407', '#fdba74'],
      'พอใช้': ['พอใช้', '#431407', '#fdba74'],
      'acceptable': ['พอใช้', '#431407', '#fdba74']
    };
    var target = map[c] || [cond, '#1e293b', '#cbd5e1'];
    return '<span class="cond-badge" style="background:' + target[1] + ';color:' + target[2] + '">' + esc(target[0]) + '</span>';
  }

  function bookCover(img, title) {
    var t = esc(title);
    if (img) {
      return '<div class="book-cover-cell"><img src="' + esc(img) + '" alt="' + t + '" class="book-thumb" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';"><div class="book-thumb-fallback" style="display:none">' + SVG_BOOK + '</div></div>';
    }
    return '<div class="book-cover-cell"><div class="book-thumb-fallback">' + SVG_BOOK + '</div></div>';
  }

  function actionBtns(id, status, title) {
    var escId = esc(id);
    var t = esc(title || '');
    var out = '<div class="mod-btn-group" role="group" aria-label="จัดการ ' + t + '">';
    if (status === 'pending') {
      out += '<button type="button" class="btn btn-sm" data-mod="approve" data-id="' + escId + '" aria-label="อนุมัติ ' + t + '">' + SVG_CHECK + 'อนุมัติ</button>';
      out += '<button type="button" class="btn btn-sm ghost" data-mod="reject" data-id="' + escId + '" aria-label="ปฏิเสธ ' + t + '">' + SVG_X + 'ปฏิเสธ</button>';
    } else if (status === 'active') {
      out += '<button type="button" class="btn btn-sm ghost btn-warn" data-mod="pause" data-id="' + escId + '" aria-label="หยุดขาย ' + t + '">' + SVG_PAUSE + 'หยุดขาย</button>';
    } else if (status === 'paused') {
      out += '<button type="button" class="btn btn-sm data-mod="resume" data-id="' + escId + '" aria-label="เริ่มขายใหม่ ' + t + '">' + SVG_PLAY + 'เริ่มขายใหม่</button>';
    } else if (status === 'archived' || status === 'rejected') {
      out += '<button type="button" class="btn btn-sm ghost" data-mod="resume" data-id="' + escId + '" aria-label="กู้คืนรายการ ' + t + '">' + SVG_REFRESH + 'กู้คืน</button>';
    }
    if (status !== 'archived') {
      out += '<button type="button" class="btn btn-sm ghost btn-danger" data-mod="archive" data-id="' + escId + '" aria-label="เก็บถาวร ' + t + '">' + SVG_TRASH + 'เก็บถาวร</button>';
    } else {
      out += '<button type="button" class="btn btn-sm ghost btn-danger" data-mod="delete_permanent" data-id="' + escId + '" aria-label="ลบถาวร ' + t + '">' + SVG_TRASH + 'ลบถาวร</button>';
    }
    out += '</div>';
    return out;
  }

  function renderListings(items) {
    if (!listingsBody) return;
    if (!items || !items.length) {
      listingsBody.innerHTML = '<tr><td colspan="6" class="soft" style="text-align:center;padding:24px">ยังไม่มีรายการลงขาย — ลงขายผ่านหน้า /sell แล้วรายการจะโผล่ที่นี่</td></tr>';
      if (listingsBadge) listingsBadge.textContent = '(0 รอตรวจสอบ)';
      return;
    }
    var pendingN = 0;
    listingsBody.innerHTML = items.map(function (l) {
      var id = l.id || '';
      var title = l.title || '—';
      var author = l.author || '';
      var cat = l.category || '';
      var cond = l.condition || '';
      var img = l.image || '';
      var story = l.story || '';
      var defects = l.defects || '';
      var price = '฿' + (l.price != null ? Number(l.price).toLocaleString('th-TH', { maximumFractionDigits: 0 }) : '—');
      var origPrice = (l.originalPrice != null && Number(l.originalPrice) > Number(l.price))
        ? '<div class="soft" style="text-decoration:line-through;font-size:11px">฿' + Number(l.originalPrice).toLocaleString('th-TH', { maximumFractionDigits: 0 }) + '</div>'
        : '';
      var status = l.status || 'active';
      if (status === 'pending') pendingN++;
      var createdAt = String(l.createdAt || '').slice(0, 16);

      var storyHtml = '';
      if (story || defects) {
        storyHtml = '<button type="button" class="story-toggle" data-toggle-story="' + esc(id) + '">' + SVG_INFO + 'ดูเรื่องราว/ตำหนิ</button>' +
          '<div class="story-box" id="story-' + esc(id) + '" style="display:none">' +
          (story ? '<div><b>เรื่องราว:</b> ' + esc(story) + '</div>' : '') +
          (defects ? '<div style="margin-top:4px"><b>ตำหนิ:</b> ' + esc(defects) + '</div>' : '') +
          '</div>';
      }

      return '<tr data-lid="' + esc(id) + '">' +
        '<td style="text-align:center">' + bookCover(img, title) + '</td>' +
        '<td>' +
          '<div style="font-weight:600">' + esc(title) + '</div>' +
          '<div style="margin-top:3px;display:flex;align-items:center;gap:4px;flex-wrap:wrap">' +
            (author ? '<span class="soft">' + esc(author) + '</span>' : '') +
            conditionBadge(cond) +
            (cat ? '<span class="category-pill">' + esc(cat) + '</span>' : '') +
          '</div>' +
          storyHtml +
          '<div class="mono soft" style="font-size:10px;margin-top:4px">ID: ' + esc(id) + '</div>' +
        '</td>' +
        '<td class="mono"><b>' + esc(price) + '</b>' + origPrice + '</td>' +
        '<td class="listing-status">' + statusBadge(status) + '</td>' +
        '<td class="mono" style="white-space:nowrap;font-size:11px">' + esc(createdAt) + '</td>' +
        '<td style="white-space:nowrap" class="listing-actions">' + actionBtns(id, status, title) + '</td>' +
        '</tr>';
    }).join('');
    if (listingsBadge) listingsBadge.textContent = '(' + pendingN + ' รอตรวจสอบ)';
    // อัปเดต badge บน tab ด้วย
    var tab = document.querySelector('[data-pane="p-listings"]');
    if (tab) {
      var badge = tab.querySelector('.tab-badge, span[style*="b45309"]');
      if (pendingN > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'tab-badge';
          tab.appendChild(badge);
        }
        badge.textContent = pendingN + ' รอ';
      } else if (badge) {
        badge.remove();
      }
    }
  }

  // เข้าสู่ระบบผู้ดูแลด้วยรหัส ADMIN_TOKEN (เก็บใน session นี้เท่านั้น ไม่ฝัง cookie)
  function adminToken() {
    try { return sessionStorage.getItem('bookloop_admin_token') || ''; } catch (e) { return ''; }
  }
  function setAdminToken(t) {
    try {
      if (t) sessionStorage.setItem('bookloop_admin_token', t);
      else sessionStorage.removeItem('bookloop_admin_token');
    } catch (e) {}
    refreshAdminBar();
  }
  function refreshAdminBar() {
    var logged = adminToken() !== '';
    var loginBar = document.getElementById('adminLoginBar');
    if (!loginBar) return;
    var pass = document.getElementById('adminPass');
    var passToggle = document.getElementById('adminPassToggle');
    var inBtn = document.getElementById('adminLoginBtn');
    var outBtn = document.getElementById('adminLogoutBtn');
    var state = document.getElementById('adminLoginState');
    if (pass) { pass.value = ''; pass.style.display = logged ? 'none' : ''; }
    if (passToggle) { passToggle.style.display = logged ? 'none' : ''; }
    if (inBtn) inBtn.style.display = logged ? 'none' : '';
    if (outBtn) outBtn.style.display = logged ? '' : 'none';
    if (state) state.textContent = logged ? 'เข้าสู่ระบบผู้ดูแลแล้ว' : 'ยังไม่ได้เข้าสู่ระบบ';
  }
  function adminHeaders() {
    return { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken() };
  }
  function handleAdminAuthFail() {
    setAdminToken('');
    showOut('รหัสผู้ดูแลไม่ถูกต้องหรือหมดสิทธิ์ กรุณากรอกรหัสใหม่', false);
    var pass = document.getElementById('adminPass');
    if (pass) pass.focus();
  }
  (function wireAdminBar() {
    var inBtn = document.getElementById('adminLoginBtn');
    var outBtn = document.getElementById('adminLogoutBtn');
    var pass = document.getElementById('adminPass');
    var passToggle = document.getElementById('adminPassToggle');

    if (passToggle && pass) {
      passToggle.addEventListener('click', function () {
        var isPwd = pass.getAttribute('type') === 'password';
        pass.setAttribute('type', isPwd ? 'text' : 'password');
        passToggle.innerHTML = isPwd ? SVG_EYE_OFF : SVG_EYE;
      });
    }

    function doLogin() {
      if (!pass || !pass.value) { showOut('กรุณากรอกรหัสผู้ดูแลก่อน', false); return; }
      setAdminToken(pass.value);
      reloadListings();
    }
    if (inBtn) inBtn.addEventListener('click', doLogin);
    var loginForm = document.getElementById('adminLoginBar');
    if (loginForm && loginForm.tagName === 'FORM') loginForm.addEventListener('submit', function (e) { e.preventDefault(); doLogin(); });
    if (outBtn) outBtn.addEventListener('click', function () {
      setAdminToken('');
      if (listingsBody) listingsBody.innerHTML = '<tr><td colspan="6" class="soft" style="text-align:center;padding:24px">ออกจากระบบแล้ว — เข้าสู่ระบบผู้ดูแลเพื่อดูรายการ</td></tr>';
      showOut('ออกจากระบบผู้ดูแลแล้ว', true);
    });
    refreshAdminBar();
  })();

  // Accordion delegation for story/defects toggle
  if (listingsBody) {
    listingsBody.addEventListener('click', function (e) {
      var stBtn = e.target.closest('[data-toggle-story]');
      if (!stBtn) return;
      var lid = stBtn.getAttribute('data-toggle-story');
      var box = document.getElementById('story-' + lid);
      if (box) {
        var isOpen = box.style.display !== 'none';
        box.style.display = isOpen ? 'none' : 'block';
        stBtn.innerHTML = isOpen ? (SVG_INFO + 'ดูเรื่องราว/ตำหนิ') : (SVG_INFO + 'ซ่อนเรื่องราว/ตำหนิ');
      }
    });
  }

  async function reloadListings() {
    if (!listingsBody) return;
    if (!adminToken()) {
      listingsBody.innerHTML = '<tr><td colspan="6" class="soft" style="text-align:center;padding:24px">กรุณาเข้าสู่ระบบผู้ดูแลก่อนดูรายการ</td></tr>';
      return;
    }
    listingsBody.innerHTML = '<tr><td colspan="6" class="soft" style="text-align:center;padding:24px">กำลังโหลด…</td></tr>';
    try {
      var url = BASE + '/?all_listings=1';
      var r = await fetch(url, { cache: 'no-store', headers: adminHeaders() });
      var j = null;
      try { j = JSON.parse(await r.text()); } catch (e) { console.warn('[BookLoop][dashboard] reloadListings non-JSON response', e); j = null; }
      if (r.status === 403) { handleAdminAuthFail(); return; }
      if (j && j.success && Array.isArray(j.items)) {
        renderListings(j.items);
        var pendingC = j.items.filter(function(x){ return x.status === 'pending'; }).length;
        showOut('โหลด ' + j.items.length + ' รายการ (รอตรวจสอบ: ' + pendingC + ')', true);
      } else if (j && !j.success) {
        showOut((j.message || 'โหลดไม่ได้') + ' (HTTP ' + r.status + ')', false);
        listingsBody.innerHTML = '<tr><td colspan="6" class="soft" style="text-align:center;padding:24px">' + esc(j && j.message ? j.message : 'โหลดไม่ได้') + '</td></tr>';
      } else {
        showOut('เซิร์ฟเวอร์ตอบผิดรูปแบบ (HTTP ' + r.status + ')', false);
      }
    } catch (e) {
      showOut('เรียก API ไม่สำเร็จ: ' + String((e && e.message) || e), false);
    }
  }

  function showOut(msg, ok) {
    var toast = document.getElementById('modToast');
    if (toast) {
      toast.className = 'mod-toast ' + (ok ? 'ok' : 'err');
      toast.innerHTML = (ok ? SVG_CHECK : SVG_X) + ' ' + esc(msg);
      toast.style.display = 'flex';
      setTimeout(function () {
        if (toast && toast.style.display === 'flex') {
          toast.style.display = 'none';
        }
      }, 6000);
    }
    if (listingsOut) {
      listingsOut.style.display = 'block';
      listingsOut.innerHTML = (ok ? SVG_CHECK : SVG_X) + ' ' + esc(msg);
      listingsOut.style.color = ok ? '#86efac' : '#fbbf24';
    }
  }

  // Reload button
  if (listingsReload) {
    listingsReload.addEventListener('click', function () { reloadListings(); });
  }

  // Delegate: จัดการอนุมัติ / หยุดขาย / เริ่มขายใหม่ / เก็บถาวร / ลบถาวร
  function attachModerationHandlers(tbody) {
    if (!tbody) return;
    tbody.addEventListener('click', async function (e) {
      var btn = e.target.closest('[data-mod]');
      if (!btn) return;
      var action = btn.getAttribute('data-mod');
      var id = btn.getAttribute('data-id');
      if (!id || !['approve', 'reject', 'pause', 'resume', 'archive', 'delete', 'delete_permanent'].includes(action)) return;

      var labels = {
        'approve': 'อนุมัติ',
        'reject': 'ปฏิเสธ',
        'pause': 'หยุดขาย',
        'resume': 'เริ่มขายใหม่ / กู้คืน',
        'archive': 'เก็บถาวร',
        'delete': 'เก็บถาวร',
        'delete_permanent': 'ลบถาวร'
      };
      var label = labels[action] || action;
      var confirmMsg = action === 'delete_permanent'
        ? 'คำเตือน: ยืนยันลบรายการและไฟล์รูปภาพนี้ถาวรจริงหรือไม่? (ID: ' + id.slice(0, 12) + '…)\nการกระทำนี้ไม่สามารถย้อนกลับได้!'
        : (action === 'archive' || action === 'delete'
          ? 'ยืนยันย้ายรายการนี้ไปเก็บถาวร? (ข้อมูลและรูปภาพยังคงอยู่ สามารถกู้คืนได้ภายหลัง)'
          : 'ยืนยัน' + label + 'รายการนี้ (ID: ' + id.slice(0, 12) + '…)?');

      if (!confirm(confirmMsg)) return;

      if (!adminToken()) { showOut('กรุณาเข้าสู่ระบบผู้ดูแลก่อน', false); return; }

      btn.disabled = true;
      var row = btn.closest('tr');
      if (row) {
        var actCell = row.querySelector('.listing-actions');
        if (actCell) actCell.innerHTML = '<span class="soft">กำลัง' + label + '…</span>';
      }

      try {
        // ยิงเข้า index.php โดยตรง (?moderate_listing=1) พร้อม X-Admin-Token
        var modUrl = BASE + '/?moderate_listing=1';
        var r = await fetch(modUrl, {
          method: 'POST',
          cache: 'no-store',
          headers: adminHeaders(),
          body: JSON.stringify({ id: id, action: action })
        });
        var j = null;
        try { j = JSON.parse(await r.text()); } catch (ex) { console.warn('[BookLoop][dashboard] moderate primary non-JSON response', ex); j = null; }

        if (r.status === 403) { handleAdminAuthFail(); btn.disabled = false; return; }

        if (!j || !j.success) {
          // Fallback ไปที่ api/listings_moderate.php (ต้องใช้ ADMIN_TOKEN เดียวกัน)
          try {
            var r2 = await fetch(APIBASE + '/listings_moderate.php', {
              method: 'POST',
              cache: 'no-store',
              headers: adminHeaders(),
              body: JSON.stringify({ id: id, action: action })
            });
            var j2 = JSON.parse(await r2.text());
            if (j2 && j2.success) { j = j2; r = r2; }
          } catch (e2) {
            console.warn('[BookLoop][dashboard] listings_moderate fallback failed:', (e2 && e2.message) || e2);
            showOut('ช่องทางสำรองไม่สำเร็จ: ' + String((e2 && e2.message) || e2), false);
          }
        }

        if (j && j.success) {
          if (action === 'delete_permanent') {
            if (row) row.remove();
            showOut('ลบรายการและไฟล์รูปภาพถาวรเรียบร้อยแล้ว (ID: ' + id.slice(0, 12) + '…)', true);
          } else {
            var newStatus = j.status || (action === 'approve' || action === 'resume' ? 'active' : (action === 'pause' ? 'paused' : (action === 'archive' || action === 'delete' ? 'archived' : 'rejected')));
            if (row) {
              var stCell = row.querySelector('.listing-status');
              if (stCell) stCell.innerHTML = statusBadge(newStatus);
              var aCell = row.querySelector('.listing-actions');
              var titleEl = row.querySelector('td:nth-child(2) div:first-child');
              var rowTitle = titleEl ? titleEl.textContent : '';
              if (aCell) aCell.innerHTML = actionBtns(id, newStatus, rowTitle);
            }
            showOut((j.message || label + 'แล้ว') + ' (ID: ' + id.slice(0, 12) + '…)', true);
          }

          // นับ pending ใหม่ + อัปเดต badge
          var allRows = document.querySelectorAll('#listingsBody tr[data-lid]');
          var pc = 0;
          allRows.forEach(function (tr) {
            var st = tr.querySelector('.listing-status');
            if (st && st.querySelector('.st-warn') && !st.textContent.includes('พักการขาย')) pc++;
          });
          if (listingsBadge) listingsBadge.textContent = '(' + pc + ' รอตรวจสอบ)';
          var tab = document.querySelector('[data-pane="p-listings"]');
          if (tab) {
            var badge = tab.querySelector('.tab-badge, span[style*="b45309"]');
            if (pc > 0) {
              if (!badge) {
                badge = document.createElement('span');
                badge.className = 'tab-badge';
                tab.appendChild(badge);
              }
              badge.textContent = pc + ' รอ';
            } else if (badge) {
              badge.remove();
            }
          }
        } else {
          var msg = (j && j.message) ? j.message : 'HTTP ' + r.status;
          showOut(label + 'ไม่สำเร็จ: ' + msg, false);
          if (row) {
            var aCell2 = row.querySelector('.listing-actions');
            if (aCell2) {
              var isPending = row.querySelector('.listing-status') && row.querySelector('.listing-status').textContent.includes('รอตรวจสอบ');
              var tEl = row.querySelector('td:nth-child(2) div:first-child');
              var rTitle = tEl ? tEl.textContent : '';
              aCell2.innerHTML = actionBtns(id, isPending ? 'pending' : 'active', rTitle);
            }
          }
          btn.disabled = false;
        }
      } catch (e) {
        showOut('เรียก API ไม่สำเร็จ: ' + String((e && e.message) || e), false);
        if (btn) btn.disabled = false;
      }
    });
  }

  attachModerationHandlers(listingsBody);
})();

// ═══ Data explorer (data/) — ตาราง + ค้นหา + เพจ + เพิ่ม/แก้/ลบแถว ═══
(function () {
  var BASE = <?= json_encode($BASE_URL, JSON_UNESCAPED_SLASHES) ?>;
  var PAGE_SIZE = 20;
  var st = { files: [], file: '', kind: '', writable: false, cols: [], rows: [], page: 0, q: '', editKey: null, editAction: 'update', editMode: 'row' };
  function $(id) { return document.getElementById(id); }
  // auth helpers ของแท็บนี้โดยเฉพาะ (อ่าน sessionStorage คีย์เดียวกับแท็บรายการลงขาย
  // แต่ไม่พึ่งฟังก์ชันใน IIFE อื่น — กัน ReferenceError เรื่องลำดับสคริปต์)
  function dAdminToken() {
    try { return sessionStorage.getItem('bookloop_admin_token') || ''; } catch (e) { return ''; }
  }
  function dSetAdminToken(t) {
    try {
      if (t) sessionStorage.setItem('bookloop_admin_token', t);
      else sessionStorage.removeItem('bookloop_admin_token');
    } catch (e) {}
    syncDataLoginBar();
  }
  function dAdminHeaders() {
    return { 'X-Admin-Token': dAdminToken() };
  }
  function dHandleAuthFail() {
    dSetAdminToken('');
    toast('รหัสผู้ดูแลไม่ถูกต้อง', false);
  }
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function toast(msg, ok) {
    var t = $('dataToast');
    if (!t) return;
    t.className = 'mod-toast ' + (ok ? 'ok' : 'err');
    t.textContent = msg;
    t.style.display = 'flex';
    setTimeout(function () { if (t) t.style.display = 'none'; }, 5000);
  }
  function fmtCell(v) {
    if (v === null || v === undefined) return '<span class="soft">—</span>';
    if (typeof v === 'object') {
      var s = JSON.stringify(v);
      if (s.length > 80) s = s.slice(0, 80) + '…';
      return '<span class="mono" style="font-size:11px">' + esc(s) + '</span>';
    }
    var str = String(v);
    if (str.length > 80) str = str.slice(0, 80) + '…';
    return '<span class="mono" style="font-size:11px">' + esc(str) + '</span>';
  }
  function rowKey(r) {
    if (r._key !== undefined) return String(r._key);
    if (r.id !== undefined) return String(r.id);
    return String(r._idx);
  }
  async function api(path, opts) {
    var r = await fetch(BASE + path, opts || { cache: 'no-store', headers: dAdminHeaders() });
    var j = null;
    try { j = JSON.parse(await r.text()); } catch (e) { j = null; }
    if (r.status === 403) { dHandleAuthFail(); }
    return { status: r.status, json: j };
  }
  function syncDataLoginBar() {
    var logged = dAdminToken() !== '';
    var p = $('dataAdminPass'), ib = $('dataAdminLoginBtn'), ob = $('dataAdminLogoutBtn'), s = $('dataAdminLoginState');
    if (p) p.style.display = logged ? 'none' : '';
    var pt = $('dataAdminPassToggle');
    if (pt) pt.style.display = logged ? 'none' : '';
    if (ib) ib.style.display = logged ? 'none' : '';
    if (ob) ob.style.display = logged ? '' : 'none';
    if (s) s.textContent = logged ? 'เข้าสู่ระบบแล้ว' : 'ยังไม่ได้เข้าสู่ระบบ';
  }
  async function loadFiles() {
    if (!dAdminToken()) {
      $('dataBody').innerHTML = '<tr><td class="soft" style="text-align:center;padding:24px">กรุณาเข้าสู่ระบบผู้ดูแลก่อนดูข้อมูล</td></tr>';
      return;
    }
    var res = await api('/?data_files=1');
    var j = res.json;
    if (!j || !j.success || !Array.isArray(j.files)) {
      toast((j && j.message) || ('โหลดรายชื่อไฟล์ไม่ได้ (HTTP ' + res.status + ')'), false);
      return;
    }
    st.files = j.files;
    var sel = $('dataFileSel');
    var cur = sel.value;
    sel.innerHTML = '<option value="">— เลือกไฟล์ (' + j.files.length + ') —</option>' + j.files.map(function (f) {
      var tag = f.writable ? (f.kind + ' · ' + f.rows + ' แถว') : 'อ่านอย่างเดียว · ' + f.rows + ' บรรทัด';
      return '<option value="' + esc(f.name) + '">' + esc(f.name) + ' — ' + esc(tag) + '</option>';
    }).join('');
    if (cur && j.files.some(function (f) { return f.name === cur; })) sel.value = cur;
    var m = $('dataFileMeta');
    if (m) m.textContent = '(' + j.files.length + ' ไฟล์)';
  }
  async function loadRows() {
    var f = $('dataFileSel').value;
    if (!f) {
      $('dataBody').innerHTML = '<tr><td class="soft" style="text-align:center;padding:24px">เลือกไฟล์ก่อน</td></tr>';
      return;
    }
    if (!dAdminToken()) {
      $('dataBody').innerHTML = '<tr><td class="soft" style="text-align:center;padding:24px">กรุณาเข้าสู่ระบบผู้ดูแลก่อนดูข้อมูล</td></tr>';
      return;
    }
    $('dataBody').innerHTML = '<tr><td class="soft" style="text-align:center;padding:24px">กำลังโหลด…</td></tr>';
    var res = await api('/?data_rows=1&file=' + encodeURIComponent(f));
    var j = res.json;
    if (!j || !j.success) {
      $('dataBody').innerHTML = '<tr><td class="soft" style="text-align:center;padding:24px">' + esc((j && j.message) || 'โหลดไม่ได้') + '</td></tr>';
      toast((j && j.message) || 'โหลดไม่ได้', false);
      return;
    }
    st.file = f;
    st.kind = j.kind;
    st.writable = !!j.writable;
    st.cols = Array.isArray(j.columns) ? j.columns : [];
    st.rows = Array.isArray(j.rows) ? j.rows : [];
    st.page = 0;
    hideEditor();
    renderTable();
    var addBtn = $('dataAddRow');
    if (addBtn) addBtn.style.display = st.writable ? '' : 'none';
    var fileBtn = $('dataEditFile');
    if (fileBtn) fileBtn.style.display = st.writable ? '' : 'none';
  }
  function filteredRows() {
    var q = st.q.trim().toLowerCase();
    if (!q) return st.rows;
    return st.rows.filter(function (r) {
      return JSON.stringify(r).toLowerCase().indexOf(q) !== -1;
    });
  }
  function renderTable() {
    var head = $('dataHead'), body = $('dataBody');
    var cols = st.cols.length ? st.cols : ['line'];
    var nCols = cols.length + (st.writable ? 1 : 0);
    head.innerHTML = '<tr><th scope="col" style="width:44px;text-align:center">#</th>' +
      cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') +
      (st.writable ? '<th scope="col" style="width:120px">จัดการ</th>' : '') + '</tr>';
    var rows = filteredRows();
    var pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if (st.page >= pages) st.page = pages - 1;
    var slice = rows.slice(st.page * PAGE_SIZE, st.page * PAGE_SIZE + PAGE_SIZE);
    if (!slice.length) {
      body.innerHTML = '<tr><td colspan="' + nCols + '" class="soft" style="text-align:center;padding:24px">ไม่มีแถว' + (st.q ? 'ตรงคำค้น' : 'ในไฟล์นี้') + '</td></tr>';
    } else {
      body.innerHTML = slice.map(function (r, i) {
        var key = rowKey(r);
        var tds = cols.map(function (c) {
          if (c === 'password') return '<td class="mono soft">•••</td>';
          return '<td>' + fmtCell(r[c]) + '</td>';
        }).join('');
        var act = st.writable
          ? '<td style="white-space:nowrap"><button type="button" class="btn ghost" data-dedit="' + esc(key) + '">แก้ไข</button> <button type="button" class="btn ghost" data-ddel="' + esc(key) + '">ลบ</button></td>'
          : '';
        return '<tr data-dkey="' + esc(key) + '"><td class="mono soft" style="text-align:center">' + (st.page * PAGE_SIZE + i + 1) + '</td>' + tds + act + '</tr>';
      }).join('');
    }
    $('dataPageInfo').textContent = 'หน้า ' + (st.page + 1) + '/' + pages + ' · ' + rows.length + '/' + st.rows.length + ' แถว';
    var c = $('dataCount');
    if (c) c.textContent = st.file + ' · ' + st.kind + (st.writable ? '' : ' · อ่านอย่างเดียว');
  }
  function showEditor(title, obj) {
    st.editMode = 'row';
    st.editAction = title === 'create' ? 'create' : 'update';
    $('dataEditorTitle').textContent = title === 'create' ? 'เพิ่มแถวใหม่ใน ' + st.file : 'แก้ไขแถวใน ' + st.file;
    $('dataEditorJson').value = JSON.stringify(obj, null, 2);
    $('dataEditor').style.display = 'block';
    $('dataEditor').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hideEditor() {
    st.editKey = null;
    st.editMode = 'row';
    var e = $('dataEditor');
    if (e) e.style.display = 'none';
  }
  async function saveEditor() {
    if (st.editMode === 'file') {
      var rawText = $('dataEditorJson').value;
      try { JSON.parse(rawText); } catch (e) {
        toast('JSON ไม่ถูกต้อง: ' + String((e && e.message) || e), false);
        return;
      }
      var fres = await api('/?data_file=1', {
        method: 'POST',
        cache: 'no-store',
        headers: (function (h) { h['Content-Type'] = 'application/json'; return h; })(dAdminHeaders()),
        body: JSON.stringify({ file: st.file, content: rawText })
      });
      var fj = fres.json;
      if (fj && fj.success) {
        toast(fj.message || 'บันทึกแล้ว', true);
        hideEditor();
        await loadFiles();
        var fsel = $('dataFileSel');
        if (fsel) fsel.value = st.file;
        await loadRows();
      } else {
        toast((fj && fj.message) || ('บันทึกไม่ได้ (HTTP ' + fres.status + ')'), false);
      }
      return;
    }
    var parsed;
    try {
      parsed = JSON.parse($('dataEditorJson').value);
    } catch (e) {
      toast('JSON ไม่ถูกต้อง: ' + String((e && e.message) || e), false);
      return;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      toast('row ต้องเป็น object', false);
      return;
    }
    var key = st.editKey;
    if (st.kind === 'map' && parsed._key !== undefined && String(parsed._key) !== '') {
      key = String(parsed._key);
    }
    var payload = { file: st.file, action: st.editAction, key: key, row: parsed };
    var res = await api('/?data_row=1', {
      method: 'POST',
      cache: 'no-store',
      headers: (function (h) { h['Content-Type'] = 'application/json'; return h; })(dAdminHeaders()),
      body: JSON.stringify(payload)
    });
    var j = res.json;
    if (j && j.success) {
      toast(j.message || 'บันทึกแล้ว', true);
      hideEditor();
      await loadFiles();
      var sel = $('dataFileSel');
      if (sel) sel.value = st.file;
      await loadRows();
    } else {
      toast((j && j.message) || ('บันทึกไม่ได้ (HTTP ' + res.status + ')'), false);
    }
  }
  var tbody = $('dataBody');
  if (tbody) tbody.addEventListener('click', async function (e) {
    var eb = e.target.closest('[data-dedit]');
    var db = e.target.closest('[data-ddel]');
    if (eb) {
      var k = eb.getAttribute('data-dedit');
      var found = st.rows.filter(function (r) { return rowKey(r) === k; })[0];
      if (!found) { toast('ไม่พบแถวนี้', false); return; }
      var copy = JSON.parse(JSON.stringify(found));
      delete copy._idx;
      st.editKey = k;
      showEditor('update', copy);
      return;
    }
    if (db) {
      var dk = db.getAttribute('data-ddel');
      if (!window.confirm('ลบแถวนี้ถาวร? (' + st.file + ' / ' + dk + ')')) return;
      var res = await api('/?data_row=1', {
        method: 'POST',
        cache: 'no-store',
        headers: (function (h) { h['Content-Type'] = 'application/json'; return h; })(dAdminHeaders()),
        body: JSON.stringify({ file: st.file, action: 'delete', key: dk })
      });
      var j = res.json;
      if (j && j.success) {
        toast(j.message || 'ลบแล้ว', true);
        await loadRows();
      } else {
        toast((j && j.message) || ('ลบไม่ได้ (HTTP ' + res.status + ')'), false);
      }
    }
  });
  var rel = $('dataReload');
  if (rel) rel.addEventListener('click', async function () { await loadFiles(); await loadRows(); });
  var fsel = $('dataFileSel');
  if (fsel) fsel.addEventListener('change', function () { st.page = 0; loadRows(); });
  var sch = $('dataSearch');
  if (sch) sch.addEventListener('input', function () { st.q = sch.value || ''; st.page = 0; renderTable(); });
  var pv = $('dataPrev');
  if (pv) pv.addEventListener('click', function () { if (st.page > 0) { st.page--; renderTable(); } });
  var nx = $('dataNext');
  if (nx) nx.addEventListener('click', function () { st.page++; renderTable(); });
  var addB = $('dataAddRow');
  if (addB) addB.addEventListener('click', function () {
    if (!st.file || !st.writable) { toast('เลือกไฟล์ JSON ที่เขียนได้ก่อน', false); return; }
    st.editKey = st.kind === 'map' ? '' : null;
    var seed = st.kind === 'map' ? { _key: '', name: '' } : { id: '', title: '' };
    showEditor('create', seed);
  });
  var sv = $('dataEditorSave');
  if (sv) sv.addEventListener('click', saveEditor);
  var efB = $('dataEditFile');
  if (efB) efB.addEventListener('click', async function () {
    if (!st.file || !st.writable) { toast('เลือกไฟล์ JSON ที่เขียนได้ก่อน', false); return; }
    var res = await api('/?data_file=1&file=' + encodeURIComponent(st.file), { cache: 'no-store', headers: dAdminHeaders() });
    var j = res.json;
    if (!(j && j.success && typeof j.content === 'string')) {
      toast((j && j.message) || ('โหลดไฟล์ไม่ได้ (HTTP ' + res.status + ')'), false);
      return;
    }
    st.editMode = 'file';
    st.editAction = 'file';
    st.editKey = null;
    $('dataEditorTitle').textContent = 'แก้ไขทั้งไฟล์ ' + st.file + ' (password ล็อกไว้ — เซิร์ฟเวอร์คืนค่าเดิมให้เอง)';
    $('dataEditorJson').value = j.content;
    $('dataEditor').style.display = 'block';
    $('dataEditor').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  var cc = $('dataEditorCancel');
  if (cc) cc.addEventListener('click', hideEditor);
  // รหัสผู้ดูแลใช้ที่เก็บเดียวกับแท็บรายการลงขาย (sessionStorage)
  var lp = $('dataAdminPass'), li = $('dataAdminLoginBtn'), lo = $('dataAdminLogoutBtn'), lt = $('dataAdminPassToggle');
  if (li) li.addEventListener('click', function () {
    if (lp && lp.value) { dSetAdminToken(lp.value); lp.value = ''; }
    syncDataLoginBar();
    loadFiles();
  });
  var dForm = $('dataAdminBar');
  if (dForm && dForm.tagName === 'FORM') dForm.addEventListener('submit', function (e) { e.preventDefault(); if (li) li.click(); });
  if (lo) lo.addEventListener('click', function () { dSetAdminToken(''); syncDataLoginBar(); });
  if (lt && lp) lt.addEventListener('click', function () {
    var show = lp.getAttribute('type') === 'password';
    lp.setAttribute('type', show ? 'text' : 'password');
  });
  syncDataLoginBar();
})();
</script>
</body>
</html>
