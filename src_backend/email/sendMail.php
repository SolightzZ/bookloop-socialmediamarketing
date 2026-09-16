<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// โหลดไฟล์ config และ autoloader
require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/vendor/autoload.php';

set_time_limit(60);

// ส่งอีเมลผ่าน PHPMailer — ใช้ได้กับ welcome/subscription/purchase/add_to_cart
// สร้าง HTML จาก template, ส่งผ่าน SMTP, และบันทึกผู้รับลง subscribers.txt
// คืน ['success' => true|false, 'error' => string|null] — caller ตรวจ success ไม่มี fatal
function sendEmail(string $to, string $userName, string $type = 'welcome', array $data = []): array
{
    // true = ให้ PHPMailer throw exception แทน fatal เราจะ catch ด้านล่าง
    $mail = new PHPMailer(true);

    try {
        // ตั้งค่าเชื่อมต่อ SMTP (Gmail) จาก config
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD; // App Password
        $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'  // ssl → SMTPS อย่างอื่น STARTTLS
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        $mail->Timeout = MAIL_TIMEOUT; // timeout ต่อ attempt (วินาที) ต้องน้อยกว่า max_execution_time

        // กำหนดผู้ส่ง/ผู้รับ
        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        // render HTML จาก template (จับด้วย output buffer)
        $name = $userName;
        $preferences = $data['preferences'] ?? [];
        ob_start();
        include __DIR__ . '/newsletterWelcomeEmail.php';
        $emailHtml = ob_get_clean();

        $mail->isHTML(true);       // body เป็น HTML
        $mail->CharSet = 'UTF-8';  // ภาษาไทย
        $mail->Subject = getSubject($type, $data);  // หัวข้อตามประเภท
        $mail->Body = $emailHtml;

        // แนบรูป CID ให้ขึ้นใน body (เฉพาะ welcome/subscription)
        if ($type === 'welcome' || $type === 'subscription') {
            $mail->addEmbeddedImage(IMAGES_PATH . '/welcome.png', 'welcome_image');
        }

        // ส่งจริง + บันทึกผู้รับ
        $mail->send();

        $subscriberData = $to;  // "email" หรือ "email | preferences"
        if (!empty($preferences)) {
            $subscriberData .= ' | ' . implode(', ', $preferences);
        }
        file_put_contents(
            EMAIL_PATH . '/subscribers.txt',
            $subscriberData . "\n",
            FILE_APPEND | LOCK_EX  // append + ล็อกกันเขียนพร้อมกัน
        );

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        // คืน error เป็น array (ErrorInfo ละเอียดกว่า message ธรรมดา)
        return ['success' => false, 'error' => $mail->ErrorInfo ?: $e->getMessage()];
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
