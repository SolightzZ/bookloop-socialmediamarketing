# Plan: Auth + Welcome Email + Newsletter Subscribe

## สถานะปัจจุบัน

- **Frontend** (`src/`): Auth ทั้งหมดเป็น client-side only — ข้อมูลเก็บใน `localStorage` ไม่มี HTTP call ใดๆ
- **Backend** (`src_backend/`): มีแค่ 2 API endpoints (`subscribe.php`, `track.php`) — ยังไม่มี register/login
- **ไม่มี API client** ใน frontend (ไม่มี axios หรือ fetch wrapper)

## เป้าหมาย

1. `/register` และ `/login` ทำงานจริงผ่าน PHP API
2. สมัครสมาชิกเสร็จ → ส่งอีเมลต้อนรับ (newsletterWelcomeEmail) อัตโนมัติ
3. หน้า Profile Settings → มีปุ่ม "ติดตามข่าวสาร" → ส่งอีเมล newsletterWelcomeEmail

---

## Phase 1: PHP Backend — เพิ่ม Auth API Endpoints

### 1.1 สร้าง JSON database สำหรับเก็บ users

ไฟล์ที่ต้องสร้าง:

| ไฟล์ | คำอธิบาย |
|------|----------|
| `src_backend/data/users.json` | ข้อมูลผู้ใช้ทั้งหมด |
| `src_backend/data/tokens.json` | session tokens ที่ active อยู่ |
| `src_backend/data/activities.json` | กิจกรรมผู้ใช้ (ย้ายจาก track.php) |

#### `src_backend/data/users.json`
```json
[
  {
    "id": "usr_001",
    "name": "สมชาย ใจดี",
    "email": "somchai@example.com",
    "password_hash": "a1b2c3d4e5f6...",
    "salt": "_bookloop_salt_2025",
    "avatar": "",
    "phone": "0812345678",
    "bio": "ชอบอ่านหนังสือ",
    "address": {
      "street": "123 ถ.สุขุมวิท",
      "city": "กรุงเทพฯ",
      "province": "กรุงเทพฯ",
      "zipCode": "10110"
    },
    "createdAt": "2026-01-15T08:30:00.000Z",
    "updatedAt": "2026-01-15T08:30:00.000Z"
  }
]
```

#### `src_backend/data/tokens.json`
```json
[
  {
    "token": "bl_usr_001_1705305000",
    "userId": "usr_001",
    "createdAt": "2026-01-15T08:30:00.000Z",
    "expiresAt": "2026-01-22T08:30:00.000Z"
  }
]
```

#### `src_backend/data/activities.json`
```json
[
  {
    "event": "page_view",
    "email": "somchai@example.com",
    "user_id": "usr_001",
    "book_id": "book_001",
    "book_title": "经济学原理",
    "book_price": 250,
    "metadata": {},
    "timestamp": "2026-01-15T08:30:00.000Z"
  }
]
```

#### JSON File Operations (PHP)
```
loadUsers()    → file_get_contents('data/users.json') → json_decode()
saveUsers($a)  → json_encode($a) → file_put_contents('data/users.json', ...)
loadTokens()   → file_get_contents('data/tokens.json') → json_decode()
saveTokens($a) → json_encode($a) → file_put_contents('data/tokens.json', ...)

SYNC LOCK: ใช้ flock() เพื่อป้องกัน concurrent write
```

### 1.2 สร้าง Auth helper functions
- ไฟล์: `src_backend/auth/auth.php`
- Functions:
  - `hashPassword($password)` — SHA-256 + salt `_bookloop_salt_2025` (ตรงกับ frontend)
  - `verifyPassword($password, $hash)` — ตรวจสอบรหัสผ่าน
  - `generateToken($userId)` — สร้าง session token `bl_<userId>_<timestamp>` + บันทึกลง tokens.json
  - `validateToken($token)` — ค้นหา token ใน tokens.json + ตรวจสอบ expiry
  - `removeToken($token)` — ลบ token (logout)
  - `findUserByEmail($email)` — ค้นหา user จาก email ใน users.json
  - `findUserById($id)` — ค้นหา user จาก id ใน users.json
  - `createUser($name, $email, $password)` — สร้าง user ใหม่ + บันทึกลง users.json
  - `updateUser($userId, $data)` — อัปเดตข้อมูล user ใน users.json
  - `loadJson($file)` — อ่านไฟล์ JSON พร้อม flock() lock
  - `saveJson($file, $data)` — เขียนไฟล์ JSON พร้อม flock() lock
  - `corsHeaders()` — ตั้งค่า CORS headers จาก ALLOWED_ORIGIN
  - `jsonResponse($data, $statusCode)` — ส่ง JSON response

