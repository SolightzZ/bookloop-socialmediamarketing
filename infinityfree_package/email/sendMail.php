<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// โหลดไฟล์ config และ autoloader
require_once __DIR__ . '/../config/config.php';
require_once BASE_PATH . '/vendor/autoload.php';
require_once BASE_PATH . '/Services/BackgroundMail.php';

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
        $orderId = $data['orderId'] ?? '';
        // จำกัดแถวสินค้าในอีเมล — กันตะกร้าใหญ่กลายเป็น HTML หลายร้อย KB
        $items = capEmailItems(is_array($data['items'] ?? null) ? $data['items'] : []);
        $total = $data['total'] ?? '0.00';
        $shippingAddress = $data['shippingAddress'] ?? '';
        $paymentMethod = $data['paymentMethod'] ?? 'promptpay';
        $shippingMethod = $data['shippingMethod'] ?? 'standard';
        $bookTitle = $data['bookTitle'] ?? '';
        $bookPrice = $data['bookPrice'] ?? '';
        $bookImage = $data['bookImage'] ?? '';
        $bookAuthor = $data['bookAuthor'] ?? '';
        $condition = $data['condition'] ?? 'very_good';
        $promoCode = $data['promoCode'] ?? 'NEW10';

        ob_start();
        if ($type === 'purchase') {
            include __DIR__ . '/orderConfirmEmail.php';
        } elseif ($type === 'add_to_cart') {
            include __DIR__ . '/orderEmails.php';
        } else {
            include __DIR__ . '/newsletterWelcomeEmail.php';
        }
        $emailHtml = ob_get_clean();

        $mail->isHTML(true);       // body เป็น HTML
        $mail->CharSet = 'UTF-8';  // ภาษาไทย
        $mail->Subject = getSubject($type, $data);  // หัวข้อตามประเภท
        $mail->Body = $emailHtml;

        // แนบรูป banner (CID) ให้แสดงใน body — purchase ใช้แบนเนอร์คำสั่งซื้อสำเร็จ
        // ไฟล์ใหญ่เกิน 300KB จะถูกข้าม (embedImageCapped + log) กัน payload base64
        // 1MB+ ทำให้ SMTP ช้า/timeout — ไปบีบอัดรูปที่ images/ แทน
        if ($type === 'purchase') {
            $bannerPath = IMAGES_PATH . '/orderSuccess.jpg';
            if (!is_file($bannerPath)) {
                $bannerPath = IMAGES_PATH . '/welcome.png'; // fallback กันรูปหายแล้วเมลพัง
            }
            embedImageCapped($mail, $bannerPath, 'welcome_image');
        } elseif ($type === 'welcome' || $type === 'subscription') {
            embedImageCapped($mail, IMAGES_PATH . '/welcome.png', 'welcome_image');
        }

        // ส่งจริง
        embedImageCapped($mail, IMAGES_PATH . '/logo-email.png', 'logo_image');
        $mail->send();

        // บันทึกผู้รับลง subscribers.txt เฉพาะอีเมลสมัครข่าวสารเท่านั้น
        // (welcome/purchase/add_to_cart ไม่บันทึก เพื่อไม่ให้ผู้ใช้ถูกเพิ่มเป็น subscriber โดยไม่ตั้งใจ)
        if ($type === 'subscription') {
            $subscriberData = $to;
            if (!empty($preferences)) {
                $subscriberData .= ' | ' . implode(', ', $preferences);
            }
            file_put_contents(
                SUBSCRIBERS_PATH,
                $subscriberData . "\n",
                FILE_APPEND | LOCK_EX
            );
        }

        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        // คืน error เป็น array (ErrorInfo ละเอียดกว่า message ธรรมดา) + โผล่ console
        $err = $mail->ErrorInfo ?: $e->getMessage();
        error_log("[BookLoop][ERROR] sendEmail({$type}) failed: {$err} to={$to}");
        return ['success' => false, 'error' => $err];
    }
}

//  กำหนดหัวข้ออีเมลตามประเภท
function getSubject(string $type, array $data = []): string
{
    // switch แทน match() เพื่อให้รันได้บน PHP 7.4 (match เพิ่มมาใน PHP 8.0)
    switch ($type) {
        case 'subscription':
            return 'ยืนยันการสมัครรับข่าวสาร - BookLoop';
        case 'purchase':
            return "ยืนยันคำสั่งซื้อ #{$data['orderId']}";
        case 'add_to_cart':
            return 'มีสินค้าในตะกร้ารอคุณอยู่';
        default:
            return 'ยินดีต้อนรับสู่ BookLoop';
    }
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


// ส่งอีเมลตามประเภท — เฉพาะตอนเข้าถึง sendMail.php โดยตรง (ไม่ใช่ require จากไฟล์อื่น)
if (($_SERVER["REQUEST_METHOD"] ?? '') === "POST" && realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === realpath(__FILE__)) {
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
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
