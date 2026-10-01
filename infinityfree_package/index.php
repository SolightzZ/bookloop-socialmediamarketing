<?php
// BookLoop API — หน้าแรกของ backend (landing / status page)
// เปิดผ่าน browser เพื่อเช็กว่า backend พร้อมรับ request จาก frontend หรือไม่
// หน้านี้ไม่แตะข้อมูลผู้ใช้ และไม่แสดงค่าใด ๆ จาก .env

$checks = [];
$appOk = true;
$envError = '';

// 1) config + .env โหลดได้หรือไม่ (config.php จะ throw ถ้าไม่มี .env)
try {
    require_once __DIR__ . '/config/config.php';
    $checks['env'] = ['ok' => true, 'label' => 'config + .env', 'detail' => ''];
} catch (Throwable $e) {
    $appOk = false;
    $envError = $e->getMessage();
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

// 3) โฟลเดอร์ data เขียนได้ (ที่เก็บ users/tokens/subscribers แบบไฟล์)
if (!empty($checks['env']['ok'])) {
    if (!is_dir(DATA_PATH)) {
        @mkdir(DATA_PATH, 0755, true);
    }
    $dataOk = is_dir(DATA_PATH) && is_writable(DATA_PATH);
    $checks['data'] = [
        'ok' => $dataOk,
        'label' => 'data/ เขียนได้',
        'detail' => $dataOk ? '' : 'สร้างโฟลเดอร์ htdocs/data/ แล้วตั้งสิทธิ์ 755/775 ให้ PHP เขียนได้',
    ];
    $appOk = $appOk && $dataOk;
}

// ตาราง endpoint (static — ตรงกับไฟล์ใน api/ ตอนนี้)
$endpoints = [
    ['POST', '/api/auth_register.php', 'สมัครสมาชิก', false],
    ['POST', '/api/auth_login.php', 'เข้าสู่ระบบ', false],
    ['POST', '/api/auth_logout.php', 'ออกจากระบบ', true],
    ['GET', '/api/auth_me.php', 'ข้อมูล session ปัจจุบัน', true],
    ['POST', '/api/auth_update_profile.php', 'แก้โปรไฟล์', true],
    ['POST', '/api/auth_delete_account.php', 'ลบบัญชี', true],
    ['POST', '/api/auth_onboarding.php', 'onboarding', true],
    ['POST', '/api/subscribe.php', 'สมัครรับข่าวสาร', false],
    ['POST', '/api/subscribe_newsletter.php', 'สมัคร newsletter', false],
    ['GET', '/api/newsletter_status.php', 'เช็กสถานะ subscribe', false],
    ['POST', '/api/track.php', 'ส่ง event (cart/purchase/...)', false],
    ['GET/DELETE', '/api/logs.php', 'ดู/ล้าง app log', true],
    ['GET/DELETE', '/api/request_log.php', 'ดู/ล้าง access log', true],
    ['GET/DELETE', '/api/log.php', 'log ทั่วไป', true],
];

$isJson = (($_GET['format'] ?? '') === 'json');
// poll=1 = dashboard เรียลไทม์เรียกเอง: ส่ง 200 เสมอ กัน console ขึ้น 500 หลอกตอนระบบมีปัญหา
// (uptime monitor ใช้ ?format=json เพียว ๆ — พัง = 500 เหมือนเดิม จะได้ alert)
$isPoll = (($_GET['poll'] ?? '') === '1');
// Base URL ของ backend — บน InfinityFree ใช้ production URL คงที่;
// ตอนรัน local (php -S) ใช้ host+path ปัจจุบันอัตโนมัติ จะได้เทสกับ frontend localhost ได้
// (เช่น เปิดผ่าน index.php ตรง ๆ หรือไฟล์ไปอยู่ใน sub-path)
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = $host !== '' && (
    str_contains($host, 'localhost') || str_starts_with($host, '127.') || str_starts_with($host, '192.168.')
    || str_contains($host, 'ngrok-free.dev') || str_contains($host, 'ngrok.io')
);
if ($isLocal) {
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $BASE_URL = $scheme . '://' . $host . ($scriptDir === '' || $scriptDir === '/' ? '' : $scriptDir);
} else {
    $BASE_URL = 'https://panitijahem.xo.je';
}

// แยกสาเหตุ: ไฟล์หลักไม่ครบ (config/ ฯลฯ) vs แค่ .env หาย — วิธีแก้คนละอย่างกัน
// config.php throw ข้อความ ".env file not found" เฉพาะกรณีไฟล์หลักครบแต่ขาด .env
$isEnvMissing = !$appOk && str_contains($envError, '.env file not found');

// ─── Request monitor: สรุป POST/GET ที่เข้ามา จาก access log ที่เซิร์ฟเวอร์เขียนอยู่แล้ว ──
// Services/RequestLogger.php (โหลดอัตโนมัติผ่าน config.php) บันทึกทุก request ลง data/request.log
// รูปแบบบรรทัด: [เวลา] [LEVEL] [METHOD /uri] ชื่อevent {json context}
//   incoming_request {method,uri,ip,user_agent}  +  response {method,uri,status,duration_ms}
// หน้านี้อ่านไฟล์นั้น (อ่านอย่างเดียว ไม่แก้ไฟล์ backend อื่น) มาจับคู่ให้เหลือ 1 แถวต่อ 1 request
// ส่วน "เว็บไหนส่งมาแล้วถูกปฏิเสธ" ดึงจาก data/error.log (event cors_origin_not_allowed) เพราะ
// origin ของ request จะถูกเช็กกับ ALLOWED_ORIGIN ตรงนั้น — คือคำตอบของ "ทำไม POST/GET ส่งมาไม่ได้"
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
     * RequestLogger เขียน incoming ตอนเริ่ม request และ response ตอน shutdown — เวลา (วินาที)
     * เดินข้ามได้ จึงจับคู่ด้วย key = METHOD|uri แบบคิว FIFO (log เรียงตามเวลาอยู่แล้ว)
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
                // request ที่ยังไม่เจอ response (เพิ่งเข้ามา / อยู่ท้ายไฟล์พอดี)
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

// เตรียมข้อมูล monitor (หน้า HTML กับ ?format=json ใช้ชุดเดียวกัน)
if ($appOk) {
    $reqLogLines = bl_read_log_tail(DATA_PATH . '/' . REQUEST_LOG_FILE, 1200);
    $errLogLines = bl_read_log_tail(DATA_PATH . '/' . LOG_FILE, 400);
} else {
    // config ยังโหลดไม่ได้ — ลอง path default ตาม template .env ถ้ามี log เก่าค้างอยู่
    $reqLogLines = bl_read_log_tail(__DIR__ . '/data/request.log', 1200);
    $errLogLines = bl_read_log_tail(__DIR__ . '/data/error.log', 400);
}
$reqSummary = bl_summarize_requests($reqLogLines, 50);
$requestsData = [
    'available' => $appOk || count($reqSummary['entries']) > 0,
    'recent' => $reqSummary['entries'],
    'totals' => $reqSummary['totals'],
    'errorCount' => $reqSummary['errorCount'],
    'rejectedOrigins' => bl_rejected_origins($errLogLines),
    'warnings' => bl_recent_log_events($errLogLines, 5),
];

// ─── Self-test: พิสูจน์ว่า POST/GET ถึง PHP จริงไหม (หลักฐาน = marker ลง data/selftest.log) ──
// ?selftest=1 → เซิร์ฟเวอร์ยิง GET+POST กลับเข้าตัวเอง (loopback) แล้วเช็กว่าแต่ละ request
// เขียน marker ลงไฟล์จริง — marker ลง = request ถึง PHP แน่นอน (ไม่ใช่แค่ได้ 200 จาก cache)
$selftestPing = (string) ($_GET['selftest_ping'] ?? '');
if ($selftestPing !== '' && preg_match('/^[a-z0-9_]{4,32}$/', $selftestPing)) {
    // request ping ที่ selftest ยิงเข้ามา: เขียน marker ตอน request จบ (shutdown)
    register_shutdown_function(function () use ($selftestPing) {
        $dir = defined('DATA_PATH') ? DATA_PATH : __DIR__ . '/data';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        @file_put_contents($dir . '/selftest.log', $selftestPing . '|' . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND | LOCK_EX);
    });
}

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
                // ไม่เรียก curl_close() — no-op ตั้งแต่ PHP 8.0 และ deprecated บน 8.5 (warning หลงออกมาทำ JSON เป๊ะ)
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

    // ล้าง output buffer กัน notice/warning หลงออกมาทำ JSON เป๊ะ (เหมือน jsonResponse ใน Http.php)
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

    // เก็บกวาด selftest.log ให้ไม่โต (เหลือ 200 บรรทัดท้าย)
    $stFile = (defined('DATA_PATH') ? DATA_PATH : __DIR__ . '/data') . '/selftest.log';
    $stLines = @file($stFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (is_array($stLines) && count($stLines) > 200) {
        @file_put_contents($stFile, implode("\n", array_slice($stLines, -200)) . "\n", LOCK_EX);
    }

    echo json_encode([
        'success' => $results['get']['ok'] || $results['post']['ok'],
        'time' => date('c'),
        'results' => $results,
        'note' => 'เทสนี้ยิงจากเซิร์ฟเวอร์เข้าตัวเอง (loopback) เพื่อพิสูจน์ว่า PHP รับ POST/GET ได้จริง — ส่วนเว็บอื่นเรียกข้ามโดเมนได้หรือไม่ ขึ้นกับ CORS/ALLOWED_ORIGIN (การ์ด Origin ด้านบน)',
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($isJson) {
    // health check สำหรับ uptime monitor: พัง = 500 (จะได้ alert)
    // no-store กัน proxy/hosting cache สถานะเก่า — realtime ต้องได้ค่าสดทุกครั้ง
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
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// หน้า HTML เป็น dashboard สำหรับคนดู — ส่ง 200 เสมอ (สถานะดูที่ badge)
// กัน browser console ขึ้น "Failed to load resource: 500" หลอกตอนระบบมีปัญหา
http_response_code(200);
?>
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BookLoop API — <?= $appOk ? 'ออนไลน์' : 'มีปัญหา' ?></title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Noto Sans Thai", system-ui, sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px; }
  .wrap { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .sub { color: #94a3b8; margin-bottom: 20px; }
  .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; font-weight: 700; margin-bottom: 20px; }
  .badge.ok { background: #14532d; color: #86efac; }
  .badge.bad { background: #7f1d1d; color: #fca5a5; }
  .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .card h2 { font-size: 16px; margin-bottom: 12px; color: #f8fafc; }
  .check { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #334155; }
  .check:last-child { border-bottom: none; }
  .pass { color: #86efac; font-weight: 700; white-space: nowrap; }
  .fail { color: #fca5a5; font-weight: 700; white-space: nowrap; }
  .detail { color: #fbbf24; font-size: 13px; margin: 4px 0 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 8px; border-bottom: 1px solid #334155; }
  th { color: #94a3b8; font-weight: 600; }
  .method { font-family: monospace; color: #7dd3fc; white-space: nowrap; }
  .path { font-family: monospace; color: #e2e8f0; word-break: break-all; }
  .lock { color: #fbbf24; }
  .open { color: #86efac; }
  .meta { color: #64748b; font-size: 13px; margin-top: 16px; }
  a { color: #7dd3fc; }
  .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; background: #0369a1; color: #f0f9ff !important; font-weight: 700; text-decoration: none; margin: 4px 8px 4px 0; }
  .btn:hover { background: #0284c7; }
  .fix { background: #451a03; border: 1px solid #b45309; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .fix h2 { font-size: 16px; margin-bottom: 8px; color: #fde68a; }
  .fix ol { margin: 8px 0 8px 20px; font-size: 14px; }
  .fix li { margin-bottom: 6px; }
  .code { background: #020617; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; white-space: pre; overflow-x: auto; margin-top: 8px; color: #e2e8f0; }
  .live-line { color: #94a3b8; font-size: 13px; margin: -12px 0 20px; }
  .live-line b { color: #e2e8f0; }
  .dot { display: inline-block; width: 8px; height: 8px; border-radius: 999px; margin-right: 6px; vertical-align: 1px; }
  .dot.ok { background: #4ade80; animation: pulse 1.6s ease-in-out infinite; }
  .dot.bad { background: #f87171; animation: pulse 1.6s ease-in-out infinite; }
  .dot.idle { background: #64748b; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
  .row-flex { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .row-flex select, .row-flex button { background: #0f172a; color: #e2e8f0; border: 1px solid #334155; border-radius: 8px; padding: 6px 10px; font-size: 13px; }
  .row-flex button { cursor: pointer; background: #0369a1; border-color: #0369a1; font-weight: 700; }
  .row-flex button:hover { background: #0284c7; }
  .mono { font-family: monospace; }
  .soft { color: #64748b; font-weight: 400; font-size: 12px; }
  .hint { color: #94a3b8; font-size: 13px; margin-bottom: 10px; }
  .chip { display: inline-block; background: #0f172a; border: 1px solid #334155; border-radius: 999px; padding: 4px 12px; font-size: 12px; margin: 0 8px 8px 0; color: #cbd5e1; }
  .st-ok { color: #86efac; font-weight: 700; }
  .st-warn { color: #fbbf24; font-weight: 700; }
  .st-err { color: #fca5a5; font-weight: 700; }
  .st-unknown { color: #64748b; }
  .req-wrap { overflow-x: auto; }
  .text-input { flex: 1; min-width: 220px; background: #0f172a; color: #e2e8f0; border: 1px solid #334155; border-radius: 8px; padding: 8px 10px; font-size: 13px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>📚 BookLoop API</h1>
  <p class="sub">backend สำหรับ frontend บน GitHub Pages</p>
  <div class="badge <?= $appOk ? 'ok' : 'bad' ?>" id="liveBadge"><?= $appOk ? '● ออนไลน์' : '● มีปัญหา — เช็กด้านล่าง' ?></div>
  <p class="live-line" id="liveLine">⏳ กำลังเชื่อมต่อแบบเรียลไทม์… (รีเฟรชอัตโนมัติทุก <b id="liveEvery">5</b> วินาที)</p>

  <?php if (!$appOk && $envError !== '' && !$isEnvMissing): ?>
  <div class="fix">
    <h2>🔧 วิธีแก้: อัปโหลดไฟล์ขึ้นเซิร์ฟเวอร์ยังไม่ครบ</h2>
    <ol>
      <li>แตกไฟล์ <b>bookloop-htdocs.zip</b> แล้วอัปโหลด <b>เนื้อข้างในทั้งหมด</b> ไปไว้ใน <b>htdocs/</b> ของโดเมน (ห้ามอัปโหลดทั้งโฟลเดอร์ทับลงไป)</li>
      <li>บนเซิร์ฟเวอร์ต้องมีครบ: <b>index.php, .htaccess, api/, auth/, config/, Services/, email/, vendor/</b> — ตอนนี้ขาดไฟล์ตามข้อความ error ด้านล่าง</li>
      <li>ลบไฟล์ <b>index2.html</b> (หน้า default ของ InfinityFree) ออกจาก htdocs/ ถ้ายังมี</li>
      <li>รีเฟรชหน้านี้ — ขั้นต่อไปจะบอกให้สร้างไฟล์ .env เอง</li>
    </ol>
  </div>
  <?php endif; ?>

  <?php if ($isEnvMissing): ?>
  <div class="fix">
    <h2>🔧 วิธีแก้: สร้างไฟล์ .env บนเซิร์ฟเวอร์</h2>
    <ol>
      <li>เข้า InfinityFree → File Manager → โฟลเดอร์ <b>htdocs</b> → New File ชื่อ <b>.env</b></li>
      <li>วางเนื้อหาด้านล่าง แล้วกรอกอีเมลผู้ส่ง + App Password ของจริง</li>
      <li>รีเฟรชหน้านี้ — ต้องขึ้น <b>● ออนไลน์</b></li>
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

  <div class="card">
    <h2>⚡ การเชื่อมต่อ API แบบเรียลไทม์</h2>
    <div class="check">
      <span><span class="dot idle" id="apiDot"></span><span id="apiLabel">กำลังทดสอบการเชื่อมต่อ…</span></span>
      <span class="mono" id="apiLatency">—</span>
    </div>
    <p class="detail" id="apiDetail" style="color:#94a3b8"></p>
    <div class="row-flex" style="margin-top:10px">
      <label><input type="checkbox" id="autoRefresh" checked> อัปเดตอัตโนมัติ</label>
      <label>ทุก <select id="refreshSec">
        <option value="3">3 วินาที</option>
        <option value="5" selected>5 วินาที</option>
        <option value="10">10 วินาที</option>
        <option value="30">30 วินาที</option>
      </select></label>
      <button type="button" id="refreshNow">🔄 ทดสอบตอนนี้</button>
    </div>
  </div>

  <div class="card">
    <h2>📥 Request เข้าล่าสุด <span class="soft">POST/GET ที่เซิร์ฟเวอร์รับจริง (อัปเดตสด)</span></h2>
    <p class="hint" id="reqHint">กำลังโหลดจาก data/request.log…</p>
    <div id="reqStats" style="margin-bottom:8px"></div>
    <div class="req-wrap">
      <table>
        <thead>
          <tr><th>เวลา</th><th>Method</th><th>Path</th><th>ที่มา (IP · client)</th><th>สถานะ</th><th>ms</th></tr>
        </thead>
        <tbody id="reqBody">
          <tr><td colspan="6" class="soft">กำลังโหลด…</td></tr>
        </tbody>
      </table>
    </div>
    <p class="detail" id="reqDetail"></p>
  </div>

  <div class="card">
    <h2>🚫 เว็บที่ยิงเข้ามาแล้วถูกปฏิเสธ <span class="soft">CORS — origin ไม่อยู่ใน ALLOWED_ORIGIN (จาก error.log)</span></h2>
    <div id="originBox" class="hint">กำลังโหลด…</div>
    <div class="row-flex" style="margin-top:12px">
      <input type="text" id="originInput" class="text-input" placeholder="https://เว็บที่อยากรู้ว่ายิง POST/GET เข้ามาได้ไหม">
      <button type="button" id="originCheck">🔎 เช็ก origin นี้</button>
    </div>
    <p class="detail" id="originResult"></p>
  </div>

  <div class="card">
    <h2>🧪 พิสูจน์ว่า POST/GET ถึง PHP จริงไหม</h2>
    <p class="hint">เซิร์ฟเวอร์จะยิง GET + POST เข้าหาตัวเอง แล้วเช็กว่าแต่ละ request ลง log จริง — ถ้าผ่านทั้งคู่ แปลว่าตัว API รับได้แน่นอน ปัญหาที่เหลือ (ถ้ามี) เป็นที่ CORS/เครือข่าย ไม่ใช่ตัว backend</p>
    <button type="button" id="selfTestBtn" class="btn" style="border:none;cursor:pointer">▶ เริ่มเทส GET + POST</button>
    <div id="selfTestOut" style="margin-top:12px"></div>
  </div>

  <div class="card">
    <h2>สถานะระบบ <span style="color:#64748b;font-weight:400;font-size:13px">(อัปเดตสด)</span></h2>
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

  <div class="card">
    <h2>Endpoints (<?= count($endpoints) ?>)</h2>
    <table>
      <tr><th>Method</th><th>Path</th><th>คำอธิบาย</th><th>Auth</th></tr>
      <?php foreach ($endpoints as [$m, $p, $d, $auth]): ?>
        <tr>
          <td class="method"><?= $m ?></td>
          <td class="path"><?= $p ?></td>
          <td><?= htmlspecialchars($d, ENT_QUOTES, 'UTF-8') ?></td>
          <td class="<?= $auth ? 'lock' : 'open' ?>"><?= $auth ? '🔒 token' : 'เปิด' ?></td>
        </tr>
      <?php endforeach; ?>
    </table>
  </div>

  <div class="card">
    <h2>ทดสอบเร็ว</h2>
    <p>
      <a class="btn" href="<?= $BASE_URL ?>/email/subscribe_form.php">📧 ฟอร์มทดสอบอีเมล</a>
      <a class="btn" href="<?= $BASE_URL ?>/api/auth_me.php">🔌 เทส API</a>
    </p>
    <p><a href="<?= $BASE_URL ?>/?format=json">ดูสถานะแบบ JSON</a></p>
    <p><a href="<?= $BASE_URL ?>/api/">api/ รายชื่อ endpoint (JSON)</a></p>
    <p><a href="<?= $BASE_URL ?>/api/auth_me.php">api/auth_me.php</a> (ต้องได้ JSON)</p>
    <p><a href="<?= $BASE_URL ?>/email/subscribe_form.php">ฟอร์ม subscribe ทดสอบ</a></p>
  </div>

  <p class="meta">PHP <?= PHP_VERSION ?> · <span id="metaTime"><?= date('Y-m-d H:i:s') ?></span> · <a href="<?= $BASE_URL ?>/?format=json">?format=json</a> สำหรับ health check</p>
</div>
<script>
// Realtime dashboard: poll ?format=json + api/ โดยไม่ต้องรีเฟรชหน้า
(function () {
  var BASE = <?= json_encode($BASE_URL, JSON_UNESCAPED_SLASHES) ?>;
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
  var timer = null;
  var busy = false;

  function setBadge(ok, realtime) {
    badge.className = 'badge ' + (ok ? 'ok' : 'bad');
    badge.textContent = ok
      ? (realtime ? '● ออนไลน์ (เรียลไทม์)' : '● ออนไลน์')
      : '● มีปัญหา — เช็กด้านล่าง';
    document.title = 'BookLoop API — ' + (ok ? 'ออนไลน์' : 'มีปัญหา');
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
      // ถ้าแถวนี้กลับมาผ่านแล้ว ลบข้อความวิธีแก้เดิมที่ต่อท้ายแถวนี้ทิ้ง
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
    apiDot.className = 'dot ' + state; // ok | bad | idle
    apiLabel.textContent = label;
    apiLatency.textContent = latency;
    apiDetail.textContent = detail || '';
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
    return ip.slice(0, 10) + '…'; // IPv6 — ตัดสั้น
  }

  function renderRequests(req) {
    if (!req || !reqHint) return;
    reqHint.textContent = req.available
      ? 'ข้อมูลจาก htdocs/data/request.log ที่ RequestLogger บันทึกทุก request เข้า backend · เรียงใหม่ → เก่า · ซ่อนท้าย IP เพื่อความเป็นส่วนตัว'
      : 'ยังอ่าน request.log ไม่ได้ — ต้องสร้าง .env และโฟลเดอร์ data/ ให้ PHP เขียนได้ก่อน';
    var t = req.totals || {};
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
      : '<tr><td colspan="6" class="soft">ยังไม่มี request — เปิดเว็บ frontend หรือกดปุ่มเทสด้านล่าง แล้วรอรอบอัปเดตถัดไป</td></tr>';

    var warns = req.warnings || [];
    reqDetail.innerHTML = warns.length
      ? '<b>⚠️ ' + warns.length + ' เหตุการณ์ล่าสุดจาก error.log</b>' + warns.slice(0, 3).map(function (w) {
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
      originBox.innerHTML = '<span class="pass">✅ ไม่มีเว็บไหนถูกปฏิเสธช่วงนี้</span> <span class="soft">— origin ที่ยิงเข้ามาผ่าน allow-list (ALLOWED_ORIGIN ใน .env) ทั้งหมด</span>';
      return;
    }
    originBox.innerHTML = list.map(function (o) {
      return '<div class="check"><span class="mono">' + esc(o.origin) + '</span>' +
        '<span class="fail">' + o.count + ' ครั้ง · ล่าสุด ' + esc(o.last) + '</span></div>';
    }).join('') +
      '<p class="detail">origin เหล่านี้เคยยิงเข้ามาจริง แต่ backend ปฏิเสธเพราะไม่อยู่ใน ALLOWED_ORIGIN ใน .env — เพิ่ม origin เข้าไปแล้ว request จะผ่าน (เช็กว่า origin ไหนผ่านได้ด้วยช่องด้านล่าง)</p>';
  }

  async function refresh(manual) {
    if (busy) return;
    busy = true;
    var t0 = performance.now();
    try {
      // 1) สถานะระบบ (ใช้ &poll=1 เพื่อให้ได้ 200 เสมอ — console จะได้ไม่แดงหลอก ส่วน uptime monitor ใช้ ?format=json เพียว ๆ)
      var res = await fetch(BASE + '/?format=json&poll=1', { cache: 'no-store' });
      if (res.url && res.url.indexOf('errors.infinityfree.net') !== -1) {
        // โฮสต์ redirect มาเอง = ไฟล์บนเซิร์ฟเวอร์ไม่ครบหรือเป็นตัวเก่า
        // (กัน dashboard ตัวเก่าเรียก path ที่ไม่มีแล้ววนแดงทุก 5 วินาทีแบบไม่มีคำอธิบาย)
        setBadge(false, true);
        setApi('bad', 'โฮสต์ส่งไปหน้า 404 (ไฟล์บนเซิร์ฟเวอร์ไม่ครบหรือ index.php เก่า)', 'HTTP ' + res.status,
          'อัปโหลด bookloop-htdocs.zip ตัวใหม่ทับของเดิมให้ครบ (api/ auth/ config/ Services/ vendor/) แล้วรีเฟรชหน้านี้');
        line.innerHTML = '❌ โฮสต์ redirect ไปหน้า 404 · อัปโหลดไฟล์ตัวใหม่ทับ แล้วจะลองใหม่ใน ' + secSel.value + ' วินาที';
        return;
      }
      var text = await res.text();
      var data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
      var ms = Math.round(performance.now() - t0);

      if (!data || typeof data.success === 'undefined') {
        // InfinityFree anti-bot / fatal ส่ง HTML มาแทน JSON
        setBadge(false, true);
        setApi('bad', 'เชื่อมต่อไม่ได้ — เซิร์ฟเวอร์ตอบกลับไม่ใช่ JSON', ms + ' ms',
          'HTTP ' + res.status + ' — อาจติดหน้า challenge ของโฮสต์ หรือ PHP error (เปิด ?format=json ดูตรงๆ)');
        line.innerHTML = '❌ ตอบกลับไม่ใช่ JSON (HTTP ' + res.status + ') · ลองใหม่ใน ' + secSel.value + ' วินาที';
      } else {
        setBadge(!!data.success, true);
        renderChecks(data.checks || null);
        renderRequests(data.requests);
        renderOrigins(data.requests);
        // ระบบรายงานตัวเองว่าไม่พร้อม (success:false) — ยกสาเหตุขึ้นมาโชว์เป็นข้อความเลย ไม่ต้องเปิด console
        var sysHint = '';
        if (!data.success && data.error) {
          sysHint = String(data.error);
          if (sysHint.indexOf('.env') !== -1) {
            sysHint = 'ยังไม่สร้างไฟล์ .env บนเซิร์ฟเวอร์ — ทำตามกล่องสีเหลืองด้านล่าง (' + sysHint + ')';
          }
        }
        if (data.time && metaTime) {
          try { metaTime.textContent = new Date(data.time).toLocaleString('th-TH'); }
          catch (e) { metaTime.textContent = data.time; }
        }
        // 2) พิสูจน์ว่า API รับ request จริง: ยิง /api/ (public, ตอบ 200 JSON ไม่ต้องใช้ token)
        // เดิมยิง auth_me.php ซึ่งตอบ 401 ตามปกติ แต่ browser จะ log "Failed to load resource: 401"
        // ลง console ทุกครั้งที่ poll — ย้ายมา endpoint ที่ตอบ 200 เพื่อให้ console สะอาด
        // ถ้าได้ JSON (มี success:true + endpoints) = เส้น API เชื่อมได้แล้ว
        try {
          var t1 = performance.now();
          var r2 = await fetch(BASE + '/api/', { cache: 'no-store' });
          var b2 = await r2.text();
          var j2 = null;
          try { j2 = b2 ? JSON.parse(b2) : null; } catch (e) { j2 = null; }
          var ms2 = Math.round(performance.now() - t1);
          if (r2.url && r2.url.indexOf('errors.infinityfree.net') !== -1) {
            // โฮสต์ redirect ไปหน้า 404 = ไฟล์นี้ยังไม่อยู่บนเซิร์ฟเวอร์ (อัปโหลดยังไม่ครบ)
            setApi('bad', 'ไฟล์ api/ ยังไม่อยู่บนเซิร์ฟเวอร์ (โฮสต์ส่งไปหน้า 404)', 'HTTP ' + r2.status,
              'อัปโหลดโฟลเดอร์ api/ + auth/ + config/ + Services/ + vendor/ ขึ้น htdocs/ ให้ครบ แล้วสร้างไฟล์ .env');
          } else if (j2 && j2.success === true && typeof j2.count !== 'undefined') {
            setApi('ok', 'เชื่อม API ได้แล้ว — /api/ ตอบกลับเป็น JSON (HTTP ' + r2.status + ', ' + j2.count + ' endpoints)', ms2 + ' ms',
              'เส้นทาง API ใช้งานได้ ( endpoint ที่ต้องใช้ token จะตรวจสิทธิ์ตามปกติ)');
          } else {
            setApi('bad', 'API ตอบกลับไม่ใช่ JSON (HTTP ' + r2.status + ')', ms2 + ' ms',
              'อาจติด anti-bot ของโฮสต์ — ลองเปิด /api/ ตรงๆ ในเบราว์เซอร์');
          }
        } catch (e2) {
          setApi('bad', 'เรียก /api/ ไม่สำเร็จ', '—', String((e2 && e2.message) || e2));
        }
        var when = new Date().toLocaleTimeString('th-TH');
        line.innerHTML = '✅ อัปเดตล่าสุด <b>' + esc(when) + '</b> · ตอบใน <b>' + ms + ' ms</b> · รีเฟรชทุก <b>' + esc(secSel.value) + '</b> วินาที'
          + (sysHint ? '<br>⚠️ ' + esc(sysHint) : '');
      }
    } catch (err) {
      setBadge(false, true);
      setApi('bad', 'เชื่อมต่อไม่ได้ — fetch ล้มเหลว', '—', String((err && err.message) || err));
      line.textContent = '❌ เชื่อมต่อไม่ได้ — จะลองใหม่ใน ' + secSel.value + ' วินาที';
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
    var o = originInput.value.trim().replace(/\/+$/, '');
    if (!o) {
      originResult.innerHTML = '<span class="soft">ใส่ origin ก่อน เช่น https://solightzz.github.io</span>';
      return;
    }
    originResult.innerHTML = 'กำลังเช็ก…';
    try {
      // /api/index.php?check-origin= ตอบ allowed:true/false พร้อมสาเหตุ — ใช้ตอบว่าเว็บนี้ยิงเข้ามาได้หรือไม่
      var r = await fetch(BASE + '/api/index.php?check-origin=' + encodeURIComponent(o), { cache: 'no-store' });
      var text = await r.text();
      var j = null;
      try { j = JSON.parse(text); } catch (e) { j = null; }
      if (!j) {
        originResult.innerHTML = '<span class="fail">เซิร์ฟเวอร์ตอบไม่ใช่ JSON (HTTP ' + r.status + ') — อาจติด challenge ของโฮสต์</span>';
        return;
      }
      originResult.innerHTML = j.allowed
        ? '<span class="pass">✅ ' + esc(j.origin) + ' อยู่ใน allow-list — เว็บนี้ยิง POST/GET เข้ามาได้ (ส่วน endpoint ที่ต้องใช้ token ก็ต้องส่ง token ตามปกติ)</span>'
        : '<span class="fail">❌ ' + esc(j.origin) + ' โดนบล็อก</span>' + (j.reason ? '<br><span class="detail">' + esc(j.reason) + '</span>' : '');
    } catch (e) {
      originResult.innerHTML = '<span class="fail">เรียกไม่สำเร็จ: ' + esc(String((e && e.message) || e)) + '</span>';
    }
  });

  selfTestBtn.addEventListener('click', async function () {
    selfTestBtn.disabled = true;
    selfTestOut.innerHTML = '<span class="soft">กำลังยิง GET + POST จากเซิร์ฟเวอร์เข้าหาตัวเอง… (นานสุด ~25 วินาที)</span>';
    try {
      var r = await fetch(BASE + '/?selftest=1', { cache: 'no-store' });
      var text = await r.text();
      var j = null;
      try { j = JSON.parse(text); } catch (e) { j = null; }
      if (!j || !j.results) {
        selfTestOut.innerHTML = '<span class="fail">อ่านผลเทสไม่ได้ — เซิร์ฟเวอร์ตอบไม่ใช่ JSON (HTTP ' + r.status + ')</span>';
        return;
      }
      function testLine(name, x) {
        if (!x) return '<div class="check"><span>' + name + '</span><span class="st-unknown">ไม่ทราบผล</span></div>';
        var head = '<div class="check"><span>' + name + ' <span class="soft">HTTP ' + (x.http || '—') + ' · ' + x.ms + ' ms</span></span>' +
          '<span class="' + (x.ok ? 'pass' : 'fail') + '">' + (x.ok ? 'ถึง PHP จริง ✅' : 'ไม่ถึง ❌') + '</span></div>';
        return head + (x.detail ? '<p class="detail">' + esc(x.detail) + '</p>' : '');
      }
      selfTestOut.innerHTML = testLine('GET', j.results.get) + testLine('POST', j.results.post) +
        '<p class="hint" style="margin-top:8px;margin-bottom:0">' + esc(j.note || '') + '</p>' +
        '<p class="soft" style="margin-top:6px">ดู request ที่เพิ่งยิงได้ในตาราง "Request เข้าล่าสุด" ด้านบน (path จะมี selftest_ping=…)</p>';
    } catch (e) {
      selfTestOut.innerHTML = '<span class="fail">เรียก selftest ไม่สำเร็จ: ' + esc(String((e && e.message) || e)) + '</span>';
    } finally {
      selfTestBtn.disabled = false;
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (timer) clearInterval(timer); timer = null; }
    else { restart(); refresh(true); }
  });

  restart();
  refresh(true);
})();
</script>
</body>
</html>