#### ตัวอย่าง flow register
```
1. รับ POST body: { name, email, password }
2. validate email format, password >= 6 chars
3. $users = loadJson('data/users.json')
4. ตรวจสอบ email ซ้ำ → ถ้าซ้ำ return 409
5. $hash = hashPassword($password)
6. $user = createUser($name, $email, $password)
   - id = 'usr_' + random 8 chars
   - password_hash = $hash
   - createdAt = now()
7. saveJson('data/users.json', $users)
8. $token = generateToken($user['id'])
9. return { success: true, user: {...}, token: $token }
```

#### ตัวอย่าง flow login
```
1. รับ POST body: { email, password }
2. $users = loadJson('data/users.json')
3. $user = findUserByEmail($email)
4. ถ้าไม่เจอ → return 401
5. verifyPassword($password, $user['password_hash'])
6. ถ้าผิด → return 401
7. $token = generateToken($user['id'])
8. return { success: true, user: {...}, token: $token }
```

### 1.3 โครงสร้างไฟล์ PHP Backend ใหม่

```
src_backend/
├── config/
│   └── config.php                 ← ตั้งค่าทั้งหมด (.env, paths)
├── auth/
│   └── auth.php                   ← Auth helper functions
├── email/
│   ├── sendMail.php               ← ส่งอีเมลผ่าน PHPMailer
│   ├── newsletterWelcomeEmail.php ← template อีเมลต้อนรับ
│   ├── newsletterConfirmationEmail.php
│   ├── subscribe_form.php
│   └── subscribers.txt
├── api/
│   ├── auth_register.php          ← สมัครสมาชิก + ส่ง welcome email
│   ├── auth_login.php             ← เข้าสู่ระบบ
│   ├── auth_me.php                ← ดึงข้อมูล user
│   ├── auth_update_profile.php    ← อัปเดตโปรไฟล์
│   ├── subscribe_newsletter.php   ← สมัครรับข่าวสาร (จาก profile page)
│   ├── subscribe.php              ← Newsletter subscription (เดิม)
│   └── track.php                  ← Activity tracking (เดิม)
├── data/
│   ├── users.json
│   └── tokens.json
├── images/
├── vendor/
└── .env
```

### 1.4 สร้าง API Endpoints

| Endpoint | Method | ไฟล์ | หน้าที่ |
|----------|--------|------|---------|
| `api/auth_register.php` | POST | ใหม่ | สมัครสมาชิก → บันทึก user → ส่ง welcome email อัตโนมัติ |
| `api/auth_login.php` | POST | ใหม่ | เข้าสู่ระบบ — ตรวจสอบ → return user + token |
| `api/auth_me.php` | GET | ใหม่ | ดึงข้อมูล user ปัจจุบัน |
| `api/auth_update_profile.php` | POST | ใหม่ | อัปเดตโปรไฟล์ |
| `api/subscribe_newsletter.php` | POST | ใหม่ | สมัครรับข่าวสารจากหน้า Profile → ส่ง welcome email |

### 1.5 รายละเอียดแต่ละ Endpoint

#### `api/auth_register.php` — สมัครสมาชิก + ส่ง Welcome Email
```
POST /api/auth_register.php
Body: { name, email, password }

流程:
1. validate email format, password >= 6 chars
2. ตรวจสอบ email ซ้ำ
3. createUser() → บันทึกลง users.json
4. generateToken() → บันทึกลง tokens.json
5. ส่ง Welcome Email ผ่าน sendWelcomeEmail() ← newsletterWelcomeEmail.php
6. return { success: true, user, token }

Response 201:
  { success: true, user: { id, name, email, ... }, token: "bl_xxx" }
```

