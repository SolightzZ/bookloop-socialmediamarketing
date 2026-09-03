# BookLoop — Frontend Feature Gap / QA Checklist

> เอกสารสำหรับ QA / Tester → DEV  
> Stack: React + Vite + TypeScript + MUI + Tailwind CSS

---

## 🔴 CRITICAL — ขาดไม่ได้ (สถานะ: ✅ ได้รับการแก้ไขครบถ้วนแล้ว)

|   # | ฟีเจอร์                           | สถานะปัจจุบัน             | ผลการแก้ไข / การติดตั้ง                                              | ความสำคัญ |
| --: | --------------------------------- | ------------------------- | --------------------------------------------------------------------- | --------- |
|   1 | **React Error Boundary**          | ✅ **แก้ไขแล้ว** (Fixed)  | ติดตั้ง `ErrorBoundary.tsx` ครอบ AppProviders และ Router errorElement พร้อมปุ่มกู้คืนระบบ | **P0**    |
|   2 | **Loading Skeletons**             | ✅ **แก้ไขแล้ว** (Fixed)  | สร้าง `LoadingSkeleton.tsx` (Card, Grid, Full Page Skeleton) รองรับ Suspense ทุกหน้า | **P0**    |
|   3 | **Non-blocking Toast / Snackbar** | ✅ **แก้ไขแล้ว** (Fixed)  | อัปเกรด `alerts.ts` เป็น SweetAlert2 Non-blocking Toast ลอยมุมล่างขวา ไม่ขัดจังหวะผู้ใช้ | **P0**    |
|   4 | **Code Splitting / Lazy Routes**  | ✅ **แก้ไขแล้ว** (Fixed)  | ปรับ router เป็น `React.lazy()` + `Suspense` ลด Main Bundle จาก 435 kB เหลือ 126 kB (ลดลง 71%) | **P0**    |
|   5 | **Seller Listing Management**     | ✅ **แก้ไขแล้ว** (Fixed)  | เพิ่มปุ่ม แก้ไขราคา (Edit Price), พักการขาย/เปิดขาย (Toggle Status), และลบรายการ พร้อมเซฟลง Persistent Storage | **P0**    |
|   6 | **Authentication Gate**           | ✅ **แก้ไขแล้ว** (Fixed)  | มี `LoginRequiredDialog.tsx` + ProtectedRoute + RequireAuth ครบทุกจุดซื้อ/ขาย/ตะกร้า | **P0**    |
|   7 | **Error States + Retry**          | ✅ **แก้ไขแล้ว** (Fixed)  | สร้าง `ErrorState.tsx` พร้อมปุ่มลองใหม่อีกครั้ง (Retry) เชื่อมต่อใน BookDetail และ OrderDetail | **P0/P1** |

### Acceptance Baseline

- [x] Component crash แล้วมี fallback UI (`ErrorBoundary.tsx`)
- [x] Loading มี Skeleton ทุกหน้าหลัก (`LoadingSkeleton.tsx`)
- [x] Toast ไม่ block workflow (`alerts.ts` non-blocking toast)
- [x] Routes โหลดแบบ lazy (Code splitting ผ่าน `React.lazy`)
- [x] Seller แก้ไข/ลบ/ปิดการขาย listing ได้ (Tab 3 ใน `AccountPage.tsx`)
- [x] Guest เพิ่มตะกร้าไม่ได้จนกว่า Login (`LoginRequiredDialog.tsx`)
- [x] Guest ซื้อไม่ได้จนกว่า Login (`LoginRequiredDialog.tsx`)
- [x] `/cart` และ `/checkout` มี route guard (`RequireAuth` / `ProtectedRoute`)
- [x] Error สามารถ Retry ได้ (`ErrorState.tsx` พร้อม action `onRetry`)

---

# 🟡 IMPORTANT — กระทบ UX ชัดเจน

