<?php
$name = $name ?? 'ผู้ใช้งาน';
$safeName = htmlspecialchars(trim($name), ENT_QUOTES, 'UTF-8');

$bookloopUrl = 'https://panitijahem.xo.je/app';
$fontThai = "'Noto Sans Thai','Inter','Helvetica Neue',Helvetica,Arial,sans-serif";
$fontLatin = "Arial,Helvetica,sans-serif";
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
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>ยืนยันการสมัครรับข่าวสาร - BookLoop</title>
    <style>
        :root { color-scheme: light only; supported-color-schemes: light only; }
    </style>
</head>
<body style="margin:0;padding:0;background:#F8FBFF;font-family:<?= $fontThai ?>;">
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
                                <td style="color:#0B2A5B;font-family:<?= $fontLatin ?>;font-size:18px;font-weight:800;letter-spacing:-0.5px;"><img src="cid:logo_image" alt="BookLoop" width="28" height="28" style="display:inline-block;width:28px;height:28px;vertical-align:-6px;margin-right:8px;border:0;">BOOKLOOP<span style="color:#0F6CF0;">®</span></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px 28px 20px;background:#FFFFFF;">
                        <div style="margin:0;color:#0F6CF0;font-family:<?= $fontLatin ?>;font-size:11px;font-weight:700;letter-spacing:2.5px;line-height:1.5;">SUBSCRIPTION CONFIRMED — สมัครสำเร็จ</div>
                        <div style="margin:10px 0 0;color:#0B2A5B;font-family:<?= $fontThai ?>;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1.15;">ยินดีต้อนรับ<br>คุณ “<?= $safeName ?>”</div>
                        <div style="margin:10px 0 0;color:#54749E;font-family:<?= $fontThai ?>;font-size:14px;line-height:1.65;">เราได้รับการสมัครรับข่าวสารจากคุณเรียบร้อยแล้ว คุณจะได้รับหนังสือแนะนำและโปรโมชั่นพิเศษทางอีเมล</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 28px 28px;background:#FFFFFF;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #C9DDF7;border-radius:6px;">
                            <tr>
                                <td style="padding:0;font-size:0;line-height:0;"><img src="cid:confirm_image" alt="BookLoop Confirmation" width="576" style="display:block;width:100%;height:auto;margin:0;padding:0;border:0;border-radius:6px;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding:0 28px 32px;background:#FFFFFF;">
                        <a href="<?= $bookloopUrl ?>" style="display:inline-block;padding:14px 28px;background:#0F6CF0;color:#FFFFFF;text-decoration:none;border-radius:6px;font-family:<?= $fontThai ?>;font-size:14px;font-weight:700;line-height:1.2;">เริ่มค้นหาหนังสือเลย →</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px 28px 28px;background:#0B2A5B;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="color:#FFFFFF;font-family:<?= $fontLatin ?>;font-size:18px;font-weight:800;">BOOKLOOP<span style="color:#0F6CF0;">®</span></td>
                            </tr>
                            <tr><td colspan="2" style="padding-top:14px;border-bottom:1px solid #1E2A3D;font-size:0;line-height:0;">&nbsp;</td></tr>
                            <tr>
                                <td style="padding-top:14px;color:#A8B3C7;font-family:<?= $fontThai ?>;font-size:12px;">หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ</td>
                                <td style="padding-top:14px;text-align:right;">
                                    <a href="<?= $socialLinks['facebook'] ?>" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="Facebook">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                    </a>
                                    <a href="<?= $socialLinks['instagram'] ?>" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="Instagram">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    </a>
                                    <a href="<?= $socialLinks['youtube'] ?>" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="YouTube">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0B2A5B"></polygon></svg>
                                    </a>
                                    <a href="<?= $socialLinks['x'] ?>" style="color:#FFFFFF;text-decoration:none;margin-left:8px;" title="X">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                    </a>
                                </td>
                            </tr>
                            <tr><td colspan="2" style="padding-top:12px;color:#54749E;font-family:<?= $fontLatin ?>;font-size:10px;">© 2026 BookLoop. All rights reserved.</td></tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
