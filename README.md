# BookLoop — Second-hand Book Marketplace

BookLoop คือแพลตฟอร์มซื้อ–ขายและส่งต่อหนังสือมือสองที่ทำให้หนังสือทุกเล่มมีโอกาสเดินทางไปหาผู้อ่านคนใหม่ พร้อมพื้นที่สำหรับเรื่องราว รีวิว และชุมชนคนรักหนังสือ

โปรเจกต์นี้เป็นเว็บแอปแบบ Single-page Application (SPA) ที่เน้นประสบการณ์ใช้งานบนมือถือและเดสก์ท็อป โดยข้อมูลหนังสือและสถานะตะกร้าสินค้าสำหรับเดโมจัดเก็บในฝั่ง browser

## ฟีเจอร์หลัก

- หน้าแรกพร้อม hero banner, หมวดหมู่, และแคมเปญชุมชน
- ค้นหา กรอง เรียงลำดับ และแบ่งหน้ารายการหนังสือ
- หน้ารายละเอียดหนังสือ แกลเลอรี ราคา สภาพหนังสือ และหนังสือที่เกี่ยวข้อง
- เพิ่ม/ลดจำนวนสินค้าในตะกร้า โดยตรวจสอบจำนวนขั้นต่ำและสต็อก
- Wishlist และตะกร้าสินค้าที่บันทึกด้วย `localStorage`
- ระบบสมัครสมาชิกและเข้าสู่ระบบ (Demo accounts พร้อมใช้งาน)
- ระบบแจ้งเตือนราคา (Price Alert) และการแจ้งเตือนอื่นๆ
- ประวัติการเข้าชมหนังสือ (Recently Viewed)
- รีวิวจากผู้อ่านและผู้ซื้อในชุมชน พร้อมข้อมูลตัวอย่างหลายรูปแบบ
- ฟอร์มสำหรับลงขายหนังสือและเล่าเรื่องราวของหนังสือ
- หน้าแคมเปญ, เรื่องราวของ BookLoop, และรายละเอียดเทคโนโลยี
- Responsive layout สำหรับ Mobile, Tablet และ Desktop

## เทคโนโลยี

- [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/)
- [Material UI v9](https://mui.com/) + Emotion
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-based config ผ่าน Vite plugin)
- [React Router 7](https://reactrouter.com/)
- [Vite 6](https://vite.dev/)
- [Motion](https://motion.dev/) สำหรับ animation
- [SweetAlert2](https://sweetalert2.github.io/) สำหรับ feedback และ dialog
- [Three.js](https://threejs.org/) สำหรับ 3D elements
- [Lucide React](https://lucide.dev/) สำหรับ icons เพิ่มเติม
- React Context + `localStorage` สำหรับ state management

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี

- Node.js 18 ขึ้นไป
- npm หรือ bun

### ติดตั้งและรันในโหมดพัฒนา

```bash
npm install
npm run dev
```

เปิดเว็บที่ [http://localhost:3000](http://localhost:3000)

### คำสั่งที่ใช้บ่อย

```bash
npm run dev       # Vite dev server บน port 3000
npm run lint      # TypeScript type-check (tsc --noEmit)
npm run build     # สร้าง production build ใน dist/
npm run preview   # Preview production build ในเครื่อง
npm run clean     # ลบ dist/ และ server.js
```

## Deploy บน GitHub Pages

โปรเจกต์มี workflow ที่ `.github/workflows/deploy.yml` ซึ่งจะ build และ deploy อัตโนมัติเมื่อ push ไปที่ branch `main` หรือ `dev`

ก่อนใช้งานครั้งแรก ให้ตั้งค่าใน repository:

1. ไปที่ **Settings → Pages**
2. ที่ **Build and deployment → Source** เลือก **GitHub Actions**
3. Push โค้ดหรือกด **Re-run all jobs** ใน GitHub Actions

เว็บไซต์ของ repository นี้จะใช้ URL รูปแบบ:

```text
https://solightzz.github.io/bookloop-socialmediamarketing/
```

Vite และ React Router ถูกตั้งค่าให้รองรับ base path ของ GitHub Pages แล้ว หากเปลี่ยนชื่อ repository ต้องปรับ path ใน `vite.config.ts` และ `src/app/router.tsx` ให้ตรงกัน

## Deploy บนบริการอื่น

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

## โครงสร้างโปรเจกต์

```text
├── .github/workflows/      # GitHub Pages deployment workflow
├── public/                 # Static assets
├── src/
│   ├── app/                # Router และ providers
│   ├── assets/images/      # Logo และ image assets
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Auth-related components (RequireAuth)
│   │   ├── bookdetail/     # Book detail page components
│   │   ├── books/          # Books listing components
│   │   ├── cart/           # Cart components
│   │   ├── checkout/       # Checkout flow components
│   │   ├── common/         # Shared components (ErrorBoundary, LoadingSkeleton, SearchBar)
│   │   ├── discovery/      # Discovery/exploration components
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, Footer, MobileBottomNav, AppMobileDrawer
│   │   ├── navbar/         # AuthButton, UserMenu
│   │   ├── notification/   # NotificationBell
│   │   ├── orders/         # Order-related components
│   │   └── sell/           # Sell page components
│   ├── context/            # React Context (Auth, Notification, PriceAlert, RecentlyViewed)
│   ├── data/               # Hardcoded book data และ categories
│   ├── hooks/              # Custom hooks (useAuth, useCart, useWishlist, etc.)
│   ├── layouts/            # AppLayout
│   ├── pages/              # Page components (lazy-loaded)
│   ├── routes/             # ProtectedRoute
│   ├── services/           # authService, orderService
│   ├── theme/              # MUI theme และ design tokens
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helpers (alerts, analytics, formatCurrency, getCoverUrl)
│   ├── App.tsx             # Root component
│   ├── index.css           # Tailwind entry + global styles
│   └── main.tsx            # Entry point
├── package.json
├── tsconfig.json           # Path alias: @/* → project root
└── vite.config.ts          # Vite config + chunk splitting
```

## Architecture Notes

- **Path Alias:** `@/*` maps to project root (e.g. `@/components/...`)
- **Provider Nesting:** ErrorBoundary → ThemeProvider → AuthProvider → CartProvider → WishlistProvider → NotificationProvider → RecentlyViewedProvider → PriceAlertProvider
- **Auth:** Client-side only (localStorage). Demo accounts pre-seeded. Passwords hashed with SHA-256.
- **Styling:** Hybrid MUI + Tailwind. MUI for component-level styling, Tailwind for utility classes.
- **No ESLint/Prettier:** Lint command only runs TypeScript type-checking.

## หมายเหตุสำหรับการพัฒนา

- ข้อมูลหนังสือเป็นข้อมูลตัวอย่างใน `src/data/books.ts`
- Cart และ Wishlist ทำงานใน browser จึงอาจแตกต่างกันระหว่าง browser หรือเครื่องที่ใช้ทดสอบ
- การ deploy production ควรตรวจสอบ base path หากนำไปใช้กับ repository หรือโดเมนอื่น
- Tailwind v4 ไม่ใช้ `tailwind.config.js` — กำหนดค่าใน `src/index.css` ผ่าน `@import "tailwindcss"`

## License

MIT License
