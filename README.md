# BookLoop — Second-hand Book Marketplace 📚♻️

> แพลตฟอร์มตลาดซื้อ-ขายและส่งต่อหนังสือมือสอง ที่ทุกเล่มมีเรื่องราวและความทรงจำพร้อมส่งต่อวนต่อไป

---

## 🚀 เทคโนโลยีหลัก (Frontend Technology Stack)

BookLoop ถูกพัฒนาขึ้นโดยใช้ **MUI เป็นแกนหลัก (MUI-First Architecture)** ร่วมกับสถาปัตยกรรม React และ TypeScript ที่ทันสมัย:

- **UI Framework & Runtime**: [React 19](https://react.dev/)
- **UI Component System**: [MUI (Material UI)](https://mui.com/) v6/v9 Standard
- **Iconography**: [@mui/icons-material](https://mui.com/material-ui/material-icons/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type-Safety)
- **Routing**: [React Router v7](https://reactrouter.com/) (Client-side SPA Routing)
- **Styling Engine**: Emotion + MUI Theme Tokens (`src/theme/`)
- **Animation**: [Motion / Framer Motion](https://motion.dev/)
- **Modal & Feedback**: [SweetAlert2](https://sweetalert2.github.io/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **State & Storage**: React Context + Browser `localStorage`

---

## 🛠️ วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development (Dev Server)
```bash
npm run dev
```
ระบบจะเปิดเว็บเซิร์ฟเวอร์ที่ `http://localhost:3000`

### 3. ตรวจสอบ Type Safety & Linter
```bash
npm run lint
```

### 4. Build สำหรับ Production
```bash
npm run build
```
ไฟล์ Bundle ที่ผ่านการคอมไพล์จะถูกสร้างขึ้นในโฟลเดอร์ `dist/`

---

## 📦 การ Deploy ขึ้น GitHub & Cloud Hosting

### 1. Push โค้ดขึ้น GitHub
```bash
git init
git add .
git commit -m "feat: initial commit bookloop marketplace"
git branch -M main
git remote add origin https://github.com/USERNAME/bookloop.git
git push -u origin main
```

### 2. Deploy บน Vercel / Netlify / Cloud Run
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18+ หรือ 20+

---

## 🏛️ โครงสร้างไฟล์ในโปรเจกต์ (Project Structure)

```
├── public/                 # รูปภาพและ Static Assets
├── src/
│   ├── app/                # Router และ Providers
│   ├── components/         # Reusable MUI Components (BookCard, PriceComparison, ฯลฯ)
│   ├── data/               # Mock Books, Stories, และ UGC Data
│   ├── hooks/              # Custom Hooks (useCart, useWishlist)
│   ├── layouts/            # AppLayout (Responsive Header, Drawer, Footer)
│   ├── pages/              # หน้าเว็บ (Home, Books, Detail, Sell, Campaign, About, TechStack)
│   ├── theme/              # MUI Theme, Tokens, และ Color Palette
│   ├── utils/              # Helper functions, Formatter, และ Analytics
│   ├── App.tsx             # Main App Component
│   ├── index.css           # Global Styles & Typography
│   └── main.tsx            # App Entry Point
├── metadata.json           # Application Metadata
├── package.json            # Project Dependencies & Scripts
├── tsconfig.json           # TypeScript Compiler Configuration
└── vite.config.ts          # Vite Bundler Configuration
```

---

## 📄 License
MIT License
