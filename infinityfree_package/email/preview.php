<?php
// BookLoop — DEV ONLY: email template preview (localhost only).
// เปิดผ่านปุ่มทดสอบใน subscribe_form.php — ห้ามใช้บน production เด็ดขาด.

$__host = $_SERVER['HTTP_HOST'] ?? '';
$__ip = $_SERVER['REMOTE_ADDR'] ?? '';
$__isLocal = (bool)preg_match('/^(localhost|127\.0\.0\.1|\[::1\])/i', $__host)
    || in_array($__ip, ['127.0.0.1', '::1'], true);
if (!$__isLocal) {
    http_response_code(403);
    exit('Forbidden: preview available on localhost only.');
}

$allowed = [
    'confirm'    => 'newsletterConfirmationEmail.php',
    'welcome'    => 'newsletterWelcomeEmail.php',
    'onboarding' => 'onboardingWelcomeEmail.php',
    'order'      => 'orderConfirmEmail.php',
    'cart'       => 'orderEmails.php', // add-to-cart reminder (lib + template)
];

$t = $_GET['t'] ?? '';
if (!isset($allowed[$t]) && ($_GET['action'] ?? '') !== 'send') {
    http_response_code(404);
    exit('Unknown template. Use ?t=confirm|welcome|onboarding|order|cart');
}

