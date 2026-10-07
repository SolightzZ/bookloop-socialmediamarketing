<?php

$name = $name ?? 'ผู้ใช้งาน';
$safeName = htmlspecialchars(trim($name), ENT_QUOTES, 'UTF-8');

$bookloopUrl  = 'https://panitijahem.xo.je/app';
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
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>ยินดีต้อนรับสู่ BookLoop</title>
    <style>
        :root { color-scheme: light only; supported-color-schemes: light only; }
    </style>
</head>
<body style="margin:0;padding:0;background:#F8FBFF;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:32px 16px;background:#F8FBFF;">
    <tr>
        <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #C9DDF7;border-radius:6px;overflow:hidden;">

                <tr>
                    <td style="background:#0F6CF0;font-size:0;line-height:0;height:4px;">&nbsp;</td>
                </tr>

                <tr>
                    <td style="padding:20px 28px;background:#FFFFFF;border-bottom:1px solid #C9DDF7;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;">
                                    <img src="cid:logo_image" alt="BookLoop" width="28" height="28" style="display:inline-block;width:28px;height:28px;vertical-align:-6px;margin-right:8px;border:0;">BOOKLOOP<span style="color:#0F6CF0;">®</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:32px 28px 20px;background:#FFFFFF;">
                        <div style="margin:0;color:#0F6CF0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;line-height:1.5;">
                            WELCOME — เรายินดีที่ได้รู้จักคุณ
                        </div>
                        <div style="margin:10px 0 0;color:#0B2A5B;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1.2;">
                            "คุณ {$safeName}"
                        </div>
                        <div style="margin:10px 0 0;color:#54749E;font-family:'Noto Sans Thai','Inter',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;">
                            ขอบคุณที่ร่วมเดินทางไปกับ BookLoop — หนังสือแนะนำและโปรโมชั่นพิเศษกำลังจะถึงกล่องจดหมายของคุณ
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding:20px 28px 28px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #C9DDF7;border-radius:6px;">
                            <tr>
                                <td style="padding:0;font-size:0;line-height:0;">
                                    <img src="cid:welcome_image" alt="BookLoop Welcome" width="576" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;border-radius:6px 6px 0 0;">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="left" style="padding:0 28px 10px;background:#FFFFFF;">
                        <a href="{$bookloopUrl}" style="display:inline-block;padding:14px 28px;background:#0F6CF0;color:#FFFFFF;text-decoration:none;border-radius:6px;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.2;">
                            เริ่มค้นหาหนังสือเลย&nbsp; →
                        </a>
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px 28px;background:#FFFFFF;">
                        <div style="padding:16px 20px;background:#F0FDF4;border:2px dashed #16A34A;border-radius:8px;text-align:center;">
                            <div style="color:#166534;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                                สิทธิพิเศษต้อนรับสมาชิกใหม่ &bull; ลด 10%
                            </div>
                            <div style="margin:8px 0;color:#15803D;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:900;letter-spacing:3px;">NEW10</div>
                            <div style="color:#166534;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;">ใช้เป็นส่วนลด 10% สำหรับการสั่งซื้อครั้งแรกที่ BookLoop</div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="padding:14px 28px 28px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding-top:14px;border-top:1px solid #C9DDF7;color:#54749E;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;">
                                    หนังสือใหม่ &nbsp;&bull;&nbsp; โปรโมชั่น &nbsp;&bull;&nbsp; หนังสือแนะนำประจำสัปดาห์
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:24px 28px 28px;background:#0B2A5B;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;">
                                    BOOKLOOP<span style="color:#0F6CF0;">®</span>
                                </td>
                                <td style="text-align:right;color:#A8B3C7;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;">
                                    BE PART OF OUR BOOK JOURNEY
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:14px;border-bottom:1px solid #1E2A3D;font-size:0;line-height:0;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding-top:14px;color:#A8B3C7;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
                                    หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ
                                </td>
                                <td style="padding-top:14px;text-align:right;">
                                    <a href="{$facebookUrl}" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="Facebook">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                    </a>
                                    <a href="{$instagramUrl}" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="Instagram">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    </a>
                                    <a href="{$youtubeUrl}" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="YouTube">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0B2A5B"></polygon></svg>
                                    </a>
                                    <a href="{$xUrl}" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="X">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding-top:12px;color:#54749E;font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">
                                    © 2026 BookLoop. All rights reserved.
                                </td>
                            </tr>
                        </table>
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
