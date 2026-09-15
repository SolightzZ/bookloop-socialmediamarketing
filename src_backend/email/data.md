# PDF → Text

## แบบฝึกปฏิบัติ

**การสร้างระบบ subscribe ด้วย PHPMailer**
**วิชา การตลาดดิจิทัล**

### ขั้นตอนการปฏิบัติ

1. สร้างไฟล์ `subscribe_form.php` แบบฟอร์ม subscribe email จากตัวอย่าง เป็นแบบฟอร์ม subscribe สำหรับส่งข่าวสารไปยัง Leads ที่สนใจ
   ข้อมูลส่งแบบ `POST` ไปยัง `sendMail.php`

2. สร้างไฟล์ `sendMail.php` คำสั่ง PHP เพื่อทำการรับข้อมูลจากฟอร์มส่งอีเมลล์ ด้วยฟังก์ชัน `mail()` ไปยังอีเมลล์ลูกค้า

### ข้อกำหนดเบื้องต้นการใช้งาน PHPMailer โดยใช้ Gmail SMTP

- ต้องสร้าง **App Password** ของ Gmail ผู้ส่ง
- เปิดใช้งาน **2-step verification**
- หากไม่มีเมนู App Password ให้สร้างผ่านหน้าการตั้งค่าของ Google
- ตัวอย่าง App Password เป็นรหัสจำนวน 16 ตัวอักษร เช่น
  `abcd efgh ijkl mnop`
- เปิดใช้งาน **OpenSSL ใน PHP** สำหรับ TLS/SSL
- แก้ไขไฟล์ `php.ini` จาก

```ini
;extension=openssl
```

เป็น

```ini
extension=openssl
```

จากนั้น restart Apache

- ติดตั้ง PHPMailer

---

# ไฟล์ `sendMail.php`

```php
<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// โหลดไฟล์ class
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

// ตรวจสอบการส่งข้อมูลผ่าน POST ที่ส่งจากฟอร์ม subscribe
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = filter_var(
        $_POST['email'],
        FILTER_VALIDATE_EMAIL
    );

    if ($email) {

        $mail = new PHPMailer(true);

        try {

            // ตั้งค่า SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'xxxx@gmail.com';
            $mail->Password = 'xxxx xxxx xxxx xxxx';
            $mail->SMTPSecure =
                PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->setFrom(
                'xxxx@gmail.com',
                'Your Website'
            );

            // อีเมลล์ผู้รับ
            $mail->addAddress($email);

            include "emailContent.php";

            $mail->isHTML(true);

            $mail->Subject =
                'ยินดีต้อนรับสู่ Caffelina Shop';

            $mail->Body = $bodyContent;

            $mail->send();

            file_put_contents(
                "subscribers.txt",
                $email . "\n",
                FILE_APPEND
            );

            echo "✔️ Subscription สำเร็จ. คุณจะได้รับข้อเสนอพิเศษทางอีเมลล์: $email.";

        } catch (Exception $e) {

            echo "❌ เกิดข้อผิดพลาด : ไม่สามารถส่งอีเมลล์ถึงคุณได้: {$mail->ErrorInfo}";
        }

    } else {

        echo "⚠️ ไม่มีอีเมลล์นี้";
    }

} else {

    echo "Access Denied.";
}

?>
```

โค้ดนี้ทำงานตามลำดับคือรับ `POST`, validate email, สร้าง PHPMailer, เชื่อม `smtp.gmail.com`, ส่งอีเมล, บันทึก email ลง `subscribers.txt` และส่งข้อความกลับมา

---

# ข้อกำหนดเพิ่มเติม

ให้นักศึกษาเปลี่ยนเนื้อหาในอีเมล โดยสร้างไฟล์:

```text
emailContent.php
```

ในบรรทัดที่ 25

### แนบรูปสินค้าแนะนำสำหรับลูกค้าใหม่

ให้นักศึกษาสร้างรูปโปสเตอร์แนะนำสินค้าแล้วแนบไปกับอีเมล

ใช้คำสั่ง:

```php
$mail->addEmbeddedImage(
    'ชื่อไฟล์และpath',
    'ชื่อตัวแทนรูป'
);
```

และใน HTML:

```html
<img src="cid:ระบุชื่อตัวแทนรูป" />
```

### ชื่อผู้ส่งใน Inbox

กำหนดให้ชื่อผู้ส่งแสดงเป็นชื่อร้านค้า:

```php
$mail->setFrom(
    'xxx@gmail.com',
    '☕️Caffelina Shop'
);
```

### หัวข้อหลักของ Email

กำหนด Subject เอง เช่น:

```php
$mail->Subject =
    'ข้อความแสดงหัวข้อหลักของ email';
```

### Data Flow จาก PDF

```text
ผู้ใช้
  ↓
subscribe_form.php
  ↓ POST
sendMail.php
  ↓
PHPMailer
  ↓ SMTP
Gmail SMTP
  ↓
MailBox / ลูกค้า
```

ในภาพประกอบหน้า 1 ยังแสดงแนวคิดว่าแบบฟอร์มรับอีเมล → ส่งข้อมูลไปยังระบบ → ส่งผ่าน SMTP → ถึง MailBox ของผู้รับ