// ── DEV ONLY: ส่ง demo email ด้วยข้อมูลที่กรอกจากฟอร์ม (localhost) ──
if (($_GET['action'] ?? '') === 'send') {
    header('Content-Type: application/json; charset=UTF-8');
    $st = $_POST['t'] ?? '';
    $semail = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $sname = trim((string)($_POST['name'] ?? ''));
    if ($sname === '') {
        $sname = 'คุณทดสอบ';
    }
    if (!$semail) {
        echo json_encode(['success' => false, 'error' => 'กรุณากรอกอีเมลที่ถูกต้อง'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if (!isset($allowed[$st])) {
        echo json_encode(['success' => false, 'error' => 'ไม่รู้จักเทมเพลต'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ข้อมูลตัวอย่าง — ตรงกับพรีวิว ?t= ทุกประการ
    $demoBooks = [
        ['id' => 'bk-001', 'title' => 'เจ้าชายน้อย (ปกแข็ง)', 'author' => 'อองตวน เดอ แซงเตกซูว์เพรี', 'price' => 189, 'category' => 'นิยาย', 'cover' => '', 'url' => 'http://localhost:8000/app'],
        ['id' => 'bk-002', 'title' => 'Atomic Habits', 'author' => 'James Clear', 'price' => 245, 'category' => 'พัฒนาตนเอง', 'cover' => '', 'url' => 'http://localhost:8000/app'],
    ];
    $demoItems = [
        ['title' => 'เจ้าชายน้อย (ปกแข็ง)', 'author' => 'อองตวน เดอ แซงเตกซูว์เพรี', 'price' => 189, 'quantity' => 1, 'image' => '', 'condition' => 'like_new'],
        ['title' => 'Atomic Habits', 'author' => 'James Clear', 'price' => 245, 'quantity' => 2, 'image' => '', 'condition' => 'very_good'],
    ];

    try {
        switch ($st) {
            case 'welcome':
                require_once __DIR__ . '/sendMail.php';
                $result = sendWelcomeEmail($semail, $sname);
                break;
            case 'subscription':
                require_once __DIR__ . '/sendMail.php';
                $prefs = $_POST['preferences'] ?? [];
                $result = sendSubscriptionEmail($semail, $sname, is_array($prefs) ? $prefs : []);
                break;
            case 'order':
                require_once __DIR__ . '/sendMail.php';
                $result = sendEmail($semail, $sname, 'purchase', [
                    'orderId' => 'BL-DEMO-0001', 'items' => $demoItems,
                    'subtotal' => '679.00', 'discount' => 67.90, 'promoCode' => 'NEW10',
                    'total' => '611.10',
                    'shippingAddress' => ['name' => $sname, 'phone' => '081-234-5678', 'address' => '123 ถนนสุขุมวิท แขวงคลองเตย', 'province' => 'กรุงเทพฯ', 'postalCode' => '10110'],
                    'paymentMethod' => 'promptpay', 'shippingMethod' => 'standard',
                    'shippingCarrier' => 'Flash Express', 'trackingNumber' => 'TH1234567890',
                ]);
                break;
            case 'cart':
                require_once __DIR__ . '/sendMail.php';
                $result = sendEmail($semail, $sname, 'add_to_cart', [
                    'bookTitle' => 'Atomic Habits', 'bookAuthor' => 'James Clear',
                    'bookPrice' => '245.00', 'bookImage' => '', 'condition' => 'very_good', 'promoCode' => 'NEW10',
                ]);
                break;
            case 'onboarding':
                require_once __DIR__ . '/../Services/emailService.php';
                $result = sendOnboardingWelcomeEmailService($semail, $sname, ['novel', 'growth'], $demoBooks);
                break;
            case 'confirm':
            default:
                // newsletterConfirmationEmail.php ยังไม่มี sender ประจำ — render + ส่งตรงที่นี่
                require_once __DIR__ . '/../config/config.php';
                require_once BASE_PATH . '/vendor/autoload.php';
                $mail = new PHPMailer\PHPMailer\PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = SMTP_HOST;
                $mail->SMTPAuth = true;
                $mail->Username = SMTP_USERNAME;
                $mail->Password = SMTP_PASSWORD;
                $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
                    ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
                    : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = SMTP_PORT;
                $mail->Timeout = MAIL_TIMEOUT;
                $mail->setFrom(MAIL_FROM_ADDRESS, MAIL_FROM_NAME);
                $mail->addAddress($semail);
                $name = $sname;
                ob_start();
                include __DIR__ . '/newsletterConfirmationEmail.php';
                $emailHtml = ob_get_clean();
                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                $mail->Subject = 'ยืนยันการสมัครรับข่าวสาร - BookLoop';
                $mail->Body = $emailHtml;
                $banner = IMAGES_PATH . '/newsletterConfirmation.png';
                if (!is_file($banner)) {
                    $banner = IMAGES_PATH . '/welcome.png'; // fallback กันรูปหายแล้วเมลพัง
                }
                $mail->addEmbeddedImage($banner, 'confirm_image');
                $logoPath = IMAGES_PATH . '/logo-email.png';
                if (is_file($logoPath)) {
                    $mail->addEmbeddedImage($logoPath, 'logo_image');
                }
                $mail->send();
                $result = ['success' => true, 'error' => null];
                break;
        }
    } catch (Throwable $e) {
        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        $result = ['success' => false, 'error' => $e->getMessage()];
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Sample data — จำลองเหมือน caller จริง (sendMail.php / emailService) ──
$name = 'คุณทดสอบ';
$bookloopUrl = 'http://localhost:8000/app';
$profileUrl = $bookloopUrl . '/account/profile';

if ($t === 'onboarding') {
    $categories = ['novel', 'growth', 'comic'];
    $books = [
        [
            'id' => 'bk-001', 'title' => 'เจ้าชายน้อย (ปกแข็ง)', 'author' => 'อองตวน เดอ แซงเตกซูว์เพรี',
            'price' => 189, 'category' => 'นิยาย', 'cover' => '', 'url' => $bookloopUrl,
        ],
        [
            'id' => 'bk-002', 'title' => 'Atomic Habits', 'author' => 'James Clear',
            'price' => 245, 'category' => 'พัฒนาตนเอง', 'cover' => '', 'url' => $bookloopUrl,
        ],
        [
            'id' => 'bk-003', 'title' => 'One Piece Vol. 100', 'author' => 'Eiichiro Oda',
            'price' => 95, 'category' => 'การ์ตูน', 'cover' => '', 'url' => $bookloopUrl,
        ],
    ];
}

if ($t === 'order') {
    $orderId = 'BL-TEST-0001';
    $items = [
        [
            'title' => 'เจ้าชายน้อย (ปกแข็ง)', 'author' => 'อองตวน เดอ แซงเตกซูว์เพรี',
            'price' => 189, 'quantity' => 1, 'image' => '', 'condition' => 'like_new',
        ],
        [
            'title' => 'Atomic Habits', 'author' => 'James Clear',
            'price' => 245, 'quantity' => 2, 'image' => '', 'condition' => 'very_good',
        ],
    ];
    $subtotal = '679.00';
    $shippingFee = 0.0;
    $discount = 67.90;
    $total = '611.10';
    $promoCode = 'NEW10';
    $shippingAddress = [
        'name' => 'คุณทดสอบ', 'phone' => '081-234-5678',
        'address' => '123 ถนนสุขุมวิท แขวงคลองเตย', 'province' => 'กรุงเทพฯ', 'postalCode' => '10110',
    ];
    $paymentMethod = 'promptpay';
    $shippingMethod = 'standard';
    $shippingCarrier = 'Flash Express';
    $trackingNumber = 'TH1234567890';
    $orderDate = date('d/m/Y H:i');
}

if ($t === 'cart') {
    $userName = 'คุณทดสอบ';
    $bookTitle = 'Atomic Habits';
    $bookAuthor = 'James Clear';
    $bookPrice = '245.00';
    $bookImage = '';
    $condition = 'very_good';
    $promoCode = 'NEW10';
    $items = [];
}

// ── Preview: render พร้อม map cid: เป็นไฟล์จริง (เห็นแบนเนอร์เหมือนในเมล) ──
$previewBanner = [
    'confirm'    => '', // ใช้ cid:confirm_image → newsletterConfirmation.png (ด้านล่าง)
    'welcome'    => '../images/welcome.png',
    'onboarding' => '',
    'order'      => '../images/orderSuccess.jpg',
    'cart'       => '',
];
ob_start();
include __DIR__ . '/' . $allowed[$t];
$html = ob_get_clean();
if (($previewBanner[$t] ?? '') !== '') {
    $html = str_replace('cid:welcome_image', $previewBanner[$t], $html);
}
if ($t === 'confirm') {
    $html = str_replace('cid:confirm_image', '../images/newsletterConfirmation.png', $html);
}
$html = str_replace('cid:logo_image', '../images/logo-email.png', $html);
echo $html;
