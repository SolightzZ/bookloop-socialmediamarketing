# AGENTS.md

## Project Overview

BookLoop Backend - ระบบ Newsletter Subscription สำหรับ BookLoop มาร์เก็ตเพลสหนังสือมือสอง

## Commands

- `./composer dump-autoload` - Regenerate autoloader

## Structure

```
src_backend/
├── Services/
│   ├── config.php                      # โหลด .env → define constants
│   ├── Http.php                        # Reusable: corsHeaders, jsonResponse, getRequestData, getBearerToken
│   ├── Subscribers.php                 # Reusable: isEmailSubscribed, removeEmail, appendSubscriber (subscribers.txt)
│   ├── emailService.php                # PHPMailer SMTP functions
│   ├── Logger.php                      # Logger service (error.log) + isValidLevel()/validLevels()
│   ├── RequestLogger.php               # Auto request logging middleware (data/request.log)
│   └── subscribers.txt                 # บันทึกอีเมลผู้สมัคร
├── api/
│   ├── auth_login.php                  # API เข้าสู่ระบบ
│   ├── auth_register.php               # API สมัครสมาชิก
│   ├── auth_me.php                     # API ข้อมูลผู้ใช้
│   ├── auth_update_profile.php         # API อัพเดทโปรไฟล์
│   ├── auth_delete_account.php         # API ลบบัญชี
│   ├── subscribe.php                   # API สมัครสมาชิก
│   ├── subscribe_newsletter.php        # API สมัคร newsletter
│   ├── newsletter_status.php           # API สถานะ newsletter
│   ├── track.php                       # API บันทึกกิจกรรม
│   ├── log.php                         # API บันทึก log
│   └── logs.php                        # API ดึง/ล้าง logs
├── auth/                               # Auth middleware
├── data/
│   ├── users.json                      # ข้อมูลผู้ใช้
│   ├── tokens.json                     # Auth tokens
│   └── error.log                       # Log files
├── email/ # โค้ดตรงนี้จะนำไปส่งให้อาจารย์                             # Email templates
├── images/
│   ├── welcome.png                     # รูปต้อนรับ
│   ├── template.png                    # รูป template
│   └── fonts/                          # ฟอนต์ NotoSansThai
├── vendor/                             # PHPMailer (Composer)
├── .env                                # SMTP, CORS config
├── composer.json                       # PSR-4 autoload
└── email_preview.html                  # ตัวอย่างอีเมล
```

## Email Flow

```
subscribe_form.php → POST → sendMail.php → PHPMailer → Gmail SMTP → MailBox
                                                ↓
                                    newsletterWelcomeEmail.php (CID: welcome_image)
```

## Config (.env)

```ini
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=xxxx@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_ENCRYPTION=tls
MAIL_TIMEOUT=15
MAIL_FROM_ADDRESS=xxxx@gmail.com
MAIL_FROM_NAME=BookLoop
ALLOWED_ORIGIN=http://localhost:3000
```

## Conventions

- **Language:** Thai UI text, English code identifiers
- **Email Templates:** ใช้ CID (`cid:welcome_image`) สำหรับ embedded images
- **Test Files:** ใช้ `../images/` path แทน CID
- **Font:** `'Sarabun', Tahoma, Arial, sans-serif` สำหรับภาษาไทย
- **CSS Comments:** ใช้ `/* ... */` ไม่ใช้ `//` (ไม่แสดงใน email clients)
- **PHP Variables:** รับ `$name` จาก sendMail.php

## Key Functions (sendMail.php)

```php
sendWelcomeEmail($to, $userName)           // อีเมลต้อนรับ
sendPurchaseEmail($to, $userName, ...)     // ยืนยันคำสั่งซื้อ (email/orderEmails.php)
sendAddToCartEmail($to, $userName, ...)    // แจ้งเตือนตะกร้า (email/orderEmails.php)
```

## Logger API

### POST /api/log.php

บันทึกลง error.log

```json
{
    "level": "ERROR",
    "message": "Error message",
    "context": {"key": "value"}
}
```

Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

### GET /api/logs.php

ดึง logs

- `?level=ERROR` - กรองตาม level
- `?limit=50` - จำนวน log สูงสุด

### DELETE /api/logs.php

ล้าง logs ทั้งหมด

## Usage (PHP)

```php
require_once BASE_PATH . '/Services/Logger.php';

$logger = Logger::getInstance();
$logger->error('เกิดข้อผิดพลาด', ['user_id' => 123]);
$logger->info('ข้อมูลทั่วไป');
```

## RequestLogger (Auto Logging)

ใส่ `require_once` ในไฟล์ API ทุกไฟล์เพื่อบันทึก request อัตโนมัติ

```php
require_once BASE_PATH . '/Services/RequestLogger.php';
```

ระบบจะ:
- บันทึก incoming request (method, URI, IP)
- บันทึก response (status code, duration_ms)
- จับ PHP errors, warnings, exceptions
- บันทึก fatal errors

**Performance:** log ถูกเก็บใน memory buffer แล้วเขียนลงไฟล์**ครั้งเดียวตอน shutdown** (ลด disk I/O จาก 2 ครั้งเหลือ 1 ครั้ง/request)

> **Note:** email ถูกส่งแบบ non-blocking ผ่าน `register_shutdown_function`
> (ใน `api/auth_register.php` + `api/subscribe.php`) — response คืนทันที
> ไม่รอ SMTP (< `src_backend/email/` หยุดแก้ตามคำสั่ง)

### GET /api/request_log.php

ดึง request logs (เก็บใน `data/request.log` แยกจาก application log ของ Logger)

- `?level=ERROR` - กรองตาม level
- `?search=keyword` - ค้นหา
- `?limit=50` - จำนวน log

### DELETE /api/request_log.php

ล้าง logs ทั้งหมด

## Testing

เปิด `newsletterWelcomeEmail.test.php` ในเบราว์เซอร์เพื่อดูตัวอย่างอีเมล