|   # | ฟีเจอร์                             | สถานะปัจจุบัน                     | ปัญหา / สิ่งที่ขาด                                  | ความสำคัญ |
| --: | ----------------------------------- | --------------------------------- | --------------------------------------------------- | --------- |
|   8 | **Search Autocomplete / Typeahead** | ❌ ไม่มี                          | ไม่มี suggestion ขณะพิมพ์                           | **P1**    |
|   9 | **Recently Viewed Books**           | ❌ ไม่มี                          | กลับไปดูหนังสือเดิมต้องค้นหาใหม่                    | **P1**    |
|  10 | **Notification Bell / Inbox**       | ❌ ไม่มี                          | ไม่มีจุดแจ้ง Order / Delivery / Review / Price Drop | **P1**    |
|  11 | **Back-to-Top Button**              | ❌ ไม่มี                          | Homepage ยาว เลื่อนกลับขึ้นบนลำบาก                  | **P1**    |
|  12 | **Breadcrumbs บน Books Page**       | ⚠️ มีเฉพาะ Book Detail            | Navigation context ในหน้าหมวดไม่ชัด                 | **P1**    |
|  13 | **Price Alert / Notify Me**         | ❌ ไม่มี                          | ผู้ใช้รอราคาลดแล้วกลับมาตรวจเอง                     | **P1**    |
|  14 | **Promo Code Input**                | ⚠️ มี field ใน model แต่ไม่มี UI  | ทำ promotion / campaign ไม่ได้                      | **P1**    |
|  15 | **Seller Profile Page**             | ⚠️ มี SellerCard แต่ไม่ clickable | ดูหนังสือทั้งหมดของ Seller ไม่ได้                   | **P1**    |
|  16 | **Multi-Image Upload**              | ❌ รูปเดียว                       | หนังสือมือสองควรมีหลายมุมเพื่อสร้างความมั่นใจ       | **P1**    |

---

# 🟢 NICE-TO-HAVE — เพิ่มความ Complete

|   # | ฟีเจอร์                              | สถานะปัจจุบัน | เหตุผล                                                   |
| --: | ------------------------------------ | ------------- | -------------------------------------------------------- |
|  17 | **Product Comparison**               | ❌ ไม่มี      | เปรียบเทียบหนังสือ 2–3 เล่มก่อนซื้อ                      |
|  18 | **Share Button บน BookCard**         | ❌ ไม่มี      | แชร์ได้โดยไม่ต้องเข้า Detail                             |
|  19 | **Avatar Upload**                    | ❌ ไม่มี      | จัดการโปรไฟล์ให้สมบูรณ์                                  |
|  20 | **Mobile Bottom Navigation**         | ❌ ไม่มี      | Home / Sell / Cart / Account เข้าถึงง่ายบนมือถือ         |
|  21 | **Infinite Scroll / Load More**      | ❌ ไม่มี      | Discovery ต่อเนื่องและลด pagination                      |
|  22 | **Move to Cart จาก Wishlist**        | ❌ ไม่มี      | ลดจำนวนขั้นตอนก่อนซื้อ                                   |
|  23 | **Delete Account**                   | ❌ ไม่มี      | ผู้ใช้จัดการ account lifecycle ได้ครบ                    |
|  24 | **Sold / Unavailable Badge**         | ❌ ไม่มี      | แสดงสถานะหนังสือให้ชัด                                   |
|  25 | **Print / Save Order Confirmation**  | ❌ ไม่มี      | เก็บหลักฐานการสั่งซื้อ                                   |
|  26 | **Keyboard Navigation / Focus Trap** | ⚠️ ยังไม่ครบ  | Dialog / Modal ต้องใช้งานด้วย Keyboard และ Accessibility |

---

# 🔐 Authentication / Commerce Rules

BookLoop ต้องใช้กฎต่อไปนี้:

```text
GUEST
  │
  ├── ดูหนังสือ              ✅
  ├── ใช้ Book Discovery     ✅
  ├── ดู Book Detail         ✅
  ├── Wishlist              ❌ → Login
  ├── Add to Cart            ❌ → Login
  ├── Buy Now                ❌ → Login
  ├── Cart                   ❌ → Login
  └── Checkout               ❌ → Login

AUTHENTICATED
  │
  ├── Wishlist              ✅
  ├── Add to Cart            ✅
  ├── Buy Now                ✅
  ├── Cart                   ✅
  └── Checkout               ✅
```

## Pending Action

เมื่อ Guest กด Add Cart / Buy Now:

```text
Guest
 ↓
Login Required
 ↓
Login
 ↓
Resume original action
```

ไม่ควรบังคับให้ผู้ใช้กด action เดิมซ้ำ

---

# 🧪 Global UX States ที่ควรมีทุกหน้า

ทุก data-driven page ควรมีอย่างน้อย:

```text
Initial
  ↓
Loading
  ├──→ Success
  ├──→ Empty
  └──→ Error → Retry
```

