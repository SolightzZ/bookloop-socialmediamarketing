<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/vendor/autoload.php';
require_once __DIR__ . '/BackgroundMail.php';

function sendWelcomeEmailService(string $to, string $userName): array
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        // Fail fast ก่อนถึง max_execution_time ของ PHP (default ของ PHPMailer คือ 300s ทำให้ fatal timeout)
        $mail->Timeout = MAIL_TIMEOUT;

        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        if (empty($userName) || $userName === 'สมาชิก BookLoop') {
            $userName = $to;
        }

        $safeName = htmlspecialchars(trim($userName), ENT_QUOTES, 'UTF-8');
        $displayName = (filter_var($userName, FILTER_VALIDATE_EMAIL) || str_contains($userName, '@'))
            ? $safeName
            : "คุณ {$safeName}";

        $bookloopUrl = 'https://panitijahem.xo.je/app';

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'ยินดีต้อนรับสู่ BookLoop';
        $mail->Body = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#eef8ff;font-family:Arial,'Noto Sans Thai',Tahoma,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:28px 0;background:#eef8ff;">
    <tr><td align="center">
        <table role="presentation" width="1024" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:1024px;margin:0 auto;background:#ffffff;">
            <tr><td align="center" style="padding:0;margin:0;font-size:0;line-height:0;">
                <img src="cid:welcome_image" alt="BookLoop Welcome" width="1024" style="display:block;width:100%;max-width:1024px;height:auto;margin:0;padding:0;border:0;">
            </td></tr>
            <tr><td align="center" style="padding:24px 20px 10px;background:#ffffff;">
                <div style="margin:0;color:#5f7894;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:15px;font-weight:600;line-height:1.5;">เรายินดีที่ได้รู้จักคุณ</div>
                <div style="margin:5px 0 0;color:#087cf1;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:28px;font-weight:800;line-height:1.3;">"{$displayName}"</div>
            </td></tr>
            <tr><td align="center" style="padding:18px 20px 10px;background:#ffffff;">
                <a href="{$bookloopUrl}" style="display:inline-block;padding:14px 38px;border-radius:999px;background:#087cf1;color:#ffffff;text-decoration:none;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:16px;font-weight:700;line-height:1.2;">เริ่มค้นหาหนังสือเลย&nbsp; →</a>
            </td></tr>
            <tr><td align="center" style="padding:10px 24px;background:#ffffff;">
                <div style="max-width:440px;margin:0 auto;padding:16px 20px;background:#f0fdf4;border:2px dashed #16a34a;border-radius:12px;text-align:center;">
                    <div style="color:#166534;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:13px;font-weight:700;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                        ของขวัญต้อนรับสมาชิกใหม่ &bull; ลดทันที 10%
                    </div>
                    <div style="margin:8px 0;color:#15803d;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:3px;">NEW10</div>
                    <div style="color:#166534;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:12px;">กรอกโค้ดนี้ที่หน้าชำระเงินเพื่อรับส่วนลด 10% สำหรับคำสั่งซื้อแรก</div>
                </div>
            </td></tr>
            <tr><td align="center" style="padding:2px 20px 20px;background:#ffffff;">
                <p style="margin:0;color:#6f87a0;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:13px;line-height:1.7;">ขอบคุณที่ร่วมเดินทางไปกับ BookLoop</p>
            </td></tr>
            <tr><td align="center" style="padding:24px 20px 28px;background:#f8fbff;border-top:1px solid #e6eef6;">
                <div style="color:#123b67;font-family:Arial,'Noto Sans Thai',Tahoma,sans-serif;font-size:23px;font-weight:800;line-height:1.2;">BOOKLOOP<span style="color:#087cf1;">.</span></div>
                <div style="margin-top:7px;color:#8aa0b5;font-family:Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:3px;line-height:1.5;">BE PART OF OUR BOOK JOURNEY</div>
                <p style="margin:17px 0 0;color:#7189a1;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:12px;line-height:1.6;">หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ</p>
                <p style="margin:8px 0 0;color:#a2b0bd;font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">© 2026 BookLoop. All rights reserved.</p>
            </td></tr>
        </table>
    </td></tr>
