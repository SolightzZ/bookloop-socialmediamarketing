<?php

$name = $name ?? 'ผู้ใช้งาน';
$safeName = htmlspecialchars(trim($name), ENT_QUOTES, 'UTF-8');

$bookloopUrl  = 'http://localhost:3000';
$facebookUrl  = 'https://facebook.com/';
$instagramUrl = 'https://instagram.com/';
$youtubeUrl   = 'https://youtube.com/';
$xUrl         = 'https://x.com/';

$bodyContent = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ยินดีต้อนรับสู่ BookLoop</title>
</head>
<body style="margin:0;padding:0;background:#eef8ff;font-family:Arial,'Noto Sans Thai',Tahoma,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:28px 0;background:#eef8ff;">
    <tr>
        <td align="center">
            <table role="presentation" width="1024" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:1024px;margin:0 auto;background:#ffffff;">

                <tr>
                    <td align="center" style="padding:0;margin:0;font-size:0;line-height:0;">
                        <img src="cid:welcome_image" alt="BookLoop Welcome" width="1024" style="display:block;width:100%;max-width:1024px;height:auto;margin:0;padding:0;border:0;">
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding:24px 20px 10px;background:#ffffff;">
                        <div style="margin:0;color:#5f7894;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:15px;font-weight:600;line-height:1.5;">
                            เรายินดีที่ได้รู้จักคุณ
                        </div>
                        <div style="margin:5px 0 0;color:#087cf1;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:28px;font-weight:800;line-height:1.3;">
                            "คุณ {$safeName}"
                        </div>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding:6px 40px 4px;background:#ffffff;">
                        <table role="presentation" width="60%" cellpadding="0" cellspacing="0" border="0" style="width:60%;max-width:520px;">
                            <tr>
                                <td style="border-top:1px solid #dce8f3;font-size:0;line-height:0;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding:18px 20px 10px;background:#ffffff;">
                        <a href="{$bookloopUrl}" style="display:inline-block;padding:14px 38px;border-radius:999px;background:#087cf1;color:#ffffff;text-decoration:none;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:16px;font-weight:700;line-height:1.2;">
                            เริ่มค้นหาหนังสือเลย&nbsp; →
                        </a>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding:2px 20px 20px;background:#ffffff;">
                        <p style="margin:0;color:#6f87a0;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:13px;line-height:1.7;">
                            ขอบคุณที่ร่วมเดินทางไปกับ BookLoop 💙
                        </p>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding:24px 20px 28px;background:#f8fbff;border-top:1px solid #e6eef6;">
                        <div style="color:#123b67;font-family:Arial,'Noto Sans Thai',Tahoma,sans-serif;font-size:23px;font-weight:800;line-height:1.2;">
                            📖 Book<span style="color:#087cf1;">Loop</span>
                        </div>
                        <div style="margin-top:7px;color:#8aa0b5;font-family:Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:3px;line-height:1.5;">
                            BE PART OF OUR BOOK JOURNEY
                        </div>

                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0;">
                            <tr>
                                <td style="padding:0 5px;">
                                    <a href="{$facebookUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;font-family:Arial,sans-serif;font-size:19px;font-weight:700;">f</a>
                                </td>
                                <td style="padding:0 5px;">
                                    <a href="{$instagramUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;font-family:Arial,sans-serif;font-size:18px;font-weight:700;">◎</a>
                                </td>
                                <td style="padding:0 5px;">
                                    <a href="{$youtubeUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;font-family:Arial,sans-serif;font-size:16px;font-weight:700;">▶</a>
                                </td>
                                <td style="padding:0 5px;">
                                    <a href="{$xUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;font-family:Arial,sans-serif;font-size:17px;font-weight:700;">𝕏</a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:17px 0 0;color:#7189a1;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:12px;line-height:1.6;">
                            หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ
                        </p>
                        <p style="margin:8px 0 0;color:#a2b0bd;font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">
                            © 2026 BookLoop. All rights reserved.
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
HTML;

echo $bodyContent;