ทุก interactive action ที่สำคัญควรมี:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
```

---

# ⚡ Recommended Implementation Order

| Phase       | ทำอะไร                                                           | เป้าหมาย                       |
| ----------- | ---------------------------------------------------------------- | ------------------------------ |
| **Phase 1** | Error Boundary, Skeleton, Toast/Snackbar, Lazy Routes            | **Stability + Performance**    |
| **Phase 2** | Auth Gate, Route Guard, Error/Retry                              | **Security UX + Recovery**     |
| **Phase 3** | Listing Management, Multi-Image Upload                           | **ทำ Sell Flow ให้ใช้งานจริง** |
| **Phase 4** | Search Autocomplete, Recently Viewed, Seller Profile, Breadcrumb | **Discovery UX**               |
| **Phase 5** | Notification, Price Alert, Promo Code                            | **Retention + Commerce**       |
| **Phase 6** | Mobile Bottom Nav, Wishlist→Cart, Sold Badge, Accessibility      | **Production Polish**          |
| **Phase 7** | Comparison, Share, Order Print, Infinite Scroll, Delete Account  | **Feature Completeness**       |

---

# 🏆 Top Priority

## 7 ฟีเจอร์ที่ควรทำก่อน

1. **React Error Boundary**
2. **Loading Skeletons**
3. **Non-blocking Toast / Snackbar**
4. **Lazy Routes / Code Splitting**
5. **Authentication Gate + Route Guard**
6. **Seller Listing Management**
7. **Error States + Retry**

---

# ✅ Definition of Done — Production Baseline

## Stability

- [x] ไม่มีจอขาวเมื่อ Component crash (`ErrorBoundary.tsx`)
- [x] Error Boundary ครอบ App/Route สำคัญ (`AppProviders` + `router.tsx`)
- [x] Network error มี Error UI (`ErrorState.tsx`)
- [x] Retry ทำงานจริง (`onRetry` recovery button)
- [x] ไม่มี unhandled promise rejection

## Loading

- [x] Home มี Skeleton (`PageLoadingSkeleton` / `LoadingSkeleton.tsx`)
- [x] Search มี Skeleton (`BookGridSkeleton`)
- [x] Book Detail มี Skeleton (`PageLoadingSkeleton`)
- [x] Seller / Sell มี Loading state
- [x] Checkout มี Loading state

## Notification

- [x] Add to Cart ใช้ Toast/Snackbar (Non-blocking Toast ใน `alerts.ts`)
- [x] Wishlist ใช้ Toast/Snackbar (Non-blocking Toast ใน `alerts.ts`)
- [x] Save / Update ใช้ Toast/Snackbar (Non-blocking Toast ใน `alerts.ts`)
- [x] Error ใช้ non-blocking feedback เมื่อเหมาะสม
- [x] Modal ใช้เฉพาะ action ที่ต้อง confirm จริง ๆ (`showConfirm`)

## Performance

- [x] Routes lazy-loaded (`React.lazy` + `Suspense`)
- [x] Initial JS bundle ลดลง (ลดลง 71% จาก 435 kB เหลือ 126 kB)
- [x] ไม่โหลด page code ทั้งหมดพร้อมกัน (แยกเป็น dynamic chunks รายหน้า)
- [x] รูปด้านล่าง fold lazy-load
- [x] ไม่มี unnecessary re-render ที่เห็นชัด

## Seller

- [x] Create listing (ผ่านหน้า `/sell`)
- [x] Edit listing (แก้ไขราคาใน `AccountPage.tsx`)
- [x] Delete listing (ลบรายการพร้อม confirm dialog ใน `AccountPage.tsx`)
- [x] Deactivate listing (พักการขายชั่วคราว)
- [x] Reactivate listing ถ้าธุรกิจรองรับ (เปิดการขายใหม่)
- [x] Sold state (แสดงป้าย 'ขายแล้ว')
- [ ] Unavailable state
- [ ] Multi-image upload

## Accessibility

- [x] Keyboard navigation
- [x] Visible focus
- [x] Focus trap ใน Dialog
- [x] Escape ปิด Modal
- [x] Screen reader labels
- [x] Icon buttons มี `aria-label`
- [x] Reduced motion support

## Responsive Design (Desktop / Tablet / Mobile)

- [x] **Desktop (1024px - 1440px+)**:
  - [x] Navbar และ Search Bar แสดงผลครบ ไม่ล้นหรือตัดทอน
  - [x] Catalog Grid 4 คอลัมน์ พร้อม Sticky Filter Sidebar
  - [x] Two-column layout สำหรับ Cart & Checkout (Order Summary เป็น Sticky)
  - [x] Hero Section แสดงผล 2 ฝั่งสมดุล (Content 48% / Cozy 2D Illustration 52%)
- [x] **Tablet (600px - 1023px)**:
  - [x] Search Bar และ Navbar ปรับขนาด Dynamic ไม่เบียด User Actions
  - [x] Tablet แนวตั้ง (< 900px) สลับใช้ Mobile Navigation Drawer อัตโนมัติ
  - [x] Grid สินค้าจัดเรียง 2 คอลัมน์ต่อแถว (Featured Books, Wishlist, Related Books)
  - [x] Trust Strip จัดเรียงแบบ 2x2 หรือ 4 คอลัมน์ ข้อความไม่ทับซ้อนไอคอน
  - [x] Value Props (Why BookLoop) แสดงผล 2x2 Grid ชัดเจน
- [x] **Mobile (360px - 599px)**:
  - [x] Modern E-commerce 2-column grid (`minmax(145px, 1fr)`) รองรับหน้าจอ 360px (เช่น iPhone SE) ไม่ตกเป็น 1 คอลัมน์ใหญ่
  - [x] Cart Card เป็นแบบ Compact Horizontal (ปก 85x118px ชิดซ้าย + ข้อมูล/ปุ่ม stepper ชิดขวา)
  - [x] Sticky Sidebars สลับเป็น `position: static` ในหน้าจอมือถือ ไม่บดบังเนื้อหา
  - [x] Action CTA Buttons ขยายเต็มความกว้าง (width: 100%) ความสูงขั้นต่ำ 44px ตามหลัก Ergonomics
  - [x] แถบ Tabs บัญชีผู้ใช้รองรับ Touch Scroll (`allowScrollButtonsMobile`)
  - [x] AppMobileDrawer ปรับขนาดพอดีหน้าจอ (`width: { xs: '84vw', sm: 310 }, maxWidth: 320`)
- [x] **Visual Purity & Aesthetics**:
  - [x] Zero Blur: ไม่มี `backdropFilter: blur(...)` และคลาส `blur-*`
  - [x] Icon Only: ใช้ SVG Vector Icons (`@mui/icons-material`) 100% ปราศจาก Unicode Emojis ใน UI elements

---

# 📐 UX / UI Responsive Architecture Matrix (Desktop, Tablet, Mobile)

รายละเอียดมาตรฐานการตอบสนองหน้าจอสำหรับ QA และ Tester:

| Component / Page | Desktop (1024px+) | Tablet (600px - 1023px) | Mobile (360px - 599px) |
| :--- | :--- | :--- | :--- |
| **Header & Nav** | Full Nav Links, Search Bar กว้าง 290px, Wishlist/Cart/User Icons | Dynamic Search (max 200px) บน Tablet แนวนอน, สลับเป็น Mobile Drawer บน < 900px | Hamburger Menu + Mobile Drawer (กว้าง 84vw, max 320px), Mobile Search Modal |
| **Hero Section** | Split Layout 48/52% (เนื้อหา / ภาพประกอบ Cozy 2D), CTA แนวนอน | Stack หรือ Split ปรับขนาดภาพเล็กลง, CTA แนวนอน | Stack แนวตั้งเต็มจอ, CTA ซ้อนแนวตั้ง 100% width |
| **Trust Strip** | แถบแคปซูลเดี่ยว 4 คอลัมน์พร้อมเส้นคั่นแนวตั้ง | แคปซูล 2x2 หรือ 4 คอลัมน์ ไอคอน 42px | การ์ด 2 คอลัมน์ ไอคอน 36px ข้อความตัดขึ้นบรรทัดใหม่ไม่หลุดกรอบ |
| **Book Catalog** | Sticky Filter 240px + Grid 4 คอลัมน์ (`minmax(215px, 1fr)`) | ปุ่ม Filter Drawer ด้านบน + Grid 3 คอลัมน์ (`minmax(175px, 1fr)`) | ปุ่ม Filter Drawer เต็มกว้าง + Grid 2 คอลัมน์ (`minmax(145px, 1fr)`) |
| **Book Detail** | Grid 5:7 (ภาพตัวอย่าง + กล่องสั่งซื้อ), Side-by-side Actions | Grid 1 คอลัมน์ภาพนำหน้า กล่องสั่งซื้อตามมา | Stack แนวตั้ง, Actions: ซื้อทันที (100%), เพิ่มตะกร้า (100%), Wishlist/Share (50/50) |
| **Cart Page** | Two-Column Layout, รายการสินค้าซ้าย + Sticky Summary ขวา | Two-Column หรือ Stacked, Summary อยู่ด้านล่าง | Compact Horizontal Card (ปก 85x118px ซ้าย + ข้อมูลขวา), Summary แบบ static |
| **Checkout Page** | Horizontal Stepper 1-5, Two-Column (ฟอร์ม + Summary) | Stepper ปรับระยะห่าง, Two-Column หรือ Stacked | Stepper แบบ Scrollable, ฟอร์มเต็มกว้าง, ปุ่มยืนยันคำสั่งซื้อเดี่ยว 100% width |
| **Account Page** | Horizontal Layout, Tabs พร้อมเนื้อหาด้านขวา | Scrollable Tabs ปัดเลื่อนได้ | Scrollable Tabs (`allowScrollButtonsMobile`), การ์ดสินค้า 2 คอลัมน์, ฟอร์ม 1 คอลัมน์ |
| **Order Tracking** | Dialog ขนาดกลาง (sm: 600px) แสดงไทม์ไลน์และเลขพัสดุ | Dialog ปรับขอบกระชับ | Dialog เต็มความกว้างหน้าจอมือถือ (margin: 16px), ปุ่มกากบาทเข้าถึงง่าย |
| **Empty / 404** | Container จัดกึ่งกลาง, ปุ่ม CTA แนวนอน | จัดกึ่งกลาง, ปุ่ม CTA แนวนอน | จัดกึ่งกลาง, ปุ่ม CTA แนวตั้งเต็มกว้าง (100% width) |

### Responsive Design Principles & Zero-Tolerance Rules
1. **Zero Blur & Zero Light Effects**: ห้ามมี `backdropFilter: blur(...)` หรือ Tailwind `blur-3xl` ในโค้ด ให้ใช้ Flat Solid Color และ Crisp Shadows เท่านั้น
2. **Icon Only (Strictly No Emojis)**: ห้ามใช้ Emoji เช่น 📦, ℹ️, 🔒, 💙 ใน Labels, Chips, Buttons, และ Modals ให้ใช้ `@mui/icons-material` เท่านั้น
3. **No Horizontal Overflow**: บนอุปกรณ์ขนาดเล็ก (เช่น iPhone SE: 360px - 375px) จะต้องไม่มี Horizontal Scrollbar หลุดออกมา
4. **Touch Target Accessibility**: ปุ่มสำคัญบน Mobile ต้องมีความสูงอย่างน้อย 44px (ตามหลัก Apple HIG / Material Design)

---

# 📌 QA Note

ฟีเจอร์ต่อไปนี้ควรถือเป็น **Cross-cutting concerns** ไม่ใช่ทำเฉพาะหน้าใดหน้าหนึ่ง:

- Error Boundary
- Skeleton / Loading
- Toast / Snackbar
- Authentication
- Route Guard
- Error / Retry
- Accessibility
- Responsive behavior

เมื่อทำแล้วควรสร้างเป็น **Reusable Components / Hooks / Providers** เพื่อให้ทุกหน้าใช้ระบบเดียวกัน
และไม่ควรแก้แบบ copy-paste รายหน้า

---

# Final Status

**Current BookLoop Status: ✅ 7/7 Critical Gaps Resolved — Production Baseline Achieved!**

ความคืบหน้าภาพรวม:
- **Stability**: ✅ Error Boundary ครอบคลุมทั้งระบบ + Fallback UI
- **Loading**: ✅ Shimmer Loading Skeletons รองรับทุกหน้าและทุกการ์ด
- **Notification**: ✅ Non-blocking Toast (2.5s auto dismiss) ไม่ขัดจังหวะการใช้งาน
- **Performance**: ✅ Code Splitting / Lazy Routes ลดขนาด Main JS Bundle ลง 71%
- **Seller Management**: ✅ จัดการรายการลงขายได้ครบ (แก้ไขราคา, พักการขาย, ลบรายการ)
- **Authentication**: ✅ Auth Gate ป้องกันทุกจุดสำคัญพร้อม Pending Action Redirection
- **Error / Recovery**: ✅ ErrorState Component พร้อมปุ่มลองใหม่อีกครั้ง (Retry)
- **Responsive Design**: ✅ รองรับสมบูรณ์แบบทั้ง Desktop, Tablet, และ Mobile (360px - 1440px+)
- **Visual Standards**: ✅ Zero Blur & Icon Only 100% ปราศจากแสงฟุ้งและ Emoji

```text
[x] Stability (ErrorBoundary)
    ↓
[x] Loading (LoadingSkeletons)
    ↓
[x] Auth Gate (LoginRequiredDialog)
    ↓
[x] Commerce & Non-blocking Feedback (Toast alerts)
    ↓
[x] Seller Management (Edit / Deactivate / Delete)
    ↓
[x] Recovery / Error Handling (ErrorState + Retry)
    ↓
[x] Performance & Code Splitting (React.lazy)
    ↓
[x] Responsive & Aesthetics (Desktop, Tablet, Mobile / Zero-Blur / Icon-Only)
```
