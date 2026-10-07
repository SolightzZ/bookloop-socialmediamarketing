<?php
$title = 'สมัครรับข่าวสาร - BookLoop';

// กล่องทดสอบอีเมล: แสดงทุก host (local + production) — ใช้ SMTP จริงจาก .env
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        * { box-sizing: border-box; }

        body {
            font-family: 'Noto Sans Thai', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 32px 16px;
            background: #F5F7FA;
            color: #0F2D4A;
            -webkit-font-smoothing: antialiased;
            margin: 0;
        }

        /* Shell: Swiss card, no shadow, hairline containment */
        .shell { width: 100%; max-width: 1180px; margin: auto; }
        .card { background: #FFFFFF; border: 1px solid #D6E0EA; border-radius: 4px; overflow: hidden; }
        .top-rule { height: 4px; background: #0F2D4A; }
        .masthead { padding: 20px 28px; border-bottom: 1px solid #D6E0EA; }
        .masthead-row { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; }
        .brand-mark { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; color: #0F2D4A; }
        .brand-mark .reg { color: #1976D2; }
        .meta-line { font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #62748A; }
        .footer { padding: 18px 28px; background: #0F2D4A; }
        .footer-row { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; }
        .footer-brand { font-size: 14px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }
        .footer-meta { font-family: 'Inter', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: rgba(255,255,255,0.6); }

        /* Editorial hero: asymmetric 2-col on desktop */
        .newsletter-hero {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
            gap: 64px;
            padding: 56px;
            align-items: start;
        }

        .hero-copy { max-width: 560px; }

        /* Headings carry their own weight — no kicker. */

        .hero-copy h1 {
            margin: 0;
            font-size: clamp(48px, 5.2vw, 72px);
            line-height: 1.12;
            letter-spacing: -0.03em;
            font-weight: 800;
            color: #0F2D4A;
            text-wrap: balance;
        }
        .hero-copy h1 em { font-style: normal; color: #1976D2; }

        .hero-copy > p {
            max-width: 430px;
            margin: 24px 0 0;
            font-size: 15px;
            line-height: 1.9;
            color: #62748A;
        }

        .benefit-list { margin-top: 48px; border-top: 1px solid #D6E0EA; }
        .benefit {
            display: grid;
            grid-template-columns: 44px 1fr;
            gap: 18px;
            padding: 18px 0;
            border-bottom: 1px solid #D6E0EA;
        }
        .benefit-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #EAF4FF;
            display: grid;
            place-items: center;
            align-self: center;
            color: #1976D2;
        }
        .benefit-icon svg { width: 18px; height: 18px; }
        .benefit strong { display: block; font-size: 14px; color: #0F2D4A; }
        .benefit small { display: block; margin-top: 4px; color: #62748A; font-size: 12px; line-height: 1.6; }

        /* Form panel: white, hairline, ink top rule */
        .signup-panel {
            align-self: start;
            padding: 32px;
            background: #fff;
            border: 1px solid #D6E0EA;
            border-top: 4px solid #0F2D4A;
            border-radius: 2px;
            min-width: 0;
        }

        .panel-header h2 { margin: 0; font-size: 28px; line-height: 1.25; letter-spacing: -0.02em; color: #0F2D4A; text-wrap: balance; }

        /* Type choice cards (replaces old tab bar) */
        .signup-type { display: grid; gap: 8px; margin: 24px 0; }
        .signup-option {
            display: grid;
            grid-template-columns: 32px minmax(0, 1fr) auto;
            align-items: center;
            gap: 12px;
            width: 100%;
            min-height: 44px;
            padding: 12px 14px;
            border: 1px solid #D6E0EA;
            border-radius: 2px;
            background: #fff;
            text-align: left;
            cursor: pointer;
            font: inherit;
            color: #0F2D4A;
        }
        .signup-option:hover { border-color: #0F2D4A; }
        .signup-option.active { border-color: #0F2D4A; background: #F5F7FA; }
        .option-number { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 800; color: #1976D2; }
        .signup-option strong { display: block; font-size: 13px; color: #0F2D4A; }
        .signup-option small { display: block; margin-top: 2px; font-size: 11px; color: #62748A; }
        .option-arrow { display: inline-flex; color: #0F2D4A; line-height: 1; }
        .signup-option svg, .submit-button svg { width: 18px; height: 18px; flex-shrink: 0; }
        .signup-option:focus-visible { outline: 2px solid #1976D2; outline-offset: 2px; }

        /* Inputs */
        .field { margin-bottom: 18px; }
        .field label { display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; color: #0F2D4A; }
        .field input {
            width: 100%;
            height: 52px;
            padding: 0 16px;
            border: 1px solid #CBD5E1;
            border-radius: 2px;
            background: #fff;
            font: inherit;
            font-size: 15px;
            color: #0F2D4A;
            outline: none;
            caret-color: #0F2D4A;
        }
        .field input::placeholder { color: #62748A; }
        .field input:hover { border-color: #0F2D4A; }
        .field input:focus { border-color: #0F2D4A; box-shadow: 0 0 0 2px #EAF4FF; }
        .field input:focus-visible { outline: 2px solid #1976D2; outline-offset: 2px; }

        .section-label {
            display: flex;
            align-items: baseline;
            gap: 12px;
            margin: 26px 0 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid #D6E0EA;
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.12em;
            color: #62748A;
        }
        .pref-spacer { height: 18px; }

        .pref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 10px;
            min-height: 44px;
            padding: 10px 12px;
            border: 1px solid #D6E0EA;
            border-radius: 2px;
            background: #fff;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            color: #0F2D4A;
        }
        .checkbox-item:hover { border-color: #0F2D4A; }
        .checkbox-item:has(input:checked) { border-color: #0F2D4A; background: #EAF4FF; }
        .checkbox-item:focus-within { border-color: #0F2D4A; background: #EAF4FF; }
        .checkbox-item input { accent-color: #0F2D4A; width: 16px; height: 16px; margin: 0; }
        .checkbox-item input:focus-visible { outline: 2px solid #1976D2; outline-offset: 2px; }

        .submit-button {
            width: 100%;
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 0 18px;
            border: 0;
            border-radius: 2px;
            background: #0F2D4A;
            color: #fff;
            font: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
        }
        .submit-button:hover { background: #1976D2; }
        .submit-button:focus-visible { outline: 2px solid #1976D2; outline-offset: 2px; }

        .privacy-note { margin: 16px 0 0; font-size: 11px; line-height: 1.7; color: #62748A; }

        /* กล่องทดสอบส่งอีเมล (แสดงทุก host) */
        .dev-box {
            margin-bottom: 20px;
            border: 1px dashed #CBD5E1;
            border-radius: 2px;
            padding: 14px;
            background: #EAF4FF;
        }
        .dev-title { margin-bottom: 10px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: #62748A; }
        .dev-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .dev-note { margin: 10px 0 0; font-size: 11px; color: #62748A; line-height: 1.6; }
        .dev-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 44px;
            min-width: 44px;
            padding: 8px 14px;
            border: 1px solid #D6E0EA;
            border-radius: 2px;
            background: #FFFFFF;
            color: #0F2D4A;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            font-family: inherit;
        }
        .dev-btn:hover { background: #fff; border-color: #0F2D4A; }
        .dev-btn:focus-visible { outline: 2px solid #1976D2; outline-offset: 2px; }
        .dev-templates { margin-top: 16px; background: #fff; border: 1px solid #D6E0EA; border-radius: 4px; overflow: hidden; }
        .dev-templates-head { padding: 12px 18px; border-bottom: 1px solid #D6E0EA; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .dev-templates-head strong { font-size: 12px; color: #0F2D4A; }
        .dev-templates-body { padding: 14px 18px; display: flex; flex-wrap: wrap; gap: 8px; }
        .dev-templates-foot { padding: 0 18px 14px; font-size: 11px; color: #62748A; line-height: 1.6; }

        /* Loading + toast (logic เดิม) */
        .loading-overlay { display: none; position: fixed; inset: 0; background: rgba(245,247,250,0.85); z-index: 100; place-items: center; }
        .loading-overlay.active { display: grid; }
        .visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
        .spinner { width: 40px; height: 40px; border: 3px solid #D6E0EA; border-top-color: #1976D2; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .toast {
            position: fixed; top: 24px; right: 24px;
            display: flex; align-items: center; gap: 10px;
            padding: 12px 18px; border-radius: 4px;
            border: 1px solid #D6E0EA; border-top: 3px solid #0F2D4A;
            font-size: 14px; font-weight: 600; color: #0F2D4A; background: #FFFFFF;
            z-index: 200; transform: translateX(calc(100% + 32px));
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 380px;
        }
        .toast.show { transform: translateX(0); }
        .toast-success { border-top-color: #1976D2; }
        .toast-error { border-top-color: #B42318; background: #FDF0EF; }

        ::selection { background: #CBD5E1; color: #0F2D4A; }

        /* Tablet: 2 columns กระชับ */
        @media (max-width: 999px) {
            .newsletter-hero { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 40px; padding: 40px 32px; }
            .hero-copy h1 { font-size: clamp(40px, 6vw, 56px); }
        }

        /* Mobile: stack — form ขึ้นก่อน benefits */
        @media (max-width: 800px) {
            body { padding: 16px 12px max(16px, env(safe-area-inset-bottom)); overflow-x: clip; }
            .masthead { padding: 14px 16px; }
            .masthead-row, .footer-row { flex-wrap: wrap; gap: 12px; row-gap: 4px; }
            .footer { padding: 14px 16px; }
            .newsletter-hero { display: flex; flex-direction: column; gap: 0; padding: 28px 16px; }
            .hero-copy { display: contents; }
            .hero-copy h1 { order: 1; font-size: clamp(40px, 13vw, 56px); line-height: 1.05; }
            .hero-copy > p { order: 2; margin-top: 16px; font-size: 16px; }
            .signup-panel { order: 3; margin-top: 24px; padding: 20px 16px; }
            .benefit-list { order: 4; margin-top: 28px; }
            .benefit { padding: 16px 0; }
            .field input { font-size: 16px; }
            .dev-box { padding: 12px; }
            .dev-templates { margin-top: 12px; }
            .toast { max-width: calc(100vw - 24px); right: 12px; }
        }

        @media (max-width: 480px) {
            .newsletter-hero { padding: 24px 12px; }
            .hero-copy h1 { font-size: 40px; }
            .signup-panel { padding: 18px 14px; }
            .pref-grid { grid-template-columns: 1fr; }
        }

        @media (min-width: 1000px) {
            .masthead { padding-left: 56px; padding-right: 56px; }
            .footer { padding-left: 56px; padding-right: 56px; }
        }

        @media (prefers-reduced-motion: reduce) {
            .spinner { animation: none; }
            .toast { transition: none; }
            .submit-button, .signup-option, .checkbox-item, .field input, .dev-btn { transition: none; }
        }
    </style>
</head>
<body>
    <div class="loading-overlay" id="loading" role="status"><div class="spinner" aria-hidden="true"></div><span class="visually-hidden">กำลังส่งข้อมูล…</span></div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>

    <main class="shell">
        <div class="card">
            <div class="top-rule"></div>

            <header class="masthead">
                <div class="masthead-row">
                    <span class="brand-mark">BOOKLOOP<span class="reg">®</span></span>
                    <span class="meta-line">NEWSLETTER / 2026</span>
                </div>
            </header>

            <section class="newsletter-hero">
                <!-- Left: editorial / brand story -->
                <div class="hero-copy">
                    <h1>อ่านก่อนใคร<br><em>ค้นพบเล่มใหม่.</em></h1>
                    <p>หนังสือใหม่ โปรเฉพาะสมาชิก และกิจกรรมที่คัดมาให้คุณ ส่งตรงถึงอีเมลโดยไม่รบกวนเกินจำเป็น</p>

                    <div class="benefit-list">
                        <div class="benefit">
                            <span class="benefit-icon" aria-hidden="true"><i data-lucide="book-open"></i></span>
                            <div><strong>หนังสือใหม่ก่อนใคร</strong><small>อัปเดตรายการใหม่ทุกสัปดาห์</small></div>
                        </div>
                        <div class="benefit">
                            <span class="benefit-icon" aria-hidden="true"><i data-lucide="badge-percent"></i></span>
                            <div><strong>โปรเฉพาะสมาชิก</strong><small>ส่วนลดและสิทธิพิเศษส่งตรงถึงคุณ</small></div>
                        </div>
                        <div class="benefit">
                            <span class="benefit-icon" aria-hidden="true"><i data-lucide="shield-check"></i></span>
                            <div><strong>ยกเลิกได้ทุกเมื่อ</strong><small>ไม่มีสแปม ถอนตัวได้ในคลิกเดียว</small></div>
                        </div>
                    </div>
                </div>

                <!-- Right: signup panel -->
                <div class="signup-panel">
                    <div class="panel-header">
                        <h2>รับข่าวสารจาก<br>BookLoop</h2>
                    </div>

                    <div class="signup-type" role="tablist" aria-label="ประเภทการสมัคร">
                        <button type="button" role="tab" id="tab-register" aria-selected="true" aria-controls="form-register" class="signup-option active" data-tab="register" onclick="switchTab('register')">
                            <span class="option-number">A</span>
                            <span><strong>สมาชิกใหม่</strong><small>สมัครสมาชิก BookLoop</small></span>
                            <span class="option-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i></span>
                        </button>
                        <button type="button" role="tab" id="tab-subscription" aria-selected="false" tabindex="-1" aria-controls="form-subscription" class="signup-option" data-tab="subscription" onclick="switchTab('subscription')">
                            <span class="option-number">B</span>
                            <span><strong>รับข่าวสาร</strong><small>รับเฉพาะ Newsletter</small></span>
                            <span class="option-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i></span>
                        </button>
                    </div>

                    <div class="dev-box">
                        <div class="dev-title">ทดสอบ — ส่ง DEMO เข้าอีเมล</div>
                        <div class="dev-row">
                            <button type="button" class="dev-btn" onclick="sendDemo('confirm')">ยืนยันสมัคร</button>
                            <button type="button" class="dev-btn" onclick="sendDemo('welcome')">ต้อนรับ</button>
                            <button type="button" class="dev-btn" onclick="sendDemo('onboarding')">Onboarding</button>
                            <button type="button" class="dev-btn" onclick="sendDemo('order')">ใบเสร็จ</button>
                            <button type="button" class="dev-btn" onclick="sendDemo('cart')">เตือนตะกร้า</button>
                        </div>
                        <p class="dev-note">ใช้ชื่อ–อีเมลที่กรอกในฟอร์มนี้ ส่งจริงผ่าน SMTP</p>
                    </div>

                    <!-- Form 1: register (logic เดิม → sendMail.php) -->
                    <form class="form" id="form-register" role="tabpanel" aria-labelledby="tab-register" method="POST" action="sendMail.php">
                        <input type="hidden" name="form_type" value="register">
                        <div class="field">
                            <label for="reg-name">ชื่อ-นามสกุล</label>
                            <input type="text" id="reg-name" name="name" placeholder="ชื่อของคุณ" autocomplete="name" required>
                        </div>
                        <div class="field">
                            <label for="reg-email">อีเมล</label>
                            <input type="email" id="reg-email" name="email" placeholder="you@example.com" autocomplete="email" required>
                        </div>
                        <button class="submit-button" type="submit">
                            <span>สมัครสมาชิกใหม่</span>
                            <i data-lucide="arrow-right" aria-hidden="true"></i>
                        </button>
                    </form>

                    <!-- Form 2: subscription (logic เดิม → sendMail.php) -->
                    <form class="form" id="form-subscription" role="tabpanel" aria-labelledby="tab-subscription" method="POST" action="sendMail.php" hidden>
                        <input type="hidden" name="form_type" value="subscription">
                        <div class="field">
                            <label for="sub-name">ชื่อ-นามสกุล</label>
                            <input type="text" id="sub-name" name="name" placeholder="ชื่อของคุณ" autocomplete="name" required>
                        </div>
                        <div class="field">
                            <label for="sub-email">อีเมล</label>
                            <input type="email" id="sub-email" name="email" placeholder="you@example.com" autocomplete="email" required>
                        </div>
                        <div class="section-label">เลือกประเภทข่าวสาร</div>
                        <div class="pref-grid">
                            <label class="checkbox-item"><input type="checkbox" name="news_preferences[]" value="new_books"> หนังสือใหม่</label>
                            <label class="checkbox-item"><input type="checkbox" name="news_preferences[]" value="promotions"> โปรโมชั่น</label>
                            <label class="checkbox-item"><input type="checkbox" name="news_preferences[]" value="recommendations"> หนังสือแนะนำ</label>
                            <label class="checkbox-item"><input type="checkbox" name="news_preferences[]" value="events"> กิจกรรม</label>
                        </div>
                        <div class="pref-spacer"></div>
                        <button class="submit-button" type="submit">
                            <span>สมัครรับข่าวสาร</span>
                            <i data-lucide="arrow-right" aria-hidden="true"></i>
                        </button>
                    </form>

                    <p class="privacy-note">เราจะใช้อีเมลของคุณสำหรับข่าวสารจาก BookLoop เท่านั้น ไม่สแปม · ยกเลิกได้ทุกเมื่อ</p>
                </div>
            </section>

            <footer class="footer">
                <div class="footer-row">
                    <span class="footer-brand">BOOKLOOP®</span>
                    <span class="footer-meta">© 2026</span>
                </div>
            </footer>
        </div>

        <section class="dev-templates">
            <div class="dev-templates-head">
                <strong>ทดสอบเทมเพลตอีเมล</strong>
                <span class="meta-line">LIVE</span>
            </div>
            <div class="dev-templates-body">
                <a class="dev-btn" target="_blank" rel="noopener" href="preview.php?t=confirm">ยืนยันสมัคร</a>
                <a class="dev-btn" target="_blank" rel="noopener" href="preview.php?t=welcome">ต้อนรับ + NEW10</a>
                <a class="dev-btn" target="_blank" rel="noopener" href="preview.php?t=onboarding">Onboarding แนะนำ</a>
                <a class="dev-btn" target="_blank" rel="noopener" href="preview.php?t=order">ใบเสร็จคำสั่งซื้อ</a>
                <a class="dev-btn" target="_blank" rel="noopener" href="preview.php?t=cart">เตือนตะกร้า</a>
            </div>
            <p class="dev-templates-foot">แบนเนอร์ในพรีวิวดึงจากโฟลเดอร์ images — ตรงกับไฟล์แนบตอนส่งจริง</p>
        </section>
    </main>

    <script>
        if (window.lucide) { lucide.createIcons(); }

        const loading = document.getElementById('loading');
        const toast = document.getElementById('toast');

        function showToast(message, type = 'success') {
            const icon = type === 'success'
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1976D2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B42318" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>';
            toast.className = 'toast toast-' + type;
            toast.innerHTML = icon + '<span>' + message + '</span>';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }

        function switchTab(tab, focusTab = false) {
            document.querySelectorAll('.signup-option').forEach(btn => {
                const selected = btn.dataset.tab === tab;
                btn.classList.toggle('active', selected);
                btn.setAttribute('aria-selected', selected ? 'true' : 'false');
                btn.tabIndex = selected ? 0 : -1;
                if (selected && focusTab) { btn.focus(); }
            });

            document.getElementById('form-register').hidden = tab !== 'register';
            document.getElementById('form-subscription').hidden = tab !== 'subscription';
        }

        document.querySelector('.signup-type').addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') { return; }
            e.preventDefault();
            const next = document.getElementById('form-register').hidden ? 'register' : 'subscription';
            switchTab(next, true);
        });

        async function sendDemo(t) {
            const isRegister = !document.getElementById('form-register').hidden;
            const p = isRegister ? 'reg' : 'sub';
            const nameEl = document.getElementById(p + '-name');
            const emailEl = document.getElementById(p + '-email');
            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            if (!email) {
                showToast('กรอกอีเมลในฟอร์มก่อนส่ง demo', 'error');
                return;
            }
            const fd = new FormData();
            fd.append('t', t);
            fd.append('name', name);
            fd.append('email', email);
            if (!isRegister) {
                document.querySelectorAll('#form-subscription input[name="news_preferences[]"]:checked')
                    .forEach(cb => fd.append('preferences[]', cb.value));
            }
            loading.classList.add('active');
            try {
                const res = await fetch('preview.php?action=send', { method: 'POST', body: fd });
                const data = await res.json();
                showToast(
                    data.success ? 'ส่ง demo สำเร็จ — เช็ก inbox ได้เลย' : ('ส่งไม่สำเร็จ: ' + (data.error || 'ลองใหม่')),
                    data.success ? 'success' : 'error'
                );
            } catch (err) {
                console.error('[BookLoop][subscribe_form] sendDemo failed:', err);
                showToast('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
            } finally {
                loading.classList.remove('active');
            }
        }

        document.querySelectorAll('.form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                loading.classList.add('active');

                try {
                    const res = await fetch('sendMail.php', {
                        method: 'POST',
                        body: new FormData(form)
                    });
                    const text = await res.text();

                    if (text.includes('สมัครสำเร็จ')) {
                        showToast('สมัครสำเร็จ! ตรวจสอบอีเมลของคุณ', 'success');
                        form.reset();
                    } else if (text.includes('ไม่มีอีเมล')) {
                        showToast('กรุณากรอกอีเมลที่ถูกต้อง', 'error');
                    } else {
                        showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
                    }
                } catch (err) {
                    console.error('[BookLoop][subscribe_form] sendMail.php failed:', err);
                    showToast('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
                } finally {
                    loading.classList.remove('active');
                }
            });
        });
    </script>
</body>
</html>
