<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/vendor/autoload.php';

// LEGACY — ไม่มี caller ในโค้ดปัจจุบัน (ทุกรายใช้ sendMail.php / Services/emailService.php)
// คงไฟล์ไว้กันฟอร์มเก่า แต่กัน fatal หากถูกโหลดร่วมกับ sendMail.php (ชื่อฟังก์ชันซ้ำ)
if (!function_exists('sendSubscriptionEmail')) {
function sendSubscriptionEmail(string $to, string $userName): array
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

        $mail->Timeout = MAIL_TIMEOUT;

        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        $name = $userName;
        ob_start();
        include __DIR__ . '/newsletterWelcomeEmail.php';
        $emailHtml = ob_get_clean();

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'ยินดีต้อนรับสู่ BookLoop';
        $mail->Body = $emailHtml;
        $mail->addEmbeddedImage(IMAGES_PATH . '/welcome.png', 'welcome_image');
        $logoPath = IMAGES_PATH . '/logo-email.png';
        if (is_file($logoPath)) {
            $mail->addEmbeddedImage($logoPath, 'logo_image');
        }

        $mail->send();

        file_put_contents(
            SUBSCRIBERS_PATH,
            $to . "\n",
            FILE_APPEND | LOCK_EX
        );

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        $err = $mail->ErrorInfo ?: $e->getMessage();
        error_log("[BookLoop][ERROR] sendSubscriptionEmail failed: {$err} to={$to}");
        return ['success' => false, 'error' => $err];
    }
}
} // end function_exists guard
