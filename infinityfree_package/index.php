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
ALLOWED_ORIGIN=https://solightzz.github.io,http://localhost:3000
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
