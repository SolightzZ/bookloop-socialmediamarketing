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
    <title>ยืนยันการสมัคร - BookLoop</title>
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
            top: 14.7%;
            left: 50%;
            width: 82%;
            transform: translateX(-50%);
            text-align: center;
            color: #167fea;
            font-size: clamp(24px, 4.6vw, 55px);
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: -1px;
            white-space: nowrap;
            z-index: 5;
            pointer-events: none;
        }

        /* ปุ่ม CTA */
        .button-link {
            position: absolute;
            left: 25.78%;
            top: 71.55%;
            width: 48.34%;
            height: 5.08%;
            display: block;
            background: transparent;
            border-radius: 999px;
            text-decoration: none;
            cursor: pointer;
            z-index: 10;
            outline: none;
        }

        .button-link:hover {
            background: rgba(8, 121, 239, 0.08);
        }

        .button-link:focus,
        .button-link:active {
            outline: none;
        }

        /* ปุ่ม Social */
        .social-link {
            position: absolute;
            display: block;
            width: 5.4%;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background: transparent;
            z-index: 20;
            text-decoration: none;
            cursor: pointer;
            outline: none;
        }

        .social-facebook { left: 37.7%; top: 89.6%; }
        .social-instagram { left: 45.0%; top: 89.6%; }
        .social-youtube { left: 52.3%; top: 89.6%; }
        .social-x { left: 59.6%; top: 89.6%; }

        .social-link:hover {
            background: rgba(8, 121, 239, 0.08);
        }

        .social-link:focus,
        .social-link:active {
            outline: none;
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            body { padding: 10px; }
            .email-card { border-radius: 16px; }
            .dynamic-name {
                top: 14.7%;
                width: 92%;
                font-size: clamp(18px, 5.8vw, 32px);
                letter-spacing: -0.5px;
            }
            .button-link {
                left: 25.78%;
                top: 71.55%;
                width: 48.34%;
                height: 5.08%;
            }
            .social-link { width: 5.8%; }
            .social-facebook { left: 37.7%; top: 89.6%; }
            .social-instagram { left: 45.0%; top: 89.6%; }
            .social-youtube { left: 52.3%; top: 89.6%; }
            .social-x { left: 59.6%; top: 89.6%; }
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
