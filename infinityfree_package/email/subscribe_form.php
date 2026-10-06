<?php
$title = 'สมัครรับข่าวสาร - BookLoop';
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Noto Sans Thai"', 'Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
                    },
                    colors: {
                        ink: '#0B2A5B',
                        deep: '#0A4FC0',
                        accent: '#0F6CF0',
                        soft: '#EFF4FF',
                        paper: '#FFFFFF',
                        surface: '#EAF2FE',
                        muted: '#54749E',
                        line: '#C9DDF7',
                        strong: '#9DC2EE',
                        success: '#0F6CF0',
                        danger: '#B42318',
                    },
                },
            },
        }
    </script>
    <style>
        * { box-sizing: border-box; }

        body {
            font-family: 'Noto Sans Thai', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 32px 16px;
            background: #EAF2FE;
            color: #0B2A5B;
        }

        .eyebrow {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2.5px;
        }

        .input-field {
            transition: border-color 0.15s ease;
        }

        .input-field:hover {
            border-color: #9DC2EE;
        }

        .input-field:focus {
            border-color: #0B2A5B;
            outline: 2px solid #0B2A5B;
            outline-offset: -2px;
        }

        .btn-primary {
            transition: background 0.15s ease;
            border-radius: 6px;
        }

        .btn-primary:hover {
            background: #0A4FC0;
        }

        .btn-primary:active {
            background: #0B2A5B;
        }

        .checkbox-item {
            transition: border-color 0.15s ease, background 0.15s ease;
            border-radius: 6px;
        }

        .checkbox-item:hover {
            border-color: #0B2A5B;
        }

        .checkbox-item:has(input:checked) {
            border-color: #0B2A5B;
            background: #EFF4FF;
        }

        .checkbox-item input:checked + i {
            color: #0B2A5B;
        }

        .tab-btn {
            transition: all 0.15s ease;
            border-radius: 4px;
        }

        .tab-btn.active {
            background: #0F6CF0;
            color: #ffffff;
        }

        /* Loading overlay */
        .loading-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(234, 242, 254, 0.85);
            z-index: 100;
            place-items: center;
        }

        .loading-overlay.active {
            display: grid;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #C9DDF7;
            border-top-color: #0F6CF0;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Toast notification — Swiss rectangular */
        .toast {
            position: fixed;
            top: 24px;
            right: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 18px;
            border-radius: 6px;
            border-left: 4px solid #0B2A5B;
            font-size: 14px;
            font-weight: 600;
            color: #0B2A5B;
            background: #fff;
            border-top: 1px solid #C9DDF7;
            border-right: 1px solid #C9DDF7;
            border-bottom: 1px solid #C9DDF7;
            box-shadow: none;
            z-index: 200;
            transform: translateX(calc(100% + 32px));
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 380px;
        }

        .toast.show {
            transform: translateX(0);
        }

        .toast-success {
            border-left-color: #0F6CF0;
        }

        .toast-error {
            border-left-color: #B42318;
        }

        @media (max-width: 520px) {
            body { padding: 16px 12px; }
        }
    </style>
</head>
<body>
    <main class="w-full max-w-[480px]">
        <div class="loading-overlay" id="loading">
            <div class="spinner"></div>
        </div>
        <div class="toast" id="toast"></div>

        <div class="bg-paper border border-line rounded-[6px] overflow-hidden">
            <!-- Swiss top rule -->
            <div class="h-[6px] bg-accent"></div>

            <!-- Masthead -->
            <header class="px-7 pt-6 pb-5 border-b border-line">
                <div class="flex items-center justify-between">
                    <span class="text-[18px] font-extrabold tracking-tight text-ink" style="letter-spacing:-0.5px;">
                        BOOKLOOP<span class="text-accent">®</span>
                    </span>
                    <span class="eyebrow text-muted">NEWSLETTER / ฟอร์ม</span>
                </div>
            </header>

            <!-- Content -->
            <div class="px-7 py-7">
                <div class="eyebrow text-accent">BOOKLOOP — จดหมายข่าว</div>
                <h1 class="mt-2 text-[32px] leading-[1.15] font-extrabold text-ink tracking-tight" style="letter-spacing:-1px;">
                    สมัครรับ<br>ข่าวสาร.
                </h1>
                <p class="mt-3 text-sm text-muted leading-relaxed">
                    01 / หนังสือใหม่ &nbsp;&nbsp; 02 / โปรโมชั่น &nbsp;&nbsp; 03 / กิจกรรม
                </p>

                <!-- Tab Switcher — Swiss segmented -->
                <div class="mt-6 flex gap-1 p-1 bg-surface border border-line rounded-[6px]">
                    <button type="button" class="tab-btn active flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold" data-tab="register" onclick="switchTab('register')">
                        <i data-lucide="user-plus" class="w-4 h-4"></i>
                        สมาชิกใหม่
                    </button>
                    <button type="button" class="tab-btn flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-muted" data-tab="subscription" onclick="switchTab('subscription')">
                        <i data-lucide="mail-plus" class="w-4 h-4"></i>
                        รับข่าวสาร
                    </button>
                </div>

                <!-- Forms Container (equal height) -->
                <div class="mt-6 relative" style="min-height: 390px;">

                    <!-- Form 1: Register -->
                    <form class="form" id="form-register" method="POST" action="sendMail.php" style="display: block;">
                        <input type="hidden" name="form_type" value="register">

                        <div class="mb-2 text-[11px] font-bold text-muted" style="letter-spacing:2px;">01 — ข้อมูลผู้สมัคร</div>

                        <div class="mb-4">
                            <label class="block mb-2 text-xs font-bold text-ink" for="reg-name">ชื่อ-นามสกุล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="user" class="w-4 h-4 text-muted"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-line rounded-[6px] bg-paper text-ink text-[15px] placeholder:text-strong" type="text" id="reg-name" name="name" placeholder="กรอกชื่อของคุณ" autocomplete="name" required>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label class="block mb-2 text-xs font-bold text-ink" for="reg-email">อีเมล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="at-sign" class="w-4 h-4 text-muted"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-line rounded-[6px] bg-paper text-ink text-[15px] placeholder:text-strong" type="email" id="reg-email" name="email" placeholder="กรอกอีเมลของคุณ" autocomplete="email" required>
                            </div>
                        </div>

                        <button class="btn-primary w-full h-[50px] bg-accent text-white text-[15px] font-bold border-0 cursor-pointer flex items-center justify-center gap-2" type="submit">
                            สมัครสมาชิกใหม่
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </form>

                    <!-- Form 2: Subscription -->
                    <form class="form" id="form-subscription" method="POST" action="sendMail.php" style="display: none;">
                        <input type="hidden" name="form_type" value="subscription">

                        <div class="mb-2 text-[11px] font-bold text-muted" style="letter-spacing:2px;">01 — ข้อมูลผู้สมัคร</div>

                        <div class="mb-4">
                            <label class="block mb-2 text-xs font-bold text-ink" for="sub-name">ชื่อ-นามสกุล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="user" class="w-4 h-4 text-muted"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-line rounded-[6px] bg-paper text-ink text-[15px] placeholder:text-strong" type="text" id="sub-name" name="name" placeholder="กรอกชื่อของคุณ" autocomplete="name" required>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label class="block mb-2 text-xs font-bold text-ink" for="sub-email">อีเมล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="at-sign" class="w-4 h-4 text-muted"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-line rounded-[6px] bg-paper text-ink text-[15px] placeholder:text-strong" type="email" id="sub-email" name="email" placeholder="กรอกอีเมลของคุณ" autocomplete="email" required>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label class="block mb-2.5 text-[11px] font-bold text-muted" style="letter-spacing:2px;">02 — เลือกประเภทข่าวสาร</label>
                            <div class="grid grid-cols-2 gap-2.5">
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-line bg-paper cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="new_books" class="sr-only">
                                    <i data-lucide="book-marked" class="w-4 h-4 text-muted shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-ink">หนังสือใหม่</span>
                                </label>
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-line bg-paper cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="promotions" class="sr-only">
                                    <i data-lucide="tag" class="w-4 h-4 text-muted shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-ink">โปรโมชั่น</span>
                                </label>
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-line bg-paper cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="recommendations" class="sr-only">
                                    <i data-lucide="sparkles" class="w-4 h-4 text-muted shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-ink">หนังสือแนะนำ</span>
                                </label>
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-line bg-paper cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="events" class="sr-only">
                                    <i data-lucide="calendar-heart" class="w-4 h-4 text-muted shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-ink">กิจกรรม</span>
                                </label>
                            </div>
                        </div>

                        <button class="btn-primary w-full h-[50px] bg-accent text-white text-[15px] font-bold border-0 cursor-pointer flex items-center justify-center gap-2" type="submit">
                            สมัครรับข่าวสาร
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </form>

                </div>

                <p class="mt-5 pt-4 border-t border-line text-[11px] text-muted leading-relaxed">
                    เราจะใช้อีเมลของคุณสำหรับส่งข่าวสารจาก BookLoop เท่านั้น
                </p>
            </div>

            <!-- Footer dark -->
            <footer class="px-7 py-5 bg-ink">
                <div class="flex items-center justify-between">
                    <span class="text-[14px] font-extrabold text-white">BOOKLOOP<span class="text-accent">®</span></span>
                    <span class="text-[10px] text-muted">© 2026 BookLoop. All rights reserved.</span>
                </div>
            </footer>
        </div>
    </main>

    <script>
        lucide.createIcons();

        const loading = document.getElementById('loading');
        const toast = document.getElementById('toast');

        function showToast(message, type = 'success') {
            const icon = type === 'success'
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F6CF0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B42318" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>';
            toast.className = 'toast toast-' + type;
            toast.innerHTML = icon + '<span>' + message + '</span>';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-muted');
            });
            document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
            document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.remove('text-muted');

            document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
            document.getElementById('form-subscription').style.display = tab === 'subscription' ? 'block' : 'none';
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