</table>
</body>
</html>
HTML;

        // banner ใหญ่เกิน 300KB ถูกข้ามอัตโนมัติ (กัน SMTP ช้า/timeout)
        embedImageCapped($mail, IMAGES_PATH . '/welcome.png', 'welcome_image');
        $mail->send();

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        error_log("[BookLoop][ERROR] sendWelcomeEmailService failed: " . ($mail->ErrorInfo ?: $e->getMessage()) . " to={$to}");
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

function sendConfirmationEmailService(string $to, string $userName): array
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        // Fail fast ก่อนถึง max_execution_time ของ PHP (default ของ PHPMailer คือ 300s ทำให้ fatal timeout)
        $mail->Timeout = MAIL_TIMEOUT;

        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        if (empty($userName) || $userName === 'สมาชิก BookLoop') {
            $userName = $to;
        }

        $safeName = htmlspecialchars(trim($userName), ENT_QUOTES, 'UTF-8');
        $displayName = (filter_var($userName, FILTER_VALIDATE_EMAIL) || str_contains($userName, '@'))
            ? $safeName
            : "คุณ {$safeName}";

        $bookloopUrl = 'https://panitijahem.xo.je/app';
        $facebookUrl = 'https://facebook.com/';
        $instagramUrl = 'https://instagram.com/';
        $youtubeUrl = 'https://youtube.com/';
        $xUrl = 'https://x.com/';

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'ยืนยันการสมัครรับข่าวสาร - BookLoop';
        $mail->Body = <<<HTML
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#eef8ff;font-family:'Sarabun',Arial,'Noto Sans Thai',Tahoma,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0;padding:28px 0;background:#eef8ff;">
    <tr><td align="center">
        <table role="presentation" width="1024" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:1024px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(25,90,160,0.12);">
            <tr><td align="center" style="padding:0;margin:0;font-size:0;line-height:0;">
                <img src="cid:welcome_image" alt="BookLoop Confirmation" width="1024" style="display:block;width:100%;max-width:1024px;height:auto;margin:0;padding:0;border:0;">
            </td></tr>
            <tr><td align="center" style="padding:30px 40px 10px;background:#ffffff;">
                <div style="margin:0;color:#5f7894;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:15px;font-weight:600;line-height:1.5;">ขอบคุณที่สมัครรับข่าวสาร</div>
                <div style="margin:5px 0 0;color:#087cf1;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:28px;font-weight:800;line-height:1.3;">"{$displayName}"</div>
            </td></tr>
            <tr><td align="center" style="padding:10px 40px;background:#ffffff;">
                <p style="margin:0;color:#6f87a0;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:14px;line-height:1.7;text-align:center;">
                    เราได้รับการสมัครรับข่าวสารจากคุณเรียบร้อยแล้ว<br>
                    คุณจะได้รับข่าวสาร หนังสือแนะนำ และโปรโมชั่นพิเศษจาก BookLoop ทางอีเมล
                </p>
            </td></tr>
            <tr><td align="center" style="padding:18px 20px 10px;background:#ffffff;">
                <a href="{$bookloopUrl}" style="display:inline-block;padding:14px 38px;border-radius:999px;background:#087cf1;color:#ffffff;text-decoration:none;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:16px;font-weight:700;line-height:1.2;">เริ่มค้นหาหนังสือเลย&nbsp; →</a>
            </td></tr>
            <tr><td align="center" style="padding:24px 20px 28px;background:#f8fbff;border-top:1px solid #e6eef6;">
                <div style="color:#123b67;font-family:Arial,'Noto Sans Thai',Tahoma,sans-serif;font-size:23px;font-weight:800;line-height:1.2;">BOOKLOOP<span style="color:#087cf1;">.</span></div>
                <div style="margin-top:7px;color:#8aa0b5;font-family:Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:3px;line-height:1.5;">BE PART OF OUR BOOK JOURNEY</div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0;">
                    <tr>
                        <td style="padding:0 5px;"><a href="{$facebookUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;" title="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a></td>
                        <td style="padding:0 5px;"><a href="{$instagramUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;" title="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a></td>
                        <td style="padding:0 5px;"><a href="{$youtubeUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;" title="YouTube"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#EAF3FB"></polygon></svg></a></td>
                        <td style="padding:0 5px;"><a href="{$xUrl}" style="display:block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:50%;background:#eaf3fb;color:#123b67;text-decoration:none;" title="X"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a></td>
                    </tr>
                </table>
                <p style="margin:17px 0 0;color:#7189a1;font-family:'Noto Sans Thai',Arial,Tahoma,sans-serif;font-size:12px;line-height:1.6;">หนังสือที่ดี เปลี่ยนวันธรรมดาให้พิเศษเสมอ</p>
                <p style="margin:8px 0 0;color:#a2b0bd;font-family:Arial,sans-serif;font-size:10px;line-height:1.5;">© 2026 BookLoop. All rights reserved.</p>
            </td></tr>
        </table>
    </td></tr>
