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
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sarabun: ['Sarabun', 'Arial', 'sans-serif'],
                    },
                    colors: {
                        navy: '#12385f',
                        brand: {
                            50: '#eef7ff',
                            100: '#dceeff',
                            200: '#b3daff',
                            300: '#7abfff',
                            400: '#3a9fff',
                            500: '#087cf1',
                            600: '#086fd8',
                            700: '#0658ab',
                            800: '#0a4a8c',
                            900: '#0e3f73',
                        },
                    },
                },
            },
        }
    </script>
    <style>
        * { box-sizing: border-box; }

        body {
            font-family: 'Sarabun', Arial, sans-serif;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: linear-gradient(180deg, #eef7ff 0%, #f8fbfd 100%);
        }

        .input-field {
            transition: border-color 0.15s ease;
        }

        .input-field:hover {
            border-color: #9abdd4;
        }

        .input-field:focus {
            border-color: #087cf1;
            outline: none;
        }

        .btn-primary {
            transition: border-color 0.15s ease, background 0.15s ease;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #086fd8 0%, #0658ab 100%);
        }

        .btn-primary:active {
            background: linear-gradient(135deg, #0658ab 0%, #0a4a8c 100%);
        }

        .checkbox-item {
            transition: border-color 0.15s ease, background 0.15s ease;
        }

        .checkbox-item:hover {
            border-color: #9abdd4;
        }

        .checkbox-item:has(input:checked) {
            border-color: #087cf1;
            background: #f0f7ff;
        }

        .checkbox-item input:checked + i {
            color: #087cf1;
        }

        .tab-btn {
            transition: all 0.15s ease;
        }

        .tab-btn.active {
            background: #087cf1;
            color: #ffffff;
        }

        /* Loading overlay */
        .loading-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(4px);
            z-index: 100;
            place-items: center;
        }

        .loading-overlay.active {
            display: grid;
        }

        .spinner {
            width: 44px;
            height: 44px;
            border: 4px solid #e0e7ef;
            border-top-color: #087cf1;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Toast notification */
        .toast {
            position: fixed;
            top: 24px;
            right: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 20px;
            border-radius: 12px;
            font-family: 'Sarabun', Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            z-index: 200;
            transform: translateX(calc(100% + 32px));
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 380px;
        }

        .toast.show {
            transform: translateX(0);
        }

        .toast-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .toast-error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        @media (max-width: 520px) {
            body { padding: 12px; }
        }
    </style>
</head>
<body>
    <main class="w-full max-w-[460px]">
        <div class="loading-overlay" id="loading">
            <div class="spinner"></div>
        </div>
        <div class="toast" id="toast"></div>

        <div class="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(25,90,160,0.08)]">

            <!-- Header -->
            <header class="px-7 pt-8 pb-6 text-center border-b border-gray-100">
                <div class="inline-flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center">
                        <i data-lucide="book-open" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[26px] font-extrabold tracking-tight text-navy">
                        Book<span class="text-brand-500">Loop</span>
                    </span>
                </div>
                <div class="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-500 text-xs font-bold">
                    <i data-lucide="mail" class="w-3.5 h-3.5"></i>
                    Newsletter
                </div>
            </header>

            <!-- Content -->
            <div class="px-7 py-7">
                <h1 class="text-[34px] leading-tight font-extrabold text-navy text-center tracking-tight">
                    สมัครรับ<span class="text-brand-500">ข่าวสาร</span>
                </h1>
                <p class="mt-3 text-sm text-gray-400 text-center leading-relaxed max-w-[340px] mx-auto">
                    รับข่าวสาร หนังสือแนะนำ และโปรโมชั่นพิเศษจาก BookLoop
                </p>

                <!-- Tab Switcher -->
                <div class="mt-6 flex gap-2 p-1 bg-gray-50 rounded-xl">
                    <button type="button" class="tab-btn active flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold" data-tab="register" onclick="switchTab('register')">
                        <i data-lucide="user-plus" class="w-4 h-4"></i>
                        สมัครสมาชิกใหม่
                    </button>
                    <button type="button" class="tab-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-gray-400" data-tab="subscription" onclick="switchTab('subscription')">
                        <i data-lucide="mail-plus" class="w-4 h-4"></i>
                        สมัครรับข่าวสาร
                    </button>
                </div>

                <!-- Forms Container (equal height) -->
                <div class="mt-6 relative" style="min-height: 390px;">

                    <!-- Form 1: Register -->
                    <form class="form" id="form-register" method="POST" action="sendMail.php" style="display: block;">
                        <input type="hidden" name="form_type" value="register">

                        <div class="mb-4">
                            <label class="block mb-2 text-xs font-bold text-navy" for="reg-name">ชื่อ-นามสกุล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="user" class="w-4 h-4 text-gray-300"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-navy text-[15px] font-sarabun placeholder:text-gray-300" type="text" id="reg-name" name="name" placeholder="กรอกชื่อของคุณ" autocomplete="name" required>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label class="block mb-2 text-xs font-bold text-navy" for="reg-email">อีเมล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="at-sign" class="w-4 h-4 text-gray-300"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-navy text-[15px] font-sarabun placeholder:text-gray-300" type="email" id="reg-email" name="email" placeholder="กรอกอีเมลของคุณ" autocomplete="email" required>
                            </div>
                        </div>

                        <button class="btn-primary w-full h-[50px] rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[15px] font-bold border-0 cursor-pointer flex items-center justify-center gap-2" type="submit">
                            สมัครสมาชิกใหม่
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </form>

                    <!-- Form 2: Subscription -->
                    <form class="form" id="form-subscription" method="POST" action="sendMail.php" style="display: none;">
                        <input type="hidden" name="form_type" value="subscription">

                        <div class="mb-4">
                            <label class="block mb-2 text-xs font-bold text-navy" for="sub-name">ชื่อ-นามสกุล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="user" class="w-4 h-4 text-gray-300"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-navy text-[15px] font-sarabun placeholder:text-gray-300" type="text" id="sub-name" name="name" placeholder="กรอกชื่อของคุณ" autocomplete="name" required>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label class="block mb-2 text-xs font-bold text-navy" for="sub-email">อีเมล</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <i data-lucide="at-sign" class="w-4 h-4 text-gray-300"></i>
                                </div>
                                <input class="input-field w-full h-[50px] pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 text-navy text-[15px] font-sarabun placeholder:text-gray-300" type="email" id="sub-email" name="email" placeholder="กรอกอีเมลของคุณ" autocomplete="email" required>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label class="block mb-2.5 text-xs font-bold text-navy">เลือกประเภทข่าวสาร</label>
                            <div class="grid grid-cols-2 gap-2.5">
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="new_books" class="sr-only">
                                    <i data-lucide="book-marked" class="w-4 h-4 text-gray-300 shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-navy">หนังสือใหม่</span>
                                </label>
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="promotions" class="sr-only">
                                    <i data-lucide="tag" class="w-4 h-4 text-gray-300 shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-navy">โปรโมชั่น</span>
                                </label>
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="recommendations" class="sr-only">
                                    <i data-lucide="sparkles" class="w-4 h-4 text-gray-300 shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-navy">หนังสือแนะนำ</span>
                                </label>
                                <label class="checkbox-item flex items-center gap-2.5 px-3.5 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer">
                                    <input type="checkbox" name="news_preferences[]" value="events" class="sr-only">
                                    <i data-lucide="calendar-heart" class="w-4 h-4 text-gray-300 shrink-0"></i>
                                    <span class="text-[13px] font-semibold text-navy">กิจกรรม</span>
                                </label>
                            </div>
                        </div>

                        <button class="btn-primary w-full h-[50px] rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[15px] font-bold border-0 cursor-pointer flex items-center justify-center gap-2" type="submit">
                            สมัครรับข่าวสาร
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </form>

                </div>

                <p class="mt-5 text-[11px] text-gray-400 text-center leading-relaxed">
                    เราจะใช้อีเมลของคุณสำหรับส่งข่าวสารจาก BookLoop เท่านั้น
                </p>
            </div>

            <!-- Footer -->
            <footer class="px-6 py-4 border-t border-gray-100 bg-gray-50 text-center">
                <p class="text-[11px] text-gray-400">&copy; 2026 BookLoop. All rights reserved.</p>
            </footer>
        </div>
    </main>

    <script>
        lucide.createIcons();

        const loading = document.getElementById('loading');
        const toast = document.getElementById('toast');

        function showToast(message, type = 'success') {
            const icon = type === 'success'
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>';
            toast.className = 'toast toast-' + type;
            toast.innerHTML = icon + '<span>' + message + '</span>';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-400');
            });
            document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
            document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.remove('text-gray-400');

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
                } catch {
                    showToast('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
                } finally {
                    loading.classList.remove('active');
                }
            });
        });
    </script>
</body>
</html>