#### `api/auth_login.php`
```
POST /api/auth_login.php
Body: { email, password }

validations:
  - email มีอยู่ในระบบ
  - password ตรง

Response 200:
  { success: true, user: { id, name, email, ... }, token: "bl_xxx" }

Response 401:
  { success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }
```

#### `api/auth_me.php`
```
GET /api/auth_me.php
Header: Authorization: Bearer bl_xxx

Response 200:
  { success: true, user: { id, name, email, ... } }

Response 401:
  { success: false, message: "Token ไม่ถูกต้อง" }
```

#### `api/auth_update_profile.php`
```
POST /api/auth_update_profile.php
Header: Authorization: Bearer bl_xxx
Body: { name?, phone?, bio?, address? }

Response 200:
  { success: true, user: { ...updated } }
```

#### `api/subscribe_newsletter.php` — สมัครรับข่าวสารจากหน้า Profile
```
POST /api/subscribe_newsletter.php
Header: Authorization: Bearer bl_xxx (optional — ถ้าล็อกอินอยู่)

流程:
1. รับ email จาก request body (หรือ lookup จาก token)
2. ตรวจสอบว่า email นี้ subscribe แล้วหรือยัง (subscribers.txt)
3. บันทึกลง subscribers.txt
4. ส่ง Welcome Email ผ่าน sendWelcomeEmail() ← newsletterWelcomeEmail.php
5. return { success: true, message: "สมัครสำเร็จ" }

Response 200:
  { success: true, message: "สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ" }
```

---

## Phase 2: Frontend — เพิ่ม API Client

### 2.1 สร้าง API Client
- ไฟล์: `src/services/apiClient.ts`
- สร้าง fetch wrapper ที่:
  - Base URL = `http://localhost:5173/src_backend/api` (dev) หรือ config ได้
  - Auto-attach `Authorization: Bearer <token>` header จาก localStorage
  - Handle JSON response
  - Handle errors (401 → redirect to login)

```ts
// ตัวอย่าง interface
const apiClient = {
  get: (url: string) => fetch(...),
  post: (url: string, data: any) => fetch(...),
}
```

### 2.2 สร้าง Auth API Service
- ไฟล์: `src/services/authApi.ts`
- Functions:
  - `registerUser(name, email, password)` → POST `/api/auth_register.php`
  - `loginUser(email, password)` → POST `/api/auth_login.php`
  - `getCurrentUser(token)` → GET `/api/auth_me.php`
  - `updateProfile(token, data)` → POST `/api/auth_update_profile.php`

---

## Phase 3: แก้ไข Existing Auth Code

### 3.1 แก้ `src/services/authService.ts`
- เปลี่ยน `register()` ให้เรียก `authApi.registerUser()` แทน localStorage
- เปลี่ยน `login()` ให้เรียก `authApi.loginUser()` แทน localStorage
- เปลี่ยน `getCurrentUser()` ให้เรียก `authApi.getCurrentUser()` แทน localStorage
- เปลี่ยน `updateProfile()` ให้เรียก `authApi.updateProfile()`
- เก็บ token ใน localStorage key เดิม `bookloop_auth_session_token`
- ยังคง demo accounts ไว้เป็น fallback (ถ้า API ไม่Respond)

### 3.2 ไม่ต้องแก้
- `AuthContext.tsx` — ไม่ต้องแก้ (เรียก authService เหมือนเดิม)
- `LoginForm.tsx`, `RegisterForm.tsx` — ไม่ต้องแก้ (เรียก context เหมือนเดิม)
- `RequireAuth.tsx` — ไม่ต้องแก้
- Router — ไม่ต้องแก้

---

## Phase 4: CORS, Config & JSON Storage

### 4.1 ตั้งค่า CORS ในทุก Auth API
- ใช้ `ALLOWED_ORIGIN` จาก `.env` (ปัจจุบัน = `http://localhost:3000`)
- Headers: `Access-Control-Allow-Origin`, `Allow-Methods`, `Allow-Headers`
- Handle OPTIONS preflight

### 4.2 เพิ่ม env variable ใน frontend
- ไฟล์: `src/config/api.ts` หรือ `.env`
- `VITE_API_BASE_URL=http://localhost:5173/src_backend/api`

