# BookLoop — Second-hand Book Marketplace 📚♻️

BookLoop คือแพลตฟอร์มซื้อ–ขายและส่งต่อหนังสือมือสองที่ทำให้หนังสือทุกเล่มมีโอกาสเดินทางไปหาผู้อ่านคนใหม่ พร้อมพื้นที่สำหรับเรื่องราว รีวิว และชุมชนคนรักหนังสือ

โปรเจกต์นี้เป็นเว็บแอปแบบ Single-page Application (SPA) ที่เน้นประสบการณ์ใช้งานบนมือถือและเดสก์ท็อป โดยข้อมูลหนังสือและสถานะตะกร้าสินค้าสำหรับเดโมจัดเก็บในฝั่ง browser

## ฟีเจอร์หลัก

- หน้าแรกพร้อม hero banner, หมวดหมู่ และแคมเปญชุมชน
- ค้นหา กรอง เรียงลำดับ และแบ่งหน้ารายการหนังสือ
- หน้ารายละเอียดหนังสือ แกลเลอรี ราคา สภาพหนังสือ และหนังสือที่เกี่ยวข้อง
- เพิ่ม/ลดจำนวนสินค้าในตะกร้า โดยตรวจสอบจำนวนขั้นต่ำและสต็อก
- Wishlist และตะกร้าสินค้าที่บันทึกด้วย `localStorage`
- รีวิวจากผู้อ่านและผู้ซื้อในชุมชน พร้อมข้อมูลตัวอย่างหลายรูปแบบ
- ฟอร์มสำหรับลงขายหนังสือและเล่าเรื่องราวของหนังสือ
- หน้าแคมเปญ, เรื่องราวของ BookLoop และรายละเอียดเทคโนโลยี
- Responsive layout สำหรับ Mobile, Tablet และ Desktop

## เทคโนโลยี

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Material UI 9](https://mui.com/) และ Emotion
- [React Router 7](https://reactrouter.com/)
- [Vite 6](https://vite.dev/)
- [Motion](https://motion.dev/) สำหรับ animation
- [SweetAlert2](https://sweetalert2.github.io/) สำหรับ feedback และ dialog
- Tailwind CSS Vite plugin สำหรับการใช้งานร่วมกับ styling system
- React Context และ `localStorage` สำหรับ state ของ cart และ wishlist

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี

- Node.js 22 ขึ้นไป
- npm

### ติดตั้งและรันในโหมดพัฒนา

```bash
npm install
npm run dev
```

เปิดเว็บที่ [http://localhost:3000](http://localhost:3000)

### คำสั่งที่ใช้บ่อย

```bash
# ตรวจสอบ TypeScript
npm run lint

# สร้าง production build ใน dist/
npm run build

# preview production build ในเครื่อง
npm run preview
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
│   ├── components/         # Reusable UI components
│   ├── data/               # ข้อมูลหนังสือ รีวิว และ community content
│   ├── hooks/              # Custom hooks เช่น useCart และ useWishlist
│   ├── layouts/            # App layout, navbar และ footer
│   ├── pages/              # หน้า Home, Books, Detail, Cart, Sell ฯลฯ
│   ├── theme/              # MUI theme, tokens และ color palette
│   ├── utils/              # Formatter และ helper functions
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── package.json            # Dependencies และ scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite และ production build configuration
```

## หมายเหตุสำหรับการพัฒนา

- ข้อมูลหนังสือเป็นข้อมูลตัวอย่างใน `src/data/books.ts`
- cart และ wishlist ทำงานใน browser จึงอาจแตกต่างกันระหว่าง browser หรือเครื่องที่ใช้ทดสอบ
- การ deploy production ควรตรวจสอบ base path หากนำไปใช้กับ repository หรือโดเมนอื่น

## License

MIT License