</table>
</body>
</html>
HTML;

        // banner ใหญ่เกิน 300KB ถูกข้ามอัตโนมัติ (กัน SMTP ช้า/timeout)
        embedImageCapped($mail, IMAGES_PATH . '/newsletterConfirmation.png', 'welcome_image');
        $mail->send();

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        error_log("[BookLoop][ERROR] sendConfirmationEmailService failed: " . ($mail->ErrorInfo ?: $e->getMessage()) . " to={$to}");
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

function sendOrderConfirmationService(
    string $to,
    string $userName,
    string $orderId,
    array $items = [],
    string $total = '0.00',
    string $shippingAddress = '',
    string $paymentMethod = 'promptpay',
    string $shippingMethod = 'standard'
): array {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->Timeout = MAIL_TIMEOUT;

        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        $name = $userName;
        // จำกัดแถวสินค้าในอีเมล — กันออเดอร์ใหญ่กลายเป็น HTML หลายร้อย KB
        $items = capEmailItems(is_array($items) ? $items : []);
        ob_start();
        include EMAIL_PATH . '/orderConfirmEmail.php';
        $emailHtml = ob_get_clean();

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = "ยืนยันคำสั่งซื้อ #{$orderId} - BookLoop";
        $mail->Body = $emailHtml;
        embedImageCapped($mail, IMAGES_PATH . '/orderSuccess.jpg', 'welcome_image');
        embedImageCapped($mail, IMAGES_PATH . '/logo-email.png', 'logo_image');

        $mail->send();

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        error_log("[BookLoop][ERROR] sendOrderConfirmationService failed: " . ($mail->ErrorInfo ?: $e->getMessage()) . " order={$orderId} to={$to}");
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

function sendOnboardingWelcomeEmailService(
    string $to,
    string $userName,
    array $categories = [],
    array $books = []
): array {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->Timeout = MAIL_TIMEOUT;

        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        $name = $userName;
        $bookloopUrl = 'https://panitijahem.xo.je/app';
        $profileUrl = $bookloopUrl . '/account/profile';

        ob_start();
        include EMAIL_PATH . '/onboardingWelcomeEmail.php';
        $emailHtml = ob_get_clean();

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'ยินดีต้อนรับสู่ BookLoop';
        $mail->Body = $emailHtml;
        // ปกหนังสือเป็น remote URL อยู่แล้ว ไม่ต้องแนบ embedded image
        embedImageCapped($mail, IMAGES_PATH . '/logo-email.png', 'logo_image');

        $mail->send();

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        error_log("[BookLoop][ERROR] sendOnboardingWelcomeEmailService failed: " . ($mail->ErrorInfo ?: $e->getMessage()) . " to={$to}");
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}
