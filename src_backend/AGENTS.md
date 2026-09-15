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
│   ├── sendMail.php                    # PHPMailer SMTP functions
│   ├── subscribe_form.php              # แบบฟอร์มสมัครสมาชิก
│   ├── newsletterWelcomeEmail.php      # อีเมลต้อนรับ (ใช้ CID สำหรับ email)
│   ├── newsletterConfirmationEmail.php # อีเมลยืนยัน (ใช้ CID สำหรับ email)
│   ├── newsletterWelcomeEmail.test.php # ตัวอย่างอีเมลต้อนรับ (เปิดในเบราว์เซอร์)
│   └── subscribers.txt                 # บันทึกอีเมลผู้สมัคร
├── api/
│   ├── subscribe.php                   # API สมัครสมาชิก
│   └── track.php                       # API บันทึกกิจกรรม
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
sendPurchaseEmail($to, $userName, ...)     // ยืนยันคำสั่งซื้อ
sendAddToCartEmail($to, $userName, ...)    // แจ้งเตือนตะกร้า
```

## Testing

เปิด `newsletterWelcomeEmail.test.php` ในเบราว์เซอร์เพื่อดูตัวอย่างอีเมล
