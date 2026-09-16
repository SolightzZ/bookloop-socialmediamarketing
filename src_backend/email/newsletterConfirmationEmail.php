<?php
$name = $name ?? 'ผู้ใช้งาน';
$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

$socialLinks = [
    'facebook'  => 'https://facebook.com/',
    'instagram' => 'https://instagram.com/',
    'youtube'   => 'https://youtube.com/',
    'x'         => 'https://x.com/',
];
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ยืนยันการสมัครรับข่าวสาร - BookLoop</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        body {
            min-height: 100vh;
            padding: 30px 15px;
            background: #eef8ff;
            font-family: 'Sarabun', Tahoma, Arial, sans-serif;
        }

        .email-card {
            position: relative;
            width: 100%;
            max-width: 1024px;
            margin: 0 auto;
            overflow: hidden;
            border-radius: 24px;
            background: #ffffff;
            box-shadow: 0 10px 40px rgba(25, 90, 160, 0.12);
        }

        .welcome-image {
            position: relative;
            width: 100%;
            line-height: 0;
        }

        .welcome-image img {
            display: block;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            border: 0;
        }

        /* ชื่อลูกค้า */
        .dynamic-name {
            position: absolute;
            top: 14.2%;
            left: 50%;
            width: 80%;
            transform: translateX(-50%);
            text-align: center;
            color: #1a3a6b;
            font-size: clamp(22px, 4.2vw, 52px);
            line-height: 1.15;
            font-weight: 800;
            letter-spacing: -1px;
            white-space: nowrap;
            z-index: 5;
            pointer-events: none;
            text-shadow: 0 1px 2px rgba(255,255,255,0.6);
        }

        /* ปุ่ม CTA */
        .button-link {
            position: absolute;
            left: 24%;
            top: 71.8%;
            width: 52%;
            height: 4.8%;
            display: block;
            background: transparent;
            border-radius: 999px;
            text-decoration: none;
            cursor: pointer;
            z-index: 10;
            outline: none;
            transition: background 0.2s;
        }

        .button-link:hover {
            background: rgba(8, 121, 239, 0.1);
        }

        .button-link:focus,
        .button-link:active {
            outline: none;
        }

        /* ปุ่ม Social */
        .social-link {
            position: absolute;
            display: block;
            width: 5.2%;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background: transparent;
            z-index: 20;
            text-decoration: none;
            cursor: pointer;
            outline: none;
            transition: background 0.2s;
        }

        .social-facebook { left: 37.5%; top: 89.4%; }
        .social-instagram { left: 44.8%; top: 89.4%; }
        .social-youtube { left: 52.1%; top: 89.4%; }
        .social-x { left: 59.4%; top: 89.4%; }

        .social-link:hover {
            background: rgba(8, 121, 239, 0.1);
        }

        .social-link:focus,
        .social-link:active {
            outline: none;
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            body { padding: 8px; }
            .email-card { border-radius: 16px; }
            .dynamic-name {
                top: 14.2%;
                width: 90%;
                font-size: clamp(16px, 5.5vw, 30px);
                letter-spacing: -0.5px;
            }
            .button-link {
                left: 24%;
                top: 71.8%;
                width: 52%;
                height: 4.8%;
            }
            .social-link { width: 5.6%; }
            .social-facebook { left: 37.5%; top: 89.4%; }
            .social-instagram { left: 44.8%; top: 89.4%; }
            .social-youtube { left: 52.1%; top: 89.4%; }
            .social-x { left: 59.4%; top: 89.4%; }
        }
    </style>
</head>
<body>
    <div class="email-card">
        <div class="welcome-image">
            <img src="cid:welcome_image" alt="BookLoop Welcome">
            <div class="dynamic-name">"<?= $safeName ?>"</div>
            <a href="http://localhost:3000" class="button-link" aria-label="เริ่มค้นหาหนังสือเลย"></a>
            <a href="<?= $socialLinks['facebook'] ?>" class="social-link social-facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook"></a>
            <a href="<?= $socialLinks['instagram'] ?>" class="social-link social-instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram"></a>
            <a href="<?= $socialLinks['youtube'] ?>" class="social-link social-youtube" target="_blank" rel="noopener noreferrer" aria-label="YouTube"></a>
            <a href="<?= $socialLinks['x'] ?>" class="social-link social-x" target="_blank" rel="noopener noreferrer" aria-label="X"></a>
        </div>
    </div>
</body>
</html>
