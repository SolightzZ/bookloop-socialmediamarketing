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
    <style>
        :root {
            --navy: #12385f;
            --blue: #087cf1;
            --border: #dce8f3;
            --muted: #6d849d;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background: linear-gradient(180deg, #eef7ff 0%, #f8fbfd 100%);
            color: var(--navy);
            font-family: 'Sarabun', Arial, sans-serif;
        }

        .page {
            width: 100%;
            max-width: 470px;
        }

        .card {
            background: #ffffff;
            border: 1px solid var(--border);
            border-radius: 22px;
            overflow: hidden;
        }

        .header {
            padding: 32px 28px 26px;
            text-align: center;
            border-bottom: 1px solid #edf3f8;
        }

        .logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--navy);
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.8px;
        }

        .logo-mark {
            width: 42px;
            height: 42px;
            display: grid;
            place-items: center;
            border-radius: 12px;
            background: #eaf5ff;
            color: var(--blue);
            font-size: 21px;
        }

        .logo span {
            color: var(--blue);
        }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            margin-top: 18px;
            padding: 7px 12px;
            border: 1px solid #cfe5fa;
            border-radius: 999px;
            background: #f3f9ff;
            color: var(--blue);
            font-size: 12px;
            font-weight: 700;
        }

        .content {
            padding: 30px;
        }

        .title {
            color: var(--navy);
            font-size: clamp(30px, 7vw, 42px);
            line-height: 1.12;
            font-weight: 800;
            letter-spacing: -1px;
            text-align: center;
        }

        .title span {
            color: var(--blue);
        }

        .description {
            max-width: 360px;
            margin: 13px auto 0;
            color: var(--muted);
            font-size: 14px;
            line-height: 1.75;
            text-align: center;
        }

        .form {
            margin-top: 26px;
        }

        .field {
            margin-bottom: 16px;
        }

        .label {
            display: block;
            margin-bottom: 7px;
            color: var(--navy);
            font-size: 13px;
            font-weight: 700;
        }

        .input {
            width: 100%;
            height: 52px;
            padding: 0 15px;
            border: 1px solid var(--border);
            border-radius: 13px;
            outline: none;
            background: #fbfdff;
            color: #183f64;
            font-family: inherit;
            font-size: 15px;
            transition: border-color .18s ease;
        }

        .input::placeholder {
            color: #9aafc2;
        }

        .input:hover {
            border-color: #c6d9ea;
        }

        .input:focus {
            background: #ffffff;
            border-color: var(--blue);
        }

        .button {
            width: 100%;
            height: 52px;
            margin-top: 4px;
            border: 0;
            border-radius: 13px;
            background: linear-gradient(135deg, #0a82f6 0%, #086fd8 100%);
            color: #ffffff;
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: transform .18s ease;
        }

        .button:hover {
            transform: translateY(-1px);
        }

        .button:active {
            transform: translateY(0);
        }

        .note {
            margin-top: 12px;
            color: #8ba0b3;
            font-size: 11px;
            line-height: 1.6;
            text-align: center;
        }

        .footer {
            padding: 16px 22px;
            border-top: 1px solid #edf3f8;
            background: #f9fbfd;
            color: #9aabba;
            font-size: 11px;
            text-align: center;
        }

        @media (max-width: 520px) {
            body {
                padding: 14px;
            }

            .header {
                padding: 26px 20px 22px;
            }

            .content {
                padding: 24px 20px;
            }

            .logo {
                font-size: 24px;
            }

            .logo-mark {
                width: 38px;
                height: 38px;
                font-size: 19px;
            }

            .title {
                font-size: 32px;
            }
        }
    </style>
</head>
<body>
    <main class="page">
        <section class="card">
            <header class="header">
                <div class="logo">
                    <div class="logo-mark">📖</div>
                    <div>Book<span>Loop</span></div>
                </div>
                <div class="eyebrow">📬 Newsletter</div>
            </header>

            <div class="content">
                <h1 class="title">สมัครรับ<span>ข่าวสาร</span></h1>
                <p class="description">รับข่าวสาร หนังสือแนะนำ และโปรโมชั่นพิเศษจาก BookLoop</p>

                <form class="form" method="POST" action="sendMail.php">
                    <div class="field">
                        <label class="label" for="name">ชื่อ-นามสกุล</label>
                        <input class="input" type="text" id="name" name="name" placeholder="กรอกชื่อของคุณ" autocomplete="name" required>
                    </div>

                    <div class="field">
                        <label class="label" for="email">อีเมล</label>
                        <input class="input" type="email" id="email" name="email" placeholder="กรอกอีเมลของคุณ" autocomplete="email" required>
                    </div>

                    <button class="button" type="submit">สมัครรับข่าวสาร →</button>

                    <p class="note">เราจะใช้อีเมลของคุณสำหรับส่งข่าวสารจาก BookLoop เท่านั้น</p>
                </form>
            </div>

            <footer class="footer">© 2026 BookLoop. All rights reserved.</footer>
        </section>
    </main>
</body>
</html>
