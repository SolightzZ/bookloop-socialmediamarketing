<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// โหลดไฟล์ config และ autoloader
require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/vendor/autoload.php';

/**
 * ส่งอีเมลผ่าน PHPMailer
 * @param string $to - อีเมลผู้รับ
 * @param string $userName - ชื่อผู้รับ
 * @param string $type - ประเภทอีเมล (welcome, purchase, add_to_cart)
 * @param array $data - ข้อมูลเพิ่มเติม
 * @return array - ผลลัพธ์ ['success' => bool, 'error' => string|null]
 */
function sendEmail(string $to, string $userName, string $type = 'welcome', array $data = []): array
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        $name = $userName;
        $preferences = $data['preferences'] ?? [];
        ob_start();
        include __DIR__ . '/newsletterWelcomeEmail.php';
        $emailHtml = ob_get_clean();

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = getSubject($type, $data);
        $mail->Body = $emailHtml;

        if ($type === 'welcome' || $type === 'subscription') {
            $mail->addEmbeddedImage(IMAGES_PATH . '/welcome.png', 'welcome_image');
        }

        $mail->send();

        $subscriberData = $to;
        if (!empty($preferences)) {
            $subscriberData .= ' | ' . implode(', ', $preferences);
        }
        file_put_contents(
            EMAIL_PATH . '/subscribers.txt',
            $subscriberData . "\n",
            FILE_APPEND
        );

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

//  กำหนดหัวข้ออีเมลตามประเภท
function getSubject(string $type, array $data = []): string
{
    return match ($type) {
        'subscription' => 'ยืนยันการสมัครรับข่าวสาร - BookLoop',
        'purchase' => "ยืนยันคำสั่งซื้อ #{$data['orderId']}",
        'add_to_cart' => 'มีสินค้าในตะกร้ารอคุณอยู่',
        default => 'ยินดีต้อนรับสู่ BookLoop',
    };
}

// === Functions สำหรับส่งแต่ละประเภท ===

// ส่งอีเมลต้อนรับ (สมัครสมาชิกใหม่)
function sendWelcomeEmail(string $to, string $userName): array
{
    return sendEmail($to, $userName, 'welcome');
}

// ส่งอีเมลสมัครรับข่าวสาร
function sendSubscriptionEmail(string $to, string $userName, array $preferences = []): array
{
    return sendEmail($to, $userName, 'subscription', [
        'preferences' => $preferences,
    ]);
}


// ส่งอีเมลตามประเภท 
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $name = $_POST['name'] ?? '';
    $formType = $_POST['form_type'] ?? 'register';

    if ($email) {
        if ($formType === 'subscription') {
            $preferences = $_POST['news_preferences'] ?? [];
            $result = sendSubscriptionEmail($email, $name, $preferences);
        } else {
            $result = sendWelcomeEmail($email, $name);
        }

        if ($result['success']) {
            echo 'สมัครสำเร็จ: ' . htmlspecialchars($email);
        } else {
            echo 'ข้อผิดพลาด: ' . $result['error'];
        }
    } else {
        echo 'ไม่มีอีเมลล์นี้';
    }
}
?>