### 4.3 JSON File Management
- **ที่ตั้ง:** `src_backend/data/` — โฟลเดอร์นี้ต้อง writeable โดย PHP
- **File permissions:** `chmod 755 data/` + `chmod 644 data/*.json`
- **Sync lock:** ใช้ `flock($fp, LOCK_EX)` ขณะเขียนไฟล์ เพื่อป้องกัน concurrent write corruption
- **Initial data:** users.json เริ่มต้นเป็น array ว่าง `[]`
- **Encoding:** `JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT` สำหรับอ่านง่าย
- **Error handling:** ถ้าไฟล์หาย → return empty array, ถ้า JSON decode ผิด → return 500

### 4.4 โครงสร้าง User Type (Frontend ↔ Backend)
```ts
// src/types/auth.ts — ไม่ต้องแก้ ใช้เดิม
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  phone?: string;
  bio?: string;
  address?: UserAddress;
}

// Backend JSON ส่งกลับมาตรงกัน
// password_hash, salt, updatedAt → ไม่ส่งกลับให้ frontend
```

---

## Phase 5: Frontend — Newsletter Subscribe หน้า Profile

### 5.1 เพิ่มปุ่ม "ติดตามข่าวสาร" ใน AccountPage.tsx (Settings tab)

ตำแหน่ง: แท็บ Settings (tab 4) — เพิ่ม بعدส่วน notification toggles

```
┌─────────────────────────────────────────────┐
│  การตั้งค่า                                   │
│                                             │
│  🔔 การแจ้งเตือน                              │
│  ├─ แจ้งเตือนคำสั่งซื้อ    [toggle]            │
│  ├─ แจ้งเตือนราคาหนังสือ   [toggle]            │
│  └─ โปรโมชั่นและข่าวสาร   [toggle]            │
│                                             │
│  📰 ติดตามข่าวสาร BookLoop                   │
│  ├─ คำอธิบาย: "รับข่าวสาร หนังสือ推荐..."       │
│  ├─ [สมัครรับข่าวสาร] ← ปุ่มสีน้ำเงิน          │
│  └─ ✅ สมัครแล้ว (แสดงเมื่อ subscribe แล้ว)    │
│                                             │
│  [ออกจากระบบ]                                │
└─────────────────────────────────────────────┘
```

### 5.2 Frontend Flow

```
User คลิก "สมัครรับข่าวสาร"
    ↓
POST /api/subscribe_newsletter.php
{ email: user.email }
    ↓
PHP Backend:
1. ตรวจสอบ subscribers.txt — email ซ้ำ?
2. บันทึกลง subscribers.txt
3. ส่ง Welcome Email (newsletterWelcomeEmail.php) ผ่าน PHPMailer
4. return { success: true }
    ↓
Frontend: แสดง "✅ สมัครแล้ว"
```

### 5.3 ไฟล์ที่ต้องแก้

| ไฟล์ | คำอธิบาย |
|------|----------|
| `src/pages/AccountPage.tsx` | เพิ่ม newsletter subscribe ส่วนใน Settings tab |
| `src_backend/api/subscribe_newsletter.php` | ใหม่ — API สมัครรับข่าวสาร + ส่ง email |

---

## แผนผัง Flow ( REGISTER + NEWSLETTER )

