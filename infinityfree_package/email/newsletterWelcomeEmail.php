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
    <title>ยินดีต้อนรับสู่ BookLoop</title>
</head>
<body style="margin:0;padding:0;background:#EAF2FE;font-family:'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:32px 16px;background:#EAF2FE;">
    <tr>
        <td align="center">
            <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #C9DDF7;border-radius:6px;overflow:hidden;">

                <tr>
                    <td style="background:#0F6CF0;font-size:0;line-height:0;height:6px;">&nbsp;</td>
                </tr>

                <tr>
                    <td style="padding:18px 32px;background:#FFFFFF;border-bottom:1px solid #C9DDF7;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#0B2A5B;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.5px;">
                                    BOOKLOOP<span style="color:#0F6CF0;">®</span>
                                </td>
                                <td style="text-align:right;color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;">
                                    NEWSLETTER / ต้อนรับ
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:32px 32px 8px;background:#FFFFFF;">
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
                    <td style="padding:20px 32px 28px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #C9DDF7;border-radius:6px;">
                            <tr>
                                <td style="padding:0;font-size:0;line-height:0;">
                                    <img src="cid:welcome_image" alt="BookLoop Welcome" width="576" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;border-radius:6px 6px 0 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 14px;border-top:1px solid #C9DDF7;color:#54749E;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:600;letter-spacing:1.5px;">
                                    FIG. 01 — BOOKLOOP WELCOME
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="left" style="padding:0 32px 10px;background:#FFFFFF;">
                        <a href="{$bookloopUrl}" style="display:inline-block;padding:14px 28px;background:#0F6CF0;color:#FFFFFF;text-decoration:none;border-radius:6px;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.2;">
                            เริ่มค้นหาหนังสือเลย&nbsp; →
                        </a>
                    </td>
                </tr>

                <tr>
                    <td style="padding:14px 32px 28px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding-top:14px;border-top:1px solid #C9DDF7;color:#54749E;font-family:'Noto Sans Thai',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;">
                                    01 / หนังสือใหม่ &nbsp;&nbsp; 02 / โปรโมชั่น &nbsp;&nbsp; 03 / หนังสือแนะนำ
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:24px 32px 28px;background:#0B2A5B;">
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
                                    <a href="{$facebookUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">&nbsp;f&nbsp;</a>
                                    <a href="{$instagramUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">&nbsp;◎&nbsp;</a>
                                    <a href="{$youtubeUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;">&nbsp;▶&nbsp;</a>
                                    <a href="{$xUrl}" style="color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;">&nbsp;𝕏&nbsp;</a>
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
