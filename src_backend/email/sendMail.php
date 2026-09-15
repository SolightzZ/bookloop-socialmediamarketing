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
        // ตั้งค่า SMTP
        configureSMTP($mail);

        // ตั้งค่าผู้ส่งและผู้รับ
        $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        // โหลด email template
        $emailHtml = renderEmail($type, $userName, $data);

        // ตั้งค่าเนื้อหาอีเมล
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = getSubject($type, $data);
        $mail->Body = $emailHtml;

        // แนบรูปภาพ welcome.png สำหรับ welcome email
        if ($type === 'welcome') {
            $mail->addEmbeddedImage(IMAGES_PATH . '/welcome.png', 'welcome_image');
        }

        // ส่งอีเมล
        $mail->send();

        // บันทึกอีเมลลงไฟล์
        saveSubscriber($to);

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

//  ตั้งค่า SMTP จาก config constants
function configureSMTP(PHPMailer $mail): void
{
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = SMTP_PORT;
}

// โหลด email template และใส่ข้อมูล
function renderEmail(string $type, string $userName, array $data): string
{
    // ตั้งค่าชื่อสำหรับใช้ใน template
    $name = $userName;

    // จับ output จาก template
    ob_start();
    include __DIR__ . '/newsletterWelcomeEmail.php';
    return ob_get_clean();
}

//  กำหนดหัวข้ออีเมลตามประเภท
function getSubject(string $type, array $data = []): string
{
    return match ($type) {
        'purchase' => "ยืนยันคำสั่งซื้อ #{$data['orderId']}",
        'add_to_cart' => 'มีสินค้าในตะกร้ารอคุณอยู่',
        default => 'ยินดีต้อนรับสู่ BookLoop',
    };
}

// บันทึกอีเมลลงไฟล์ subscribers.txt
function saveSubscriber(string $email): void
{
    file_put_contents(
        EMAIL_PATH . '/subscribers.txt',
        $email . "\n",
        FILE_APPEND
    );
}

// === Functions สำหรับส่งแต่ละประเภท ===

// ส่งอีเมลต้อนรับ
function sendWelcomeEmail(string $to, string $userName): array
{
    return sendEmail($to, $userName, 'welcome');
}

// ส่งอีเมลยืนยันคำสั่งซื้อ
function sendPurchaseEmail(string $to, string $userName, string $orderId, string $bookTitle, string $bookPrice): array
{
    return sendEmail($to, $userName, 'purchase', [
        'orderId' => $orderId,
        'bookTitle' => $bookTitle,
        'bookPrice' => $bookPrice,
    ]);
}

// ส่งอีเมลแจ้งเตือนสินค้าในตะกร้า
function sendAddToCartEmail(string $to, string $userName, string $bookTitle, string $bookPrice): array
{
    return sendEmail($to, $userName, 'add_to_cart', [
        'bookTitle' => $bookTitle,
        'bookPrice' => $bookPrice,
    ]);
}

// === ตรวจสอบการส่งข้อมูลจากฟอร์ม ===

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // รับและ validate อีเมล
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $name = $_POST['name'] ?? '';

    if ($email) {
        // ส่งอีเมลต้อนรับ
        $result = sendWelcomeEmail($email, $name);

        // แสดงผลลัพธ์
        if ($result['success']) {
            echo '<script>alert("✔️ สมัครสำเร็จ! คุณจะได้รับข่าวสารจาก BookLoop ทางอีเมล: ' . htmlspecialchars($email) . '"); window.location.href = "subscribe_form.php";</script>';
        } else {
            echo '<script>alert("❌ เกิดข้อผิดพลาด: ' . addslashes($result['error']) . '"); history.back();</script>';
        }
    } else {
        echo "⚠️ ไม่มีอีเมลล์นี้";
    }
}
?>
