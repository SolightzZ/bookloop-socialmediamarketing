# 📚 BookLoop — Second-hand Book Marketplace

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Material UI](https://img.shields.io/badge/MUI-v9.3-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![PHP Backend](https://img.shields.io/badge/PHP_Backend-7.4%2B%20%2F%208.x-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**BookLoop** คือแพลตฟอร์มตลาดซื้อ–ขายและส่งต่อหนังสือมือสองแบบครบวงจร (C2C Book Marketplace) ที่เชื่อมโยงนักอ่านเข้าด้วยกัน ไม่เพียงแค่การซื้อขายหนังสือ แต่ยังส่งต่อความทรงจำ เรื่องราว และคุณค่าของหนังสือทุกเล่มสู่ผู้อ่านคนใหม่ พร้อมระบบประเมินสภาพหนังสือที่โปร่งใส แดชบอร์ดสำหรับผู้ขาย ระบบคัดกรองเนื้อหา และประสบการณ์ใช้งานที่ลื่นไหลทั้งบนมือถือและเดสก์ท็อป

---

## 🌟 จุดเด่นและสถาปัตยกรรมระบบ (System Architecture)

BookLoop ถูกออกแบบด้วยสถาปัตยกรรมแบบ **Hybrid Full-stack Architecture** ที่มีความยืดหยุ่นสูง:

1. **Dual-Mode Operation (ทำงานได้ทั้งแบบมีและไม่มี Backend):**
   - **Online API Mode:** เชื่อมต่อกับ PHP REST API Backend (`infinityfree_package`) สำหรับการบันทึกข้อมูลถาวร (บัญชีผู้ใช้, ประกาศขาย, คำสั่งซื้อ, การตรวจสอบสลิป, การส่งอีเมลแจ้งเตือน)
   - **Offline / Standalone Demo Mode:** หากระบบตรวจพบว่าเซิร์ฟเวอร์ยังไม่พร้อมใช้งานหรือทำงานแบบ Client-only เว็บแอปจะสลับการทำงานอัตโนมัติมาใช้ `localStorage` ร่วมกับชุดข้อมูล Mock Data คุณภาพสูง ทำให้สามารถทดสอบและพรีวิวระบบได้ทันที 100% โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์
2. **Integrated PHP Backend & Telemetry Command Deck (`infinityfree_package/`):**
   - พัฒนาด้วย PHP 8+ สไตล์ Modern น้ำหนักเบา ปรับแต่งให้รองรับ Shared Hosting ทั่วไปและ InfinityFree ได้อย่างไร้รอยต่อ
   - หน้าควบคุมระบบ **Two-Tier Telemetry Command Deck** ที่หน้าแรก (`/`):
     - **Tier 1 (Hero Command Panels):** Live Gateway Pulse แสดงค่า Latency เรียลไทม์และ Throughput (GET/POST), BookLoop C2C Moderation Queue แสดงยอดรอตรวจสอบพร้อมปุ่มลัดตรวจคัดกรอง, และ Sentry Guard ตรวจจับ HTTP 4xx/5xx รวมถึง CORS rejections
     - **Tier 2 (System Specs Ribbon):** แถบสรุปสเปกระบบแบบกระชับ (API Endpoints, PHP Version, PHPMailer, Flock JSON Database, Runtime Node)
   - **ระบบ Moderation ปลอดภัย (Safe C2C Queue):** คัดกรองประกาศขายหนังสือพร้อมแสดงภาพหน้าปก บัตรสภาพหนังสือ และเรื่องราวความประทับใจ รองรับการอนุมัติ/ระงับแบบ Soft-delete (`archived`) ไม่ทำลายข้อมูลหรือไฟล์ภาพ โดยมีระบบรักษาความปลอดภัยด้วย `ADMIN_TOKEN` (Fail-closed)
   - ระบบจัดเก็บข้อมูลแบบ Atomic File-based JSON Store พร้อมการล็อกไฟล์ `flock(LOCK_EX)` ป้องกัน Race Condition และรองรับการเชื่อมต่อฐานข้อมูล MySQL
3. **Anti-Bot Challenge Development Proxy (`vite-proxy.ts`):**
   - ระบบ Dev Proxy อัจฉริยะที่ช่วยคำนวณและ bypass ระบบตรวจจับบอต (`aes.js` / `__test` cookie) ของโฮสติ้งฟรีอย่าง InfinityFree โดยอัตโนมัติ ช่วยให้นักพัฒนาสามารถรัน Vite Localhost และยิง API ไปยัง Production ได้อย่างราบรื่น
4. **Client-Side Image Compression (`imageCompressor.ts`):**
   - ระบบบีบอัดและปรับขนาดรูปภาพผ่าน HTML5 Canvas ในเครื่องผู้ใช้ก่อนส่งขึ้นเซิร์ฟเวอร์ ช่วยลดขนาดไฟล์ภาพลงถึง 70–90% ทำให้การอัปโหลดรวดเร็วและประหยัด Bandwidth

---

## 🚀 ฟีเจอร์หลัก (Key Features)

### 🛒 1. การค้นหาและเลือกชมหนังสือ (Marketplace & Discovery)
- **หน้าแรกแบบ Interactive:** Hero section พร้อม 3D elements (Three.js), แอนิเมชันจาก Motion, ป้ายความน่าเชื่อถือ (Trust Strip) และเรื่องราวของชุมชน
- **ระบบแนะนำหนังสืออัจฉริยะ (Personalized Recommendations):** แนะนำหนังสือตามแนวที่ผู้ใช้อ่าน ความนิยม และประวัติการเข้าชม
- **ระบบค้นหาและตัวกรองละเอียด (Multi-facet Filters):** กรองตามหมวดหมู่, ช่วงราคา (Price Slider), ระดับสภาพหนังสือ, เรตติ้ง และสถานะสต็อก
- **มุมมองที่หลากหลาย:** สลับมุมมองระหว่างแบบตาราง (Grid View) และแบบรายการ (List View) พร้อมระบบแบ่งหน้า (Pagination)

### 📖 2. หน้ารายละเอียดหนังสือ (Book Detail Page)
- **Condition Strip:** แถบแสดงและอธิบายระดับสภาพหนังสืออย่างชัดเจน (สภาพเหมือนใหม่, สภาพดีมาก, สภาพดี, สภาพพอใช้)
- **แกลเลอรีรูปภาพแบบโต้ตอบ:** แสดงรูปภาพหลายมุมมองพร้อม Thumbnail และ Zoom preview
- **ตารางข้อมูลจำเพาะ (Specs Table):** ISBN, จำนวนหน้า, ภาษา, ปีที่พิมพ์, น้ำหนัก, ขนาด
- **การ์ดผู้ขายและรีวิวชุมชน (Seller Card & Community Reviews):** แสดงข้อมูลผู้ขาย คะแนนความน่าเชื่อถือ ป้ายสัญลักษณ์ (Badges) และรีวิวจากผู้ซื้อจริง
- **Mobile Sticky Purchase Bar:** แถบสั่งซื้อแบบติดขอบล่างหน้าจอสำหรับผู้ใช้งานสมาร์ทโฟน

### ✍️ 3. ระบบลงขายหนังสือทีละขั้นตอน (Multi-Step Sell Flow)
- **Interactive Listing Wizard:** แบ่งขั้นตอนชัดเจน 4 สเต็ป พร้อม Progress Indicator
  1. **ข้อมูลหนังสือ (Book Information):** ชื่อเรื่อง, ผู้แต่ง, หมวดหมู่, สำนักพิมพ์, รายละเอียด
  2. **ระดับสภาพหนังสือ (Condition Assessment):** ประเมินสภาพตามมาตรฐานพร้อมคำอธิบายและแนวทางตรวจเช็ก
  3. **เรื่องราวและความทรงจำ (Book Story):** พื้นที่เล่าความประทับใจและที่มาของหนังสือเล่มนี้
  4. **ราคาและการจัดส่ง (Smart Pricing & Delivery):** ระบุราคาปก ราคาขาย คำนวณส่วนลดอัตโนมัติ และเลือกรูปแบบการจัดส่ง
- **ระบบอัปโหลดภาพแบบ Drag & Drop:** รองรับการจัดเรียงรูปภาพ เลือกภาพหน้าปก และบีบอัดภาพอัตโนมัติก่อนส่ง

### 🛍️ 4. ระบบสั่งซื้อและการชำระเงิน (Checkout & Payment Flow)
- **Checkout Stepper 4 ขั้นตอน:**
  1. ที่อยู่สำหรับจัดส่ง (บันทึกและสลับที่อยู่ได้)
  2. วิธีการจัดส่ง (Standard, Express, ส่งด่วนพิเศษ)
  3. วิธีการชำระเงิน (พร้อมเพย์ QR, โอนผ่านธนาคาร, เก็บเงินปลายทาง COD)
  4. ตรวจสอบสรุปรายการและยืนยันคำสั่งซื้อ
- **PromptPay QR Simulator:** จำลองการสร้าง QR Code พร้อมเพย์ตามยอดชำระจริง พร้อมเวลานับถอยหลังและช่องอัปโหลดสลิป
- **ระบบติดตามสถานะคำสั่งซื้อ (Order Tracking Modal & Timeline):** แสดง Timeline ตั้งแต่สั่งซื้อ, รอตรวจสอบชำระเงิน, กำลังจัดเตรียม, จัดส่งแล้ว และสำเร็จ

### 👤 5. แดชบอร์ดผู้ใช้งานและศูนย์รวมผู้ขาย (Account & Seller Hub)
- **โปรไฟล์และความปลอดภัย:** แก้ไขข้อมูลส่วนตัว เปลี่ยนรหัสผ่าน จัดการที่อยู่
- **แดชบอร์ดผู้ขาย (Seller Dashboard):** ดูรายการหนังสือที่ลงขาย, สถิติยอดขายรวม, สถานะการขาย (กำลังขาย/ขายแล้ว)
- **ระบบตรวจสอบเนื้อหา (Content Moderation Pipeline):** รองรับสถานะการตรวจสอบประกาศ (รออนุมัติ / ผ่านการอนุมัติ / ถูกปฏิเสธ)
- **Wishlist & Recently Viewed:** จัดการหนังสือที่อยากได้ และดูประวัติหนังสือที่เคยเปิดดู
- **Price Alert:** ตั้งค่าแจ้งเตือนเมื่อหนังสือเล่มที่สนใจมีการปรับลดราคา

### 🎯 6. ระบบ Onboarding & กู้คืนรหัสผ่าน
- **Reader Onboarding:** แบบสอบถามความสนใจและเป้าหมายการอ่านสำหรับสมาชิกใหม่ เพื่อจัดหน้าฟีดตามความชอบ
- **Password Recovery Flow:** ระบบขอลิงก์รีเซ็ตรหัสผ่านทางอีเมล (รองรับ SMTP ผ่าน PHPMailer) พร้อมหน้ารีเซ็ตรหัสผ่านด้วย Token

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend
- **Core:** [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Material UI v9 (MUI)](https://mui.com/) + Emotion
- **Routing:** [React Router 7](https://reactrouter.com/) (Data routing & dynamic basename)
- **Motion & 3D:** [Motion (Framer Motion v12)](https://motion.dev/) + [Three.js](https://threejs.org/)
- **Icons & UI Feedback:** [Lucide React](https://lucide.dev/), [MUI Icons](https://mui.com/material-ui/material-icons/), [SweetAlert2](https://sweetalert2.github.io/)
- **State Management:** React Context Architecture + Custom Hooks + `localStorage` Synchronization

### Backend & Serverless Bundle (`infinityfree_package/`)
- **Runtime:** PHP 7.4 - 8.2+
- **Data Persistence:** File-based Atomic JSON DB (พร้อม concurrency lock `flock`) และรองรับ MySQL
- **Mailing Service:** [PHPMailer](https://github.com/PHPMailer/PHPMailer) สำหรับระบบส่งอีเมลยืนยันและรีเซ็ตรหัสผ่าน
- **Web Server Config:** Apache `.htaccess` พร้อมการจัดการ CORS และ Security Headers
- **Monitoring & Moderation:** Two-Tier PHP Telemetry Command Deck & Safe C2C Review Queue (ส่วน moderation ต้องใช้ `ADMIN_TOKEN`)

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
bookloop-socialmediamarketing/
├── .github/workflows/          # GitHub Actions (CI/CD Deployment)
├── assets/                     # เอกสารและไฟล์ประกอบ
├── infinityfree_package/       # PHP Backend & Production Package (htdocs)
│   ├── api/                    # REST API Endpoints (25+ endpoints)
│   │   ├── auth_login.php      # เข้าสู่ระบบ
│   │   ├── auth_register.php   # สมัครสมาชิก
│   │   ├── auth_me.php         # ตรวจสอบ session token
│   │   ├── listings_create.php # สร้างประกาศขายหนังสือ
│   │   ├── listings_list.php   # รายการประกาศขาย + คัดกรอง
│   │   ├── listings_moderate.php# อนุมัติ/ปฏิเสธประกาศขาย
│   │   ├── orders_create.php   # สร้างคำสั่งซื้อ
│   │   ├── orders_list.php     # รายการคำสั่งซื้อ
│   │   └── ...
│   ├── app/                    # Frontend build สำหรับรัน same-origin บน PHP host
│   ├── config/                 # ค่าคอนฟิกและการโหลด .env
│   ├── data/                   # ที่เก็บไฟล์ฐานข้อมูล JSON (users, orders, listings)
│   ├── email/                  # เทมเพลตอีเมล HTML
│   ├── Services/               # คลาสช่วยเหลือ (Http, RateLimiter, CORS)
│   ├── vendor/                 # Composer dependencies (PHPMailer)
│   ├── .env.example            # ตัวอย่างการตั้งค่าสภาพแวดล้อม backend
│   ├── .htaccess               # Apache rewrite rules และ CORS headers
│   └── index.php               # System Diagnostics & Health Dashboard
├── public/                     # Static public assets
├── src/                        # โค้ดต้นฉบับ Frontend
│   ├── app/                    # Router configuration
│   ├── assets/                 # ภาพประกอบ โลโก้
│   ├── components/             # Reusable UI Components แยกตามโมดูล
│   │   ├── auth/               # RequireAuth guard
│   │   ├── bookdetail/         # BookGallery, ConditionStrip, PurchaseBox, SpecsTable
│   │   ├── books/              # BookFilterSidebar, ActiveFilters, Pagination
│   │   ├── cart/               # CartItemCard, CartOrderSummary, EmptyState
│   │   ├── checkout/           # CheckoutStepper, Address, Shipping, PromptPayDemo
│   │   ├── common/             # SafeImage, SearchBar, ErrorBoundary, TiltCard
│   │   ├── discovery/          # Three.js 3D Interactive Scenes
│   │   ├── home/               # Hero, Recommendations, CategoryExplorer, TrustStrip
│   │   ├── layout/             # Header, Footer, MobileBottomNav, AppMobileDrawer
│   │   ├── navbar/             # AuthButton, UserMenu
│   │   ├── notification/       # NotificationBell
│   │   ├── orders/             # OrderTimeline, OrderTrackingModal
│   │   └── sell/               # SellBookForm, ConditionSelector, ImageUpload, Pricing
│   ├── context/                # React Contexts (Auth, Cart, Wishlist, Notification, etc.)
│   ├── data/                   # Mock Books, Categories, Onboarding options
│   ├── hooks/                  # Custom Hooks (useAuth, useCart, useWishlist, useApiHealth)
│   ├── layouts/                # AppLayout
│   ├── pages/                  # หน้าเพจทั้งหมด (Lazy loaded)
│   ├── routes/                 # ProtectedRoute
│   ├── services/               # API Clients (apiClient, authService, listingService, orderService)
│   ├── theme/                  # MUI Theme & Swiss Design Tokens
│   ├── types/                  # TypeScript Interfaces & Types
│   ├── utils/                  # Utility functions (alerts, imageCompressor, formatCurrency)
│   ├── App.tsx                 # Root Component & Providers
│   ├── index.css               # Tailwind CSS v4 directives & Global styles
│   └── main.tsx                # Entry point
├── .env.example                # ตัวอย่างการตั้งค่า frontend
├── package.json                # Project dependencies และ scripts
├── tsconfig.json               # TypeScript config (Path alias: @/*)
├── vite.config.ts              # Vite config, chunk splitting & dev proxy
└── vite-proxy.ts               # Vite proxy plugin สำหรับ bypass anti-bot challenge
```

---

## 💻 เริ่มต้นใช้งาน (Getting Started)

### สิ่งที่จำเป็นต้องมีในเครื่อง (Prerequisites)
- [Node.js](https://nodejs.org/) version 18.0 ขึ้นไป
- `npm` หรือ `bun`
- *(ทางเลือกสำหรับรัน Backend ในเครื่อง)*: [PHP](https://www.php.net/) 7.4 ขึ้นไป

### 1. ติดตั้ง Dependencies
```bash
git clone https://github.com/SolightzZ/bookloop-socialmediamarketing.git
cd bookloop-socialmediamarketing
npm install
```

### 2. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```
กำหนดค่า `VITE_API_BASE_URL`:
- **รันคู่กับ Backend ในเครื่อง:** `http://localhost:8000/api` หรือปล่อยว่างไว้เพื่อใช้ `/api` proxy
- **เชื่อมกับ Production Hosting (InfinityFree):** `https://panitijahem.xo.je/api`

### 3. รันในโหมดพัฒนา (Development)

#### ทางเลือก A: รันเฉพาะ Frontend (แนะนำสำหรับการพัฒนา UI ทั่วไป)
```bash
npm run dev
```
เปิดบราวเซอร์ที่ [http://localhost:3000](http://localhost:3000) (หากไม่ต่อ Backend ระบบจะใช้ Offline Demo Mode อัตโนมัติ)

#### ทางเลือก B: รัน Fullstack ทั้ง Frontend และ Backend ในเครื่อง
เปิด Terminal ที่ 1 — รัน PHP Backend:
```bash
npm run dev:backend
```
*(Backend Server จะเริ่มต้นที่ http://127.0.0.1:8000 โดยสามารถเปิดดูหน้า System Dashboard ได้ที่ http://127.0.0.1:8000/)*

เปิด Terminal ที่ 2 — รัน Frontend:
```bash
npm run dev
```

---

## 📜 คำสั่งที่ใช้บ่อย (Available Scripts)

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | เริ่มต้น Vite dev server บนพอร์ต `3000` (พร้อม Reverse Proxy ชี้ไปยัง backend) |
| `npm run dev:backend` | รันเซิร์ฟเวอร์ PHP ในเครื่องบนพอร์ต `8000` ชี้ไปยัง `infinityfree_package/` |
| `npm run build` | สร้าง Production build สำหรับ GitHub Pages หรือ Web Server ทั่วไป (โฟลเดอร์ `dist/`) |
| `npm run build:app` | สร้าง Production build ด้วย base path `/app/` สำหรับวางใน `infinityfree_package/app/` |
| `npm run preview` | พรีวิวผลลัพธ์ของไฟล์ production build ในเครื่อง |
| `npm run lint` | ตรวจสอบความถูกต้องของ TypeScript Types ทั้งหมด (`tsc --noEmit`) |
| `npm run clean` | ลบโฟลเดอร์ `dist/` และไฟล์แคชที่สร้างขึ้น |

---

## 🚢 แนวทางการ Deploy (Deployment Guides)

### 1. Deploy บน GitHub Pages
โปรเจกต์มีระบบ Automated CI/CD ผ่าน GitHub Actions อยู่ที่ `.github/workflows/deploy.yml` ซึ่งจะ build และ deploy อัตโนมัติเมื่อ push โค้ดไปยัง branch `main` หรือ `dev`

**การเปิดใช้งาน:**
1. ไปที่ GitHub Repository: **Settings → Pages**
2. ภายใต้ **Build and deployment → Source** ให้เลือก **GitHub Actions**
3. Push โค้ดหรือกด **Run workflow** ในแท็บ Actions
4. เข้าชมเว็บไซต์ได้ที่:
   ```text
   https://<username>.github.io/bookloop-socialmediamarketing/
   ```

### 2. Deploy บน InfinityFree หรือ Apache Shared Hosting (Fullstack)
หากต้องการใช้งานทั้งระบบ Backend (PHP, ระบบบันทึกข้อมูล, ส่งอีเมล) และหน้าเว็บร่วมกัน:
1. รันคำสั่งสร้าง bundle แอป:
   ```bash
   npm run build:app
   ```
2. คัดลอกผลลัพธ์ใน `dist/*` ไปวางไว้ในโฟลเดอร์ `infinityfree_package/app/`
3. อัปโหลดเนื้อหาทั้งหมดภายในโฟลเดอร์ `infinityfree_package/` (รวมถึงไฟล์ `.htaccess` และ `.env`) ขึ้นไปยังไดเรกทอรี `htdocs/` บนเซิร์ฟเวอร์ผ่าน FTP หรือ File Manager
4. ตั้งค่าความปลอดภัยและสิทธิ์โฟลเดอร์:
   - ตรวจสอบว่าไดเรกทอรี `data/` มีสิทธิ์เขียนไฟล์ (`0755` หรือ `0775`)
   - ตั้งค่าอีเมล SMTP ในไฟล์ `.env` บนเซิร์ฟเวอร์
5. ตรวจสอบการทำงาน:
   - เข้าดูสถานะระบบได้ที่: `https://your-domain.com/` (System Dashboard)
   - เข้าใช้งานเว็บแอปได้ที่: `https://your-domain.com/app/`

---

## 📡 สรุปรายการ API Endpoints (`/api/*.php`)

| หมวดหมู่ | Endpoint | Method | คำอธิบาย |
|---|---|---|---|
| **Auth** | `/api/auth_register.php` | `POST` | สมัครสมาชิกใหม่พร้อมตรวจสอบความซ้ำซ้อน |
| **Auth** | `/api/auth_login.php` | `POST` | เข้าสู่ระบบและรับ Session Token (อายุ 7 วัน) |
| **Auth** | `/api/auth_me.php` | `GET/POST` | ตรวจสอบสถานะ Token และดึงข้อมูลผู้ใช้ปัจจุบัน (แนะนำ POST: token ใน body) |
| **Auth** | `/api/auth_logout.php` | `POST` | ออกจากระบบและยกเลิก Session Token |
| **Auth** | `/api/auth_update_profile.php` | `POST` | อัปเดตข้อมูลส่วนตัวและที่อยู่ |
| **Auth** | `/api/auth_change_password.php`| `POST` | เปลี่ยนรหัสผ่านของผู้ใช้ |
| **Auth** | `/api/auth_forgot_password.php`| `POST` | ส่งอีเมลลิงก์กู้คืนรหัสผ่าน (PHPMailer SMTP) |
| **Auth** | `/api/auth_reset_password.php` | `POST` | รีเซ็ตรหัสผ่านด้วย Token ที่ได้รับทางเมล |
| **Auth** | `/api/auth_onboarding.php` | `POST` | บันทึกความสนใจหมวดหมู่หนังสือและสไตล์การอ่าน |
| **Auth** | `/api/auth_delete_account.php` | `POST` | ลบบัญชีผู้ใช้งาน |
| **Listings** | `/api/listings_create.php` | `POST` | สร้างประกาศขายหนังสือใหม่พร้อมอัปโหลดภาพ |
| **Listings** | `/api/listings_list.php` | `GET/POST` | ดึงรายการประกาศขายหนังสือพร้อมตัวกรอง (`mine=1` แนะนำ POST) |
| **Listings** | `/api/listings_update.php` | `POST` | แก้ไขข้อมูลประกาศขาย หรือเปลี่ยนสถานะ |
| **Listings** | `/api/listings_moderate.php` | `POST` | ตรวจสอบและอนุมัติ/ปฏิเสธประกาศขาย (เฉพาะผู้ดูแล `ADMIN_TOKEN`) |
| **Orders** | `/api/orders_create.php` | `POST` | สร้างคำสั่งซื้อใหม่และคำนวณยอดชำระ |
| **Orders** | `/api/orders_list.php` | `GET/POST` | ดูรายการคำสั่งซื้อของผู้ใช้ (แนะนำ POST) |
| **Orders** | `/api/orders_detail.php` | `GET/POST` | ดูรายละเอียดคำสั่งซื้อและ Timeline การจัดส่ง (แนะนำ POST) |
| **Orders** | `/api/orders_update_status.php`| `POST` | อัปเดตสถานะคำสั่งซื้อหรือสลิปชำระเงิน |
| **Newsletter** | `/api/subscribe.php` | `POST` | สมัครรับจดหมายข่าว |
| **Telemetry** | `/api/track.php` | `POST` | บันทึกสถิติการเข้าชมและเหตุการณ์สำคัญ |
| **Telemetry** | `/api/log.php` | `POST` | รับ Error Logs ฝั่ง Client เพื่อการเฝ้าระวังระบบ |

---

## 🏛️ ข้อควรระวังและสถาปัตยกรรมเชิงเทคนิค (Engineering Notes)

- **Path Aliasing:** กำหนด path alias `@/*` อ้างอิงจากโฟลเดอร์รากของโปรเจกต์ สะดวกในการ import โค้ด
- **ลำดับการห่อหุ้ม Provider (Provider Nesting Order):**
  ```text
  ErrorBoundary → ThemeProvider → AuthProvider → CartProvider 
  → WishlistProvider → NotificationProvider → RecentlyViewedProvider → PriceAlertProvider
  ```
- **การส่ง Token บน Shared Hosting:**
  Shared Hosting มักจะลบ `Authorization: Bearer <token>` ออกจาก HTTP Request Header ก่อนถึง PHP สคริปต์ ตัว `apiClient.ts` จึงส่ง Token ผ่าน Request Body (`POST`, วิธีหลัก — Token ไม่ปรากฏใน URL) และมี `getPublic()` สำหรับ endpoint สาธารณะที่ไม่แนบ Token เลย เพื่อความเสถียรและความปลอดภัย
- **Tailwind CSS v4 Configuration:**
  ใช้ Tailwind CSS เวอร์ชัน 4 แบบ CSS-first ผ่าน `@tailwindcss/vite` plugin โดยไม่ต้องมี `tailwind.config.js` แต่กำหนดค่าผ่าน `src/index.css`
- **ระบบความปลอดภัยของรหัสผ่าน:**
  รหัสผ่านถูกแฮชด้วย bcrypt (`password_hash`/`password_verify` มาตรฐาน PHP) นโยบายรหัสผ่านใหม่คือยาวอย่างน้อย 8 ตัวอักษร ไม่เกิน 72 ตัวอักษร (บังคับทั้ง Frontend และ Backend) และ Token ถูกจัดเก็บอย่างปลอดภัยพร้อมกลไก Session Deduplication

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้ใบอนุญาต **[MIT License](LICENSE)** สามารถนำไปศึกษา พัฒนาต่อยอด หรือใช้งานได้อย่างอิสระ