```
REGISTER (+ ส่ง Welcome Email):
┌─────────────┐     POST /api/auth_register.php     ┌──────────────┐
│  RegisterForm│ ──────────────────────────────────► │  auth_register│
│  (React)     │                                      │  .php        │
└─────────────┘                                      └──────┬───────┘
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼               ▼               ▼
                                     loadJson()     hashPassword()    generateToken()
                                     users.json     SHA-256+salt      bl_xxx_timestamp
                                            │                               │
                                            ▼                               ▼
                                     saveJson()                     saveJson()
                                     users.json                     tokens.json
                                            │
                                            ▼
                                   sendWelcomeEmail()
                                   newsletterWelcomeEmail.php
                                   (PHPMailer → Gmail SMTP)
                                            │
                                            ▼
                                   { user, token }

NEWSLETTER SUBSCRIBE (จากหน้า Profile):
┌─────────────┐     POST /api/subscribe_newsletter.php  ┌──────────────┐
│ AccountPage  │ ──────────────────────────────────────► │  subscribe_  │
│ Settings Tab │                                          │  newsletter  │
│ (React)      │ ◄────────────────────────────────────── │  .php        │
└─────────────┘     { success, message }                 └──────┬───────┘
                                                               │
                                               ┌───────────────┼───────────────┐
                                               ▼               ▼               ▼
                                        checkDuplicate   saveJson()    sendWelcomeEmail()
                                        subscribers.txt  subscribers   newsletterWelcomeEmail.php
                                               │           .txt         (PHPMailer → Gmail SMTP)
                                               │               │               │
                                               └───────┬───────┘               │
                                                       ▼                       │
                                                { success: true }              │

LOGIN:
┌─────────────┐     POST /api/auth_login.php        ┌──────────────┐
│  LoginForm   │ ──────────────────────────────────► │  auth_login   │
│  (React)     │                                      │  .php        │
└─────────────┘                                      └──────┬───────┘
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼               ▼               ▼
                                     loadJson()     findUserByEmail() verifyPassword()
                                     users.json     users.json        SHA-256+salt
                                            │               │               │
                                            └───────┬───────┘               │
                                                    ▼                       │
                                             generateToken()               │
                                             tokens.json                   │
                                                    │                       │
                                                    └───────────┬───────────┘
                                                                ▼
                                                        { user, token }

CHECK SESSION (on app load):
┌─────────────┐     GET /api/auth_me.php             ┌──────────────┐
│  AuthContext │ ──────────────────────────────────► │  auth_me      │
│  (on load)   │  Header: Authorization: Bearer xxx  │  .php        │
└─────────────┘                                      └──────┬───────┘
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼               ▼               ▼
                                     loadJson()     validateToken()  findUserById()
                                     tokens.json    tokens.json      users.json
                                            │               │               │
                                            └───────┬───────┘               │
                                                    ▼                       │
                                              { user }                     │
```

---

## ไฟล์ที่ต้องสร้าง/แก้

### สร้างใหม่ (10 ไฟล์)
| ไฟล์ | คำอธิบาย |
|------|----------|
| `src_backend/data/users.json` | JSON database — ข้อมูลผู้ใช้ |
| `src_backend/data/tokens.json` | JSON database — session tokens |
| `src_backend/config/config.php` | ตั้งค่าทั้งหมด (.env, paths) |
| `src_backend/auth/auth.php` | Auth helper functions |
| `src_backend/api/auth_register.php` | API สมัครสมาชิก + ส่ง welcome email |
| `src_backend/api/auth_login.php` | API เข้าสู่ระบบ |
| `src_backend/api/auth_me.php` | API ดึงข้อมูล user ปัจจุบัน |
| `src_backend/api/auth_update_profile.php` | API อัปเดตโปรไฟล์ |
| `src_backend/api/subscribe_newsletter.php` | API สมัครรับข่าวสาร + ส่ง email |
| `src/services/apiClient.ts` | Fetch wrapper สำหรับเรียก API |

### แก้ไข (2 ไฟล์)
| ไฟล์ | คำอธิบาย |
|------|----------|
| `src/services/authService.ts` | เปลี่ยนจาก localStorage → เรียก PHP API |
| `src/pages/AccountPage.tsx` | เพิ่มปุ่ม "ติดตามข่าวสาร" ใน Settings tab |

### ไม่ต้องแก้
- AuthContext.tsx, LoginForm.tsx, RegisterForm.tsx, RequireAuth.tsx, Router — ทำงานเหมือนเดิม

---

## ลำดับการทำงาน

1. สร้าง `data/users.json` + `data/tokens.json`
2. สร้าง `config/config.php` + `auth/auth.php`
3. สร้าง 4 Auth API endpoints
4. แก้ `auth_register.php` ให้ส่ง welcome email หลังสมัคร
5. สร้าง `api/subscribe_newsletter.php`
6. สร้าง `apiClient.ts`
7. แก้ `authService.ts` ให้เรียก PHP API
8. แก้ `AccountPage.tsx` — เพิ่มปุ่ม "ติดตามข่าวสาร" ใน Settings tab
9. ทดสอบ end-to-end: register → ได้ welcome email, profile → subscribe → ได้ email
10. รัน `npm run lint` ตรวจสอบ
