# META PROMPT WEB MAIN — BookLoop

คัดลอกเนื้อหาตั้งแต่บรรทัดถัดไปไปใช้เป็นคำสั่งหลักสำหรับ AI coding agent หรือทีมพัฒนาเว็บได้ทันที

---

## บทบาทของคุณ

คุณคือทีมขนาดเล็กที่ประกอบด้วย Senior Product Designer, UX Writer, Frontend Engineer และ QA Engineer ทำหน้าที่ออกแบบและสร้างเว็บแอปจริงให้กับแบรนด์ BookLoop

ทำงานแบบลงมือสร้าง ไม่ใช่เพียงเสนอไอเดียหรือทำภาพ mockup หากได้รับ repository ที่มีอยู่ ให้ตรวจสอบไฟล์และโครงสร้างเดิมก่อน แล้วปรับปรุงโดยรักษาของที่ใช้งานได้อยู่แล้ว หากเป็น repository เปล่า ให้สร้างแอปที่รันได้ตั้งแต่ต้น

ก่อนเริ่มเขียนโค้ด ให้สรุปสั้น ๆ ภายในคำตอบหรือไฟล์งานว่า:

1. ผู้ใช้หลักคือใคร
2. งานหลักของหน้าแรกคืออะไร
3. เส้นทางที่พาผู้ใช้จาก Social Media ไปสู่การซื้อคืออะไร
4. แนวทางภาพรวมของ UI และเหตุผลของการเลือกนั้น

จากนั้นให้สร้าง ตรวจสอบ และปรับแก้จนสามารถรันและสาธิตได้จริง ห้ามหยุดที่โค้ดบางส่วนหรือ pseudocode

---

## 1. ข้อมูลผลิตภัณฑ์และแบรนด์

### ชื่อแบรนด์

BookLoop

### Slogan

> หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป

### แนวคิดหลัก

หนังสือไม่ได้หมดคุณค่าเมื่อเจ้าของเดิมอ่านจบ แต่สามารถเดินทางต่อไปยังเจ้าของคนใหม่ BookLoop เป็น marketplace สำหรับซื้อ ขาย และส่งต่อหนังสือมือสองทุกประเภท

### Brand Loop

```text
ซื้อ → อ่าน → ขายต่อ → ส่งต่อ → อ่านต่อ
```

### ประเภทหนังสือ

รองรับและสื่อสารให้ชัดว่าไม่ได้มีเฉพาะหนังสือเรียน:

- นิยาย
- การ์ตูน
- หนังสือความรู้
- หนังสือพัฒนาตนเอง
- หนังสือธุรกิจ
- หนังสือเด็ก
- หนังสือการศึกษา
- หนังสือทั่วไป
- หนังสือสะสม
- หนังสือหายาก

### บุคลิกของแบรนด์

Friendly, trustworthy, modern, accessible, simple, warm, smart, professional และ community-driven ให้รู้สึกเป็นธุรกิจจริงที่เข้าถึงได้สำหรับคนหลายวัย ไม่ทำให้ดูเป็นเว็บงานนักศึกษา หรือเป็นแพลตฟอร์มสำหรับนักศึกษาเท่านั้น

### กลุ่มเป้าหมาย

กลุ่มหลักคือคนรักการอ่าน ผู้ที่ต้องการซื้อหนังสือราคาคุ้มค่า นักเรียน นักศึกษา และผู้ที่มีหนังสือไม่ได้ใช้งานแล้ว กลุ่มรองคือนักสะสม ผู้ปกครอง ผู้ค้นหาหนังสือเฉพาะทาง และผู้ขายหนังสือจาก collection ส่วนตัว

---

## 2. เป้าหมายของเว็บไซต์

สร้าง React application ระดับ Startup / Portfolio ที่สาธิต Social Media Marketing ได้ทันที โดยผู้ดูต้องเข้าใจภายในไม่กี่วินาทีว่า:

- BookLoop คืออะไร
- มีหนังสือประเภทใดบ้าง
- จะค้นหาและซื้อหนังสืออย่างไร
- จะขายหนังสือของตัวเองได้อย่างไร
- ทำไมหนังสือมือสองจึงคุ้มค่า
- จะมั่นใจในสภาพสินค้าและผู้ขายได้อย่างไร
- Social Media ส่งผู้ใช้เข้าสู่เว็บไซต์และเปลี่ยนเป็นการซื้อได้อย่างไร

เส้นทางหลักที่ต้องสาธิตได้:

```text
TikTok / Instagram / Facebook
→ Content หรือ Campaign
→ Home / Campaign Landing
→ Search หรือ Category
→ Product Detail
→ Add to Cart
→ Cart / Demo Checkout
→ Purchase Success
→ Review / Share / กลับไป Social Media
```

นี่คือ prototype ที่ใช้งานได้จริงในฝั่ง frontend ไม่ต้องสร้าง backend, ระบบจ่ายเงินจริง หรือระบบ authentication จริง แต่ทุกปุ่มที่อยู่ในเส้นทางสาธิตต้องตอบสนองและมี feedback ที่เข้าใจได้

---

## 3. เทคโนโลยีและข้อกำหนดทางเทคนิค

ต้องใช้:

- React 19
- Vite 8 และ Vite/Rolldown ตามที่สภาพแวดล้อมรองรับ
- React Router
- MUI v9 เป็นระบบ UI หลัก
- Emotion สำหรับ custom styling
- Framer Motion สำหรับ motion ที่จำเป็น
- SweetAlert2 สำหรับ confirmation dialog, success/error alert และ feedback สำคัญของผู้ใช้
- Oxlint สำหรับตรวจคุณภาพโค้ด

ใช้ JavaScript/JSX หรือ TypeScript/TSX ให้สอดคล้องกับ repository เดิม หากเริ่มจากศูนย์ให้เลือกแบบที่ทำให้รันได้ง่ายและสม่ำเสมอทั้งโปรเจกต์ ห้ามผสมรูปแบบโดยไม่มีเหตุผล

หลักการทางโค้ด:

- ใช้ component-based architecture
- แยกข้อมูล mock ออกจาก UI
- ใช้ semantic HTML และ React components ที่อ่านง่าย
- ห้ามใส่ข้อมูลสินค้าแบบ hard-code ซ้ำในหลาย component
- ห้ามใช้ native `alert()`, `confirm()` หรือ `prompt()` เป็น feedback หลัก ให้ใช้ SweetAlert2 (`Swal.fire`) สำหรับ feedback ที่ต้องการความเด่นหรือการยืนยัน และใช้ MUI Snackbar/inline status สำหรับ feedback สั้น ๆ ที่ไม่ควรขัดจังหวะการใช้งาน
- ห้ามใส่ TODO หรือปุ่มที่ไม่มีพฤติกรรมโดยไม่ระบุว่าเป็น feature ที่ยังไม่อยู่ใน scope
- ห้ามสร้าง backend ปลอมที่ทำให้เข้าใจว่ามีการชำระเงินจริง
- ถ้าคำสั่งติดตั้งหรือ dependency ที่ระบุไม่สามารถใช้ได้ ให้เลือกเวอร์ชันที่ compatible ที่สุด แก้ package configuration ให้รันได้ และบันทึกเหตุผลไว้ใน README

โครงสร้างที่แนะนำ:

```text
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers.jsx
├── components/
├── layouts/
├── pages/
├── sections/
├── data/
├── hooks/
├── theme/
├── assets/
├── utils/
└── main.jsx
```

ถ้า repository มีโครงสร้างต่างจากนี้ ให้รักษาโครงสร้างเดิมที่ดีอยู่แล้วและใช้หลักการแยกความรับผิดชอบแบบเดียวกัน

---

## 3.1 Frontend Implementation Brief

### Frontend คืออะไรในโปรเจกต์นี้

Frontend คือส่วนของเว็บที่ผู้ใช้เห็นและโต้ตอบโดยตรงใน browser ตั้งแต่ header, search, product card, product detail, cart, form, dialog ไปจนถึง responsive layout ไม่ใช่เพียงหน้า landing page ที่แสดงข้อมูลเฉย ๆ ดังนั้นให้สร้างประสบการณ์ที่ผู้ใช้คลิก ค้นหา กรองสินค้า เพิ่มตะกร้า บันทึกรายการโปรด และสาธิต checkout ได้จริงในระดับ frontend prototype

### หน้าที่ของ frontend

Frontend ของ BookLoop ต้องทำหน้าที่ 5 อย่างพร้อมกัน:

1. **บอกตัวตนของแบรนด์** — ผู้ใช้เข้าใจ BookLoop และ Brand Loop ได้ทันที
2. **ช่วยค้นพบหนังสือ** — search, category, filter และ recommendation ต้องใช้งานง่าย
3. **สร้างความมั่นใจ** — แสดงราคา สภาพหนังสือ รีวิว และข้อมูลผู้ขายอย่างโปร่งใส
4. **พาไปสู่ conversion** — CTA, cart และ demo checkout ต้องต่อเนื่องและไม่สับสน
5. **สร้างการส่งต่อ** — seller flow, book story, social content และ share ต้องสะท้อน community loop

### วิธีคิดเรื่อง component

แบ่ง UI ตามหน้าที่และการนำกลับมาใช้ ไม่สร้างหน้าเดียวเป็น component ยักษ์ ตัวอย่าง component ที่ควรมี:

```text
AppShell
├── Header
│   ├── Logo
│   ├── DesktopNav
│   ├── SearchBar
│   └── MobileMenu
├── Main content
│   ├── HeroSection
│   ├── CampaignBanner
│   ├── CategoryCard
│   ├── BookCard
│   ├── BookGrid
│   ├── PriceComparison
│   ├── ConditionBadge
│   ├── SellerCard
│   ├── ReviewList
│   └── MarketingFunnel
└── Footer
```

กฎการแยก component:

- component รับข้อมูลผ่าน props และไม่ผูกกับหนังสือเล่มใดเล่มหนึ่งโดยตรง
- ส่วนที่มี business interaction เช่น cart, wishlist และ search แยก logic ออกจาก visual component ผ่าน hook หรือ context
- shared component ต้องใช้ได้ทั้ง Home, Books listing, Product detail และ Campaign
- อย่าสร้าง component แยกเพียงเพราะมี HTML ไม่กี่บรรทัด หากยังไม่มีความรับผิดชอบที่ชัดเจน
- อย่าใส่ style inline ซ้ำ ๆ ให้ใช้ MUI theme, `sx` ที่อ่านง่าย หรือ styled component ตาม convention เดียวกัน

### การแบ่งชั้นของ frontend

ใช้แนวทางแบ่งความรับผิดชอบดังนี้:

| Layer | หน้าที่ | ตัวอย่าง |
| --- | --- | --- |
| Page | ประกอบ section และรับ route state | `HomePage`, `ProductDetailPage` |
| Section | จัดกลุ่มเนื้อหาตามเป้าหมาย UX | `FeaturedBooks`, `BookStories` |
| Component | แสดงผลและ interaction เฉพาะจุด | `BookCard`, `SearchBar` |
| Hook / Context | จัดการ state และพฤติกรรมที่ใช้ร่วมกัน | `useCart`, `useWishlist` |
| Data / Utils | mock data, formatter และ analytics abstraction | `books.js`, `formatCurrency.js` |

### State ที่ต้องแยกให้ชัด

- **UI state:** mobile menu, dialog, selected image, expanded accordion, loading
- **URL state:** search query, category, condition, sort และ price filter
- **Client state:** cart, wishlist และ demo order state
- **Server state:** ยังไม่มีใน prototype นี้ ห้ามทำเหมือนมีการเรียก API จริง

เมื่อ state มีผลต่อการแชร์ URL หรือการกด back/forward ให้เก็บไว้ใน query string ผ่าน React Router เมื่อเป็น state เฉพาะ component ให้เก็บไว้ใกล้ component ที่ใช้ที่สุด หลีกเลี่ยงการส่ง props ผ่านหลายชั้นโดยไม่มีเหตุผล

### Frontend user flow ที่ต้องตรวจด้วยตัวเอง

```text
ผู้ใช้เปิด Home
→ เข้าใจ BookLoop จาก Hero
→ ค้นหา "หนังสือ"
→ เห็นผลใน /books
→ เปิด product detail
→ ตรวจราคา/สภาพ/ผู้ขาย
→ เพิ่มลงตะกร้า
→ เห็น SweetAlert2 success feedback
→ เปิด Cart
→ ยืนยัน Demo checkout
→ เห็น success state และ event tracking
```

ถ้าขั้นตอนใดต้องเดา, ปุ่มไม่ตอบสนอง, หน้าถูก reload โดยไม่จำเป็น หรือข้อมูลหายหลังเปลี่ยน route ให้ถือว่ายังไม่เสร็จและแก้ก่อนส่งมอบ

### Responsive frontend

ออกแบบ mobile-first แล้วขยายไป tablet และ desktop ไม่ใช่เพียงย่อ desktop ให้เล็กลง:

- mobile ใช้ drawer/menu และ filter drawer
- product detail เรียง gallery, information และ CTA เป็นลำดับแนวตั้ง
- cart และ price comparison ต้องอ่านง่ายโดยไม่บีบเป็นตารางกว้าง
- card grid ปรับจำนวนคอลัมน์ตาม breakpoint
- touch target ของปุ่มควรใหญ่พอสำหรับการแตะ
- ไม่มี fixed width ที่ทำให้เกิด horizontal scroll
- ตรวจทั้งความกว้างประมาณ 360px, 768px และ desktop ก่อนส่งมอบ

### Frontend quality bar

ทุกหน้าต้องมี visual hierarchy, loading/empty/error/success state, keyboard focus, alt text และ copy ที่บอก action ชัดเจน ใช้ motion เพื่อช่วยให้เข้าใจลำดับ ไม่ใช้เพื่อประดับทุกส่วน และรักษา design token เดียวกันทั้งแอป ห้ามปล่อย component ที่ดูเหมือนมาจาก template คนละชุด

---

## 3.2 Landing Page Brief — หน้าแรกที่สวยและใช้งานง่าย

หน้า Home (`/`) ต้องทำหน้าที่เป็นทั้ง **Landing Page สำหรับสร้างความเข้าใจและความสนใจ** กับ **จุดเริ่มต้นของ marketplace สำหรับค้นหาและซื้อหนังสือ** อย่าทำเป็นหน้าโฆษณาที่สวยอย่างเดียว และอย่าทำเป็น product grid ที่ไม่มีเรื่องราว ผู้ใช้ต้องเข้าใจคุณค่าของ BookLoop แล้วเริ่มค้นหาหนังสือได้ภายในไม่กี่วินาที

### งานหลักของ Landing Page

หน้า Landing Page ต้องตอบคำถามต่อไปนี้ตามลำดับ:

1. BookLoop คืออะไร
2. หนังสือที่ขายมีความหลากหลายอย่างไร
3. ผู้ใช้จะค้นหาหนังสือได้จากตรงไหน
4. หนังสือมือสองคุ้มค่าและน่าเชื่อถืออย่างไร
5. ผู้ใช้จะขายหนังสือที่ไม่ได้ใช้งานแล้วได้อย่างไร
6. จะเริ่มดูหนังสือหรือเข้าร่วม campaign ได้อย่างไร

### Above-the-fold composition

ส่วนที่เห็นก่อน scroll ต้องมีองค์ประกอบที่จำเป็นเท่านั้น:

```text
┌──────────────────────────────────────────────────────┐
│ Logo    หนังสือ  หมวดหมู่  ขายหนังสือ   ♡  Cart      │
├──────────────────────────────────────────────────────┤
│ หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป     Book visual │
│ คำอธิบายสั้นที่บอกว่าเป็น marketplace               │
│ [ค้นหาหนังสือ]  [ขายหนังสือของคุณ]                  │
│ [ค้นหาชื่อหนังสือ ผู้เขียน หรือ ISBN...]             │
└──────────────────────────────────────────────────────┘
```

องค์ประกอบที่ต้องเห็นชัดใน viewport แรกคือ brand message, คำอธิบายธุรกิจ, primary CTA และ search อย่าใส่ carousel ที่หมุนเอง, popup, banner หลายชั้น หรือข้อความยาวจนกลบ action หลัก

### Landing Page visual direction

- ใช้ white / very light surface เป็นพื้นที่อ่าน และใช้ navy เป็น anchor ของแบรนด์
- ให้ภาพปกหนังสือหรือกลุ่มหนังสือเป็น visual หลัก ไม่ใช้ภาพ stock ที่ไม่เกี่ยวกับหนังสือ
- ใช้ layout ที่มีจังหวะระหว่าง editorial book culture กับ modern e-commerce เช่นภาพปกที่วางเป็นเส้นทาง/วง loop อย่างเป็นระเบียบ
- ให้ hero headline มีน้ำหนักและ character แต่ body copy สั้น อ่านง่าย และไม่ใช้คำโฆษณาเกินจริง
- ใช้ card, border, divider และ shadow อย่างมีเหตุผล ไม่ทำให้ทุก section ลอยเป็นกล่อง
- มี signature visual เดียวที่จำได้: `BookLoop journey` หรือเส้น loop ที่พาผู้ใช้จากหนังสือหนึ่งเล่มไปยังคนถัดไป
- กล้าทำ composition ที่มีเอกลักษณ์ได้หนึ่งจุด แต่ส่วนอื่นต้องสงบและช่วยให้ใช้งานง่าย
- ห้ามใช้ gradient หนัก, neon, 3D book mockup, glassmorphism หนัก หรือ decoration ที่ทำให้ความเร็วในการค้นหาลดลง

### ลำดับ section และเหตุผลทาง UX

สร้าง Landing Page ตามลำดับนี้ โดยปรับระยะห่างและจำนวน content ให้เหมาะกับการอ่านจริง:

1. **Sticky Header** — ให้ผู้ใช้กลับไป Home, Books, Sell และ Cart ได้ตลอด
2. **Hero + Search** — สื่อ brand thesis และเริ่มค้นหาหนังสือได้ทันที
3. **Campaign Banner** — เชื่อม Social Media traffic กับ campaign `อ่านจบ ส่งต่อ วนต่อไป`
4. **Category Discovery** — ช่วยผู้ใช้ที่ยังไม่รู้ว่าจะค้นหาคำว่าอะไร
5. **Featured Books** — แสดงตัวอย่างสินค้าจริงพร้อมราคา condition และ CTA
6. **Value Proposition** — อธิบายความคุ้มค่า ความหลากหลาย การขายต่อ และความมั่นใจ
7. **How BookLoop Works** — ทำให้ business loop เข้าใจง่าย
8. **Book Story** — สร้างความแตกต่างจาก marketplace ทั่วไป
9. **Social Media Content / UGC** — แสดงว่าการตลาดและ community เชื่อมกับเว็บอย่างไร
10. **Final CTA** — ให้ผู้ใช้เลือก `ค้นหาหนังสือ` หรือ `ขายหนังสือของคุณ`
11. **Footer** — ให้ข้อมูลช่วยเหลือและลิงก์สำคัญโดยไม่สร้าง dead-end

ทุก section ต้องมีเหตุผลในการอยู่บนหน้า ถ้าข้อมูลซ้ำกันให้ลดทอนหรือรวม section ไม่ยืดหน้าเพียงเพื่อให้มีองค์ประกอบเยอะ

### CTA hierarchy

กำหนดลำดับความสำคัญชัดเจน:

- **Primary CTA:** `ค้นหาหนังสือ` → `/books`
- **Secondary CTA:** `ขายหนังสือของคุณ` → `/sell`
- **Commerce CTA:** `ดูรายละเอียด`, `เพิ่มลงตะกร้า`, `ซื้อเลย`
- **Community CTA:** `แชร์เรื่องราวของคุณ` หรือ `ดู Content เพิ่มเติม`

ปุ่มเดียวกันต้องมีชื่อและผลลัพธ์สอดคล้องกันตลอดทั้งเว็บ มี hover, focus, disabled และ loading state เมื่อจำเป็น ห้ามวาง CTA ที่มีน้ำหนักเท่ากันมากเกินไปจนผู้ใช้ไม่รู้ว่าควรกดอะไร

### Search-first usability

Search เป็น action สำคัญอันดับหนึ่งของ Landing Page:

- input ต้องกว้างและโดดเด่นพอที่จะพบได้ทันที
- มี label หรือ accessible name ที่ชัดเจน
- รองรับ submit ด้วย Enter
- แสดง query ที่ค้นหาใน `/books`
- รองรับชื่อหนังสือ, ผู้เขียน, ISBN และหมวดหมู่
- ถ้าคำค้นไม่พบผลลัพธ์ ให้เสนอ category หรือคำค้นที่ใกล้เคียง
- บน mobile input ต้องไม่เล็กจนพิมพ์ยาก และ keyboard ไม่บังปุ่ม submit

### Copy และ content ของ Landing Page

ใช้ copy ที่พูดจากมุมมองผู้ใช้และบอกการกระทำตรง ๆ:

- Hero: `หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป`
- Supporting text: `ซื้อหนังสือมือสองในราคาที่เข้าถึงง่าย หรือส่งต่อหนังสือที่คุณไม่ได้อ่านแล้วให้กับเจ้าของคนใหม่`
- Category heading: `ค้นหาหนังสือในแบบของคุณ`
- Sell heading: `มีหนังสือที่ไม่ได้อ่านแล้ว?`
- Final CTA: `หนังสือเล่มต่อไปของคุณ อาจกำลังรออยู่`

เขียนข้อความสั้นแบบ sentence case ใช้คำกริยาที่บอกผลลัพธ์ เช่น `ค้นหาหนังสือ`, `เพิ่มลงตะกร้า`, `ดูรายละเอียด` หลีกเลี่ยงคำที่ดูฉลาดแต่ไม่ช่วยให้ผู้ใช้ตัดสินใจ และติดป้าย `Demo / ตัวอย่างข้อมูล` กับตัวเลข social proof, รีวิว และ social post ที่ไม่ได้มาจากระบบจริง

### Landing Page responsive behavior

- Desktop: ใช้ hero แบบสองคอลัมน์โดยให้ข้อความและ search เป็นจุดนำสายตา ส่วน visual อยู่ด้านข้างและไม่แย่งความสำคัญ
- Tablet: ลดจำนวนคอลัมน์และรักษาขนาดตัวอักษร/ปุ่มให้กดง่าย
- Mobile: เรียง hero เป็นแนวตั้ง, search อยู่ใกล้ headline, CTA เป็นปุ่มเต็มหรือกว้างพอ, category ใช้ horizontal scroll ที่มีป้ายบอกถ้าจำเป็น หรือ grid ที่ไม่ทำให้เกิด overflow
- mobile header ใช้ drawer ที่มีเมนูครบและปิดได้หลังเลือก route
- featured product cards บน mobile ต้องเห็นรูปปก ชื่อ ราคา condition และ action โดยไม่ต้องเดา
- final CTA และ cart access ต้องยังหาเจอได้โดยไม่ต้องย้อนกลับไปด้านบน

### Landing Page interaction และ motion

ใช้ Framer Motion เฉพาะจุดที่ช่วยการรับรู้:

- hero content reveal ครั้งเดียวเมื่อเปิดหน้า
- subtle reveal เมื่อ section เข้าสู่ viewport
- category/product hover และ focus ที่ตอบสนองเร็ว
- visual loop เคลื่อนตามลำดับ `ซื้อ → อ่าน → ส่งต่อ → อ่านต่อ` อย่างเบา
- campaign/social cards reveal อย่างสม่ำเสมอ

ต้องรองรับ `prefers-reduced-motion`, ไม่ใช้ auto-playing motion ที่รบกวนการอ่าน และไม่ทำให้ search, navigation หรือ add-to-cart ช้าลง

### Landing Page acceptance criteria

ถือว่าหน้า Landing Page ผ่านเมื่อ:

- ผู้ใช้ใหม่เข้าใจ BookLoop ภายในประมาณ 5 วินาที
- เห็น primary CTA และ search โดยไม่ต้อง scroll
- คลิก `ค้นหาหนังสือ` แล้วไป `/books` ได้จริง
- คลิก `ขายหนังสือของคุณ` แล้วไป `/sell` ได้จริง
- search ใช้งานด้วย keyboard และคืนผลลัพธ์จริงจาก mock data
- category, featured book, campaign และ final CTA มีเส้นทางต่อที่ชัดเจน
- หน้าอ่านง่าย ไม่รก และมี visual signature ของ BookLoop
- responsive ที่ mobile/tablet/desktop และไม่มี horizontal scroll
- ทุก interactive element มี hover/focus/feedback ที่เหมาะสม
- mock content และ social proof ไม่ทำให้เข้าใจว่าเป็นข้อมูลจริง
- Lighthouse/คุณภาพ frontend ที่ทำได้ใน environment ไม่ถูกลดทอนเพราะ animation หรือรูปภาพขนาดใหญ่เกินจำเป็น

---

## 3.3 Frontend brief สำหรับหน้าอื่น ๆ

ทุกหน้าต่อไปนี้ต้องใช้ AppShell, header, footer, theme, spacing และ feedback pattern เดียวกับ Landing Page แต่มีงานหลักของตัวเองอย่างชัดเจน ห้าม copy layout ของหน้า Home มาเปลี่ยนแค่หัวข้อ เพราะแต่ละหน้ามี intent และ interaction ต่างกัน

### A. Books Listing (`/books`) — หน้าค้นหาและค้นพบสินค้า

**งานหลัก:** ช่วยให้ผู้ใช้จาก Social Media หรือ Home ค้นหาและเปรียบเทียบหนังสือได้เร็ว

โครงสร้าง frontend:

```text
Breadcrumb / Page heading
→ Search summary + active filters
→ Filter controls + Sort
→ Result count
→ Responsive BookGrid
→ Pagination หรือ Load more แบบ demo
→ Empty state / No result state
```

ข้อกำหนด:

- อ่าน `q`, `category`, `condition`, `sort` และ price filter จาก URL query string
- Search ต้อง submit ด้วย Enter ได้ และมีปุ่ม clear ที่เข้าถึงได้
- desktop แสดง filter panel หรือ sidebar, mobile ใช้ filter drawer พร้อมปุ่ม `ใช้ตัวกรอง` และ `ล้างตัวกรอง`
- ทุก filter ต้องคำนวณจาก mock data จริง ไม่ใช่แค่เปลี่ยน label
- sort อย่างน้อย `แนะนำ`, `ราคาต่ำไปสูง`, `ราคาสูงไปต่ำ`, `คะแนนสูงสุด` และ `ใหม่ล่าสุด`
- แสดง active filter เป็น Chip ที่ลบทีละรายการได้
- Product card ต้องแสดง cover, title, author, condition, price, saving, seller rating และ CTA ที่จำเป็น โดยไม่ทำให้ grid แน่น
- เมื่อไม่มีผลลัพธ์ ให้แสดงข้อความที่ช่วยแก้ปัญหา เช่น `ลองค้นหาด้วยชื่อผู้เขียนหรือเลือกหมวดหมู่อื่น`
- ถ้าข้อมูลยังโหลดอยู่ให้ใช้ skeleton ที่รักษาขนาด card ไม่ให้ layout กระโดด

**Visual direction:** ให้หน้าดูเหมือน curated book catalog ไม่ใช่ตารางสินค้าที่อัดแน่น ใช้พื้นที่ว่างช่วยแบ่งกลุ่มและทำให้ปกหนังสือเป็นจุดเด่น

**Acceptance criteria:** refresh URL แล้วยังคง search/filter เดิม, เปิด product detail จาก card ได้ถูก id, mobile filter ใช้งานได้, ไม่มี horizontal scroll และมี keyboard focus ครบทุก control

### B. Product Detail (`/books/:id`) — หน้าสร้างความมั่นใจก่อนซื้อ

**งานหลัก:** ช่วยให้ผู้ใช้ตัดสินใจซื้อจากข้อมูลสินค้า สภาพ ราคา เรื่องราว และความน่าเชื่อถือของผู้ขาย

โครงสร้าง frontend:

```text
Breadcrumb
→ Product gallery                 Product information
                                   price / condition / stock
                                   seller / rating
                                   [ซื้อเลย] [เพิ่มลงตะกร้า] [♡]
→ Condition explanation
→ Price comparison
→ Book information / seller note
→ Story of the book
→ Seller profile
→ Reviews
→ Related books
```

ข้อกำหนด:

- route ต้องอ่าน product id และแสดงข้อมูลจาก data source กลาง
- gallery เปลี่ยนรูปด้วย thumbnail, มี selected state และ alt text ที่ถูกต้อง
- ถ้าทำ zoom/lightbox ให้ปิดด้วย Escape และไม่บัง keyboard focus; ถ้าทำไม่ได้ให้ใช้ภาพที่ชัดและ interaction ที่ไม่หลอกผู้ใช้
- ราคา BookLoop, ราคาหนังสือใหม่โดยประมาณ, discount, saving และ stock ต้องเด่นกว่า metadata รอง
- condition ต้องมี badge และคำอธิบาย ไม่ใช้สีอย่างเดียวในการสื่อสาร
- seller card ต้องมีชื่อ, avatar, rating, verified badge, response rate และลิงก์ดูสินค้าของผู้ขาย
- `เพิ่มลงตะกร้า` เปลี่ยน cart state และแสดง SweetAlert2 success; `ซื้อเลย` ไป cart หรือเปิด demo checkout ที่มีผลลัพธ์ชัดเจน
- product not found ต้องมี error state และ CTA กลับไป `/books`
- related books ต้องลิงก์ไป product id อื่นจริง ไม่ใช้ปุ่มหลอก

**Visual direction:** ใช้ whitespace และ typography สร้างความรู้สึกเหมือนอ่าน ficha ของหนังสือคุณภาพสูง ภาพปกต้องเป็น hero ของหน้า แต่ราคา/condition/CTA ต้องไม่ถูกซ่อน

**Acceptance criteria:** ผู้ใช้ตรวจข้อมูลสำคัญได้โดยไม่ต้องเดา, เพิ่มตะกร้าได้, wishlist ทำงาน, เปลี่ยนรูปได้, price comparison คำนวณถูก และหน้า mobile ยังซื้อได้โดยไม่ต้อง zoom

### C. Sell Your Book (`/sell`) — หน้าดึงดูดผู้ขาย

**งานหลัก:** ทำให้เจ้าของหนังสือเข้าใจว่าการส่งต่อทำได้ง่ายและเริ่มลงขายแบบ demo ได้อย่างมั่นใจ

โครงสร้าง frontend:

```text
Seller-focused hero
→ Why sell with BookLoop
→ 5-step selling flow
→ Sell form
→ Condition guide
→ Trust / safety note
→ Final CTA กลับไปเลือกซื้อหนังสือ
```

ข้อกำหนด:

- ใช้ headline `มีหนังสือที่ไม่ได้อ่านแล้ว?` และข้อความ `เปลี่ยนหนังสือที่ไม่ได้ใช้ ให้กลายเป็นคุณค่าใหม่`
- form ต้องมี title/ISBN, category, condition, price, description และรูปภาพ placeholder/file input ตามที่ environment รองรับ
- label, helper text, required state และ validation error ต้องชัดเจนบนทุก field
- แสดง condition guide ให้ผู้ขายเลือกได้อย่างเข้าใจ ไม่บังคับให้รู้ศัพท์เทคนิค
- preview สรุปข้อมูลที่กรอกก่อน submit ได้ถ้าไม่ทำให้ flow ซับซ้อน
- submit สำเร็จต้องแสดง SweetAlert2 `ลงขายแบบ Demo สำเร็จ` และ success state ในหน้า พร้อมระบุว่าไม่ได้บันทึกลง marketplace จริง
- ฟอร์มต้องไม่ล้างข้อมูลทันทีเมื่อ validation ไม่ผ่าน และต้องพาผู้ใช้ไปยัง field ที่ผิด

**Visual direction:** ให้รู้สึกอบอุ่นและชวนส่งต่อ ใช้ภาพ/เส้นทางของหนังสือที่มีเจ้าของใหม่ แต่รักษา form ให้สงบ อ่านง่าย และไม่ถูกภาพแย่งความสนใจ

**Acceptance criteria:** กรอกข้อมูลไม่ครบแล้วเห็น error ที่แก้ได้, submit ข้อมูลถูกต้องแล้วมี feedback, mobile พิมพ์ง่าย, ไม่มีการอ้างว่ามีการลงขายจริง และมีทางกลับไปซื้อหนังสือ

### D. About BookLoop (`/about`) — หน้าสร้างความเข้าใจและความเชื่อใจ

**งานหลัก:** อธิบายว่าทำไม BookLoop แตกต่างจากร้านหนังสือมือสองหรือ marketplace ทั่วไป

โครงสร้าง frontend:

```text
Brand story hero
→ Brand Loop: ซื้อ → อ่าน → ขายต่อ → ส่งต่อ → อ่านต่อ
→ What BookLoop solves
→ Buyer + seller value
→ Community / social proof (Demo เมื่อเป็น mock)
→ Brand promise
→ CTA ไป /books และ /sell
```

ข้อกำหนด:

- อธิบาย brand concept ด้วยภาษาที่เป็นมนุษย์ ไม่ใช้ jargon ทางธุรกิจมากเกินไป
- ใช้ book story เป็นแกนของหน้า ไม่ทำเป็นหน้า company profile ที่มีแต่ข้อความทั่วไป
- แสดงความแตกต่างระหว่าง buyer และ seller อย่างสมดุล
- หากใช้สถิติสมาชิก/รายการขาย ต้องติดป้าย `Demo / ตัวอย่างข้อมูล`
- CTA ต้องนำทางได้จริงและ footer ใช้งานเหมือนหน้าอื่น

**Visual direction:** เป็น editorial storytelling page ที่มีจังหวะการอ่านและเส้น loop เป็น signature ใช้ภาพน้อยแต่เลือกภาพที่สื่อการส่งต่อ ไม่ทำเป็นหน้า FAQ ยาว ๆ

### E. Campaign Landing (`/campaign/read-share-repeat`) — หน้ารับ traffic จาก Social Media

**งานหลัก:** เปลี่ยนคนที่เห็น campaign `อ่านจบ ส่งต่อ วนต่อไป` ให้เข้ามาดูหนังสือและเริ่มซื้อหรือส่งต่อ

โครงสร้าง frontend:

```text
Campaign hero + source message
→ Campaign promise
→ Featured books / offer (Demo)
→ Buyer story + seller story
→ Social post preview / UGC
→ Marketing funnel
→ CTA ค้นหาหนังสือ / ขายหนังสือ
```

ข้อกำหนด:

- เนื้อหาต้องต่อเนื่องกับ campaign จาก TikTok, Instagram และ Facebook
- CTA แรกต้องไป `/books` และ CTA สำหรับ seller ต้องไป `/sell`
- แสดง campaign context/badge เพื่อให้ผู้ใช้รู้ว่ามาถูก landing page จาก content ใด
- social preview card ต้องเป็น mock และระบุ platform/เนื้อหาอย่างชัดเจน
- share button ใช้ Web Share API หรือ copy link fallback พร้อม feedback
- track `campaign_view`, `campaign_click` และ `social_share` ผ่าน analytics abstraction
- ใช้ SweetAlert2 สำหรับ demo offer หรือ share feedback เฉพาะเมื่อจำเป็น ไม่รบกวนการอ่าน

**Visual direction:** ใช้ mood ที่มีพลังมากกว่า Home ได้เล็กน้อย แต่ยังอยู่ใน navy/blue/neutral palette ของ BookLoop อย่าสร้าง campaign เป็นธีมใหม่จนเหมือนคนละแบรนด์

### F. Cart / Demo Checkout (`/cart` หรือ Cart Drawer) — หน้าปิดการขาย

**งานหลัก:** ให้ผู้ใช้ตรวจรายการสินค้า เห็นยอดรวม และสาธิต conversion ได้โดยไม่ทำให้เข้าใจว่าเป็น payment จริง

โครงสร้าง frontend:

```text
Cart heading + item count
→ Cart item list
→ Quantity / remove / save for later
→ Price summary
→ Savings summary
→ [ดำเนินการสั่งซื้อแบบ Demo]
→ Trust note + Continue shopping
```

ข้อกำหนด:

- แสดง cover, title, condition, seller, unit price, quantity และ line total
- quantity ห้ามเกิน stock และต้องไม่ต่ำกว่า 1
- คำนวณ subtotal, savings และ total จาก cart state จริง
- ลบสินค้า/ล้างตะกร้าต้องมี SweetAlert2 confirmation ตามความเหมาะสม
- checkout ต้องมี SweetAlert2 confirmation ที่เขียนชัดว่า `การสั่งซื้อแบบ Demo`
- เมื่อยืนยันแล้วให้แสดง success state, order reference แบบ mock และปุ่มกลับไปซื้อหนังสือ
- cart ว่างต้องมี empty state พร้อม CTA ไป `/books`
- cart ต้องยังเห็นรายการหลัง refresh หากใช้ localStorage ตามข้อกำหนด

**Visual direction:** สงบและชัดเจน ใช้ price summary เป็นจุดนำสายตา ไม่ใส่ promotional card หลายใบที่เบี่ยงเบนจาก checkout

### G. Shared error, empty และ success pages

ทุก route ต้องมี state ที่ออกแบบในระบบเดียวกัน:

- **404 / Product not found:** บอกว่าไม่พบหน้า/สินค้า พร้อม CTA กลับ Home หรือ Books
- **No search result:** บอกคำค้นที่ใช้และเสนอ action ถัดไป
- **Empty cart:** ใช้ภาพหรือ icon ที่เบา พร้อม `เริ่มค้นหาหนังสือ`
- **Form error:** อธิบาย field ที่ต้องแก้และไม่ลบข้อมูลที่ผู้ใช้กรอก
- **Demo success:** บอกผลลัพธ์ที่เกิดขึ้นและสิ่งที่ทำต่อได้ ห้ามแอบอ้างว่าเป็นธุรกรรมจริง

อย่าออกแบบ error state ให้เป็นหน้าตายหรือใช้คำว่า `เกิดข้อผิดพลาด` เพียงอย่างเดียว ทุก state ต้องช่วยผู้ใช้กลับเข้าสู่ flow ได้

### Cross-page acceptance criteria

- ทุกหน้ามี header/footer และ design token สม่ำเสมอ
- ทุกหน้ามี page title, breadcrumb หรือ contextual heading ที่ช่วยบอกตำแหน่ง
- route transition ไม่ทำให้ state ของ cart/wishlist หาย
- CTA ที่มีชื่อเดียวกันให้ผลลัพธ์เดียวกันทุกหน้า
- ทุกหน้ารองรับ loading, empty, error และ success state ตามที่เหมาะสม
- ทุกหน้าใช้งานบน mobile/tablet/desktop ได้และไม่มี horizontal scroll
- ทุกหน้ามี keyboard focus, accessible labels และ contrast ที่เพียงพอ
- หน้า Product, Sell และ Cart มี SweetAlert2 feedback ตาม flow ที่ระบุ
- หน้า About และ Campaign มี storytelling/visual purpose ไม่ใช่แค่ข้อความ placeholder
- หน้า Books และ Product ใช้ข้อมูล mock ชุดเดียวกัน ไม่สร้างข้อมูลซ้ำจนราคา/ชื่อไม่ตรงกัน

---

## 4. Visual direction

### ทิศทางภาพ

Modern e-commerce + community marketplace + book culture ใช้ white space, hierarchy ที่ชัด, รูปปกหนังสือเป็น visual หลัก และทำให้ราคา สภาพสินค้า ผู้ขาย และ CTA เห็นได้ทันที

โลโก้ควรสื่อถึง `Open Book + Loop / circular arrow` ห้ามใช้หมวกบัณฑิต เพราะ BookLoop ไม่ได้จำกัดเฉพาะหนังสือเรียน หากยังไม่มีโลโก้จริง ให้สร้างเป็น wordmark/vector mark แบบเรียบง่ายที่ดูดีทั้ง desktop และ mobile และทำให้เปลี่ยนเป็น asset จริงได้ภายหลัง

### Design tokens

ใช้ token กลางผ่าน MUI theme ห้ามกระจายค่าสีแบบสุ่มทั่วไฟล์:

```text
Ink / Navy       #102A43
Deep Navy       #0B1F33
Action Blue     #1769AA
Soft Blue       #E8F1F8
Paper           #FFFFFF
Warm Surface    #F7F9FB
Muted Text      #52606D
Border          #D9E2EC
Success         #2E7D5B (ใช้เป็นสถานะ/feedback เท่านั้น)
Warning         #B7791F
Danger          #B42318
```

สีเขียวห้ามเป็นสีหลัก ใช้ได้เฉพาะสถานะ success หรือ badge ที่จำเป็น ห้ามใช้สีรุ้ง, neon, gradient รุนแรง, 3D UI, glassmorphism หนัก, shadow หนัก หรือ decoration ที่ทำให้ความน่าเชื่อถือลดลง

### Typography

เลือกฟอนต์ที่อ่านภาษาไทยได้ดีและมีบุคลิก เช่น `Noto Sans Thai` หรือฟอนต์ไทยที่มีอยู่ใน environment เป็น body font ใช้ display weight ที่ชัดเจนแต่ไม่หวือหวา หากโหลด web font จากภายนอกไม่ได้ ให้มี system fallback เสมอ ตั้ง type scale ให้หัวข้อเด่น อ่านง่ายบนมือถือ และใช้ sentence case ไม่ใช้ตัวพิมพ์ใหญ่ทั้งบรรทัดโดยไม่จำเป็น

### Layout

- ใช้ container กว้างพอดี ไม่ยืดจนอ่านยาก
- ระยะห่างเป็นระบบเดียวกันทั้งแอป
- border radius ระดับกลางและสม่ำเสมอ
- card มีขอบหรือ shadow เบา ๆ เท่าที่จำเป็น
- อย่าใช้การ์ดทุกอย่างจนหน้าแน่น
- ทุก section ต้องมีจุดประสงค์และลำดับความสำคัญชัด
- responsive ตั้งแต่ mobile โดยไม่มี horizontal scroll

### Signature ของ BookLoop

ให้มี visual loop ที่จำได้และเชื่อมกับแบรนด์ เช่นเส้นทางหนังสือที่เคลื่อนจาก `ซื้อ → อ่าน → ส่งต่อ → อ่านต่อ` รอบภาพปกหรือผ่าน section How it works ใช้เส้น/ลูกศร/วงโค้งอย่างมี restraint ไม่ทำ animation กระจายเต็มหน้า

ก่อนลงมือ ให้ตรวจว่าแนวทางภาพนี้ไม่ใช่ template e-commerce ทั่วไป หากดู generic ให้เพิ่มความเฉพาะของ BookLoopผ่าน “เรื่องราวของหนังสือ”, visual loop และ copy ที่สื่อการเดินทางของหนังสือ โดยไม่เพิ่ม decoration ที่ไม่ช่วยใช้งาน

---

## 5. Routes และ page states

ใช้ React Router และสร้าง routes อย่างน้อยดังนี้:

```text
/                         Home
/books                    Book listing / search / filter
/books/:id                Product detail
/sell                     Sell your book
/about                    About BookLoop
/campaign/read-share-repeat  Campaign landing page
/cart                     Cart / demo checkout (หรือใช้เป็น cart drawer ที่เข้าถึงได้จากทุกหน้า)
```

ควรมี UI state สำหรับ:

- loading หรือ skeleton อย่างน้อยในส่วนที่เหมาะสม
- empty search result พร้อมคำแนะนำให้ลองคำค้นใหม่
- product not found / invalid id
- add to cart สำเร็จ
- add/remove wishlist สำเร็จ
- cart ว่าง
- demo checkout สำเร็จ
- form validation และ form submit สำเร็จในหน้า Sell

Navigation ทุกตัวต้องทำงานได้จริง ใช้ `Link`/`NavLink` ไม่ใช้ anchor ที่ reload หน้าโดยไม่จำเป็น

---

## 6. หน้า Home (`/`)

ลำดับ section ที่แนะนำ:

```text
Sticky Header
→ Hero + Search
→ Social Campaign Banner
→ Categories
→ Featured Books
→ Value Proposition
→ How BookLoop Works
→ Book Stories
→ Social Media Content
→ #BookLoop Community / Testimonials
→ Marketing Funnel
→ Final CTA
→ Footer
```

### Header

มี logo, หน้าแรก, หนังสือ, หมวดหมู่, ขายหนังสือ, เรื่องราวของเรา, search, wishlist, cart และ account/profile ตามพื้นที่ที่มี ใช้ sticky header เมื่อ scroll desktop และ mobile drawer ที่เปิด/ปิดได้ มี active state ของ route, keyboard focus และ accessible label ให้ icon button ทุกตัว

### Hero

ใช้ copy นี้เป็นค่าเริ่มต้น:

**Headline:** `หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป`

**Supporting text:** `ซื้อหนังสือมือสองในราคาที่เข้าถึงง่าย หรือส่งต่อหนังสือที่คุณไม่ได้อ่านแล้วให้กับเจ้าของคนใหม่`

**Primary CTA:** `ค้นหาหนังสือ` → `/books`

**Secondary CTA:** `ขายหนังสือของคุณ` → `/sell`

Hero ต้องบอกทันทีว่าเป็นตลาดหนังสือมือสองทุกประเภท ไม่ใช่ร้านหนังสือเรียน ใช้ภาพหรือ composition ของนิยาย การ์ตูน หนังสือความรู้ หนังสือเด็ก และหนังสือสะสมอย่างหลากหลาย หากใช้ภาพภายนอกให้มี fallback asset และ alt text

### Search

ต้องเด่นและใช้งานได้จริง รองรับชื่อหนังสือ, ผู้เขียน, ISBN และหมวดหมู่ placeholder:

`ค้นหาชื่อหนังสือ ผู้เขียน หรือ ISBN...`

เมื่อ submit ให้ไป `/books?q=คำค้น` และแสดงผลลัพธ์ตาม mock data หากไม่มีผลลัพธ์ให้แสดง empty state ที่ช่วยผู้ใช้ต่อได้

### Campaign banner

แสดง campaign จาก Social Media เช่น:

- `อ่านจบ ไม่ได้แปลว่าจบเรื่อง`
- `อ่านจบ ส่งต่อ วนต่อไป`
- `หนังสือเล่มโปรดของคุณอาจเป็นเล่มโปรดของใครอีกคน`

ต้องมี CTA ไปยัง `/campaign/read-share-repeat` และใช้ badge/แฮชแท็ก `#BookLoop #อ่านจบส่งต่อ` อย่างพอดี

### Categories

หัวข้อ `ค้นหาหนังสือในแบบของคุณ` แสดง card สำหรับ นิยาย, การ์ตูน, ความรู้, พัฒนาตนเอง, ธุรกิจ, เด็ก, การศึกษา และหนังสือสะสม แต่ละ card มีรูปหรือ visual ที่สื่อหมวดหมู่ ชื่อหมวด จำนวนหนังสือ และ hover/focus interaction กดแล้วไป `/books?category=...`

### Featured books

หัวข้อ `หนังสือแนะนำ` แสดง product cards ที่ดูสมจริงและมีหลายหมวดหมู่ แต่ละ card ควรมี:

- book cover
- ชื่อหนังสือ
- ผู้เขียน
- หมวดหมู่
- condition
- ราคา BookLoop
- ราคาปกหรือราคาใหม่โดยประมาณเมื่อมี
- ส่วนลดและจำนวนเงินที่ประหยัด
- rating และ seller rating
- favorite button
- add to cart
- view detail

อย่าให้ข้อมูลเล็กหรือแน่นจนอ่านไม่ได้ ให้ card ทั้งใบหรือชื่อหนังสือไป product detail ได้ และทำปุ่มแยกให้ชัด

### Value proposition

แสดง 4 จุดขายด้วยข้อความที่เข้าใจง่าย:

1. `ราคาที่เข้าถึงง่าย` — หนังสือคุณภาพในราคาที่คุ้มค่า
2. `หนังสือหลากหลาย` — ค้นหาได้หลายหมวดจากผู้ขายในชุมชน
3. `ขายต่อได้` — เปลี่ยนหนังสือที่ไม่ได้ใช้ให้มีคุณค่าใหม่
4. `ซื้ออย่างมั่นใจ` — เห็นสภาพหนังสือและข้อมูลผู้ขายอย่างชัดเจน

### How BookLoop works

แสดง flow `ซื้อ → อ่าน → ขายต่อ → ส่งต่อ → อ่านต่อ` ให้เข้าใจในไม่กี่วินาที ใช้ Framer Motion แบบ subtle และรองรับ `prefers-reduced-motion`

### Book story

สร้าง section ที่เป็นเอกลักษณ์ของแบรนด์ หัวข้อ `เรื่องราวของหนังสือ` หรือ `หนังสือของคุณอาจเป็นเล่มโปรดของใครอีกคน` แสดง quote จากผู้ขาย/ผู้ซื้อ เช่น `อ่านจบแล้วและอยากให้หนังสือเล่มนี้ไปสร้างแรงบันดาลใจให้คนอื่นต่อ` พร้อม CTA ไปดู product detail หรือแชร์เรื่องราว

### Social Media content

หัวข้อ `BookLoop บน Social Media` แสดง mock social cards ที่ระบุ platform ชัดเจน เช่น Instagram, TikTok และ Facebook โดยไม่ต้องฝัง social จริง ตัวอย่าง content:

- หนังสือ 5 เล่มที่อ่านแล้วอยากส่งต่อ
- หนังสือมือสองราคาไม่ถึง 300 บาท
- ทำไมเจ้าของเล่มนี้ถึงอยากส่งต่อ?
- เล่มนี้เหมาะกับใคร?
- หนังสือน่าอ่านประจำสัปดาห์
- รีวิวจากผู้ซื้อ / Seller Story / Book Haul

แต่ละ card มีภาพ, hook, platform, engagement แบบ mock และ CTA `ดู Content เพิ่มเติม` โดยติดป้ายใน data/code ว่าเป็น Demo / Mock Content

### Community และ testimonials

ใช้หัวข้อ `#BookLoop` และข้อความ `แชร์หนังสือเล่มโปรดของคุณ` แสดง testimonial หรือ UGC mock เช่นหนังสือที่กำลังอ่าน หนังสือที่เพิ่งซื้อ หรือหนังสือที่ส่งต่อ พร้อม CTA `แชร์เรื่องราวของคุณ` อธิบาย marketing loop `ซื้อ → อ่าน → แชร์ → คนเห็น → เข้า BookLoop → ซื้อ`

### Marketing funnel

แสดง visual funnel ที่อ่านง่าย ไม่รก:

```text
Awareness      TikTok / Instagram / Facebook
Interest       Recommendation / Review / Short video
Consideration  Click website / Search / View product
Conversion     Add to cart / Purchase
Retention      Review / Favorite / Follow
Advocacy       Share / Recommend / Sell back
```

ใช้เป็นหลักฐานในการนำเสนอ Social Media Marketing ไม่ใช่ dashboard ที่มีตัวเลขปลอมมากเกินไป

### Final CTA และ footer

ใช้ข้อความ `หนังสือเล่มต่อไปของคุณ อาจกำลังรออยู่` พร้อมปุ่มค้นหาหนังสือและขายหนังสือของคุณ Footer มี logo, slogan, About, Contact, FAQ, Privacy, Terms และ social links ที่ไม่ทำให้เกิด dead-end (ลิงก์ demo ให้มีพฤติกรรมหรือระบุสถานะชัดเจน)

---

## 7. หน้า Book listing (`/books`)

สร้างเป็นหน้าที่ใช้งานได้จริงในระดับ prototype:

- search input ที่อ่านค่าจาก `q`
- filter หมวดหมู่
- filter condition
- sort ราคา/ความนิยม/ใหม่ล่าสุด
- price range หรือปุ่มช่วงราคาแบบง่าย
- ผลลัพธ์จำนวนกี่รายการ
- clear filters
- responsive filter drawer บน mobile
- grid ที่ปรับตาม viewport
- empty state เมื่อไม่พบสินค้า

ทุก filter ต้องคำนวณจาก mock data จริง และสะท้อนกลับใน URL query string เมื่อเหมาะสม เพื่อให้ refresh หรือแชร์ URL แล้วยังได้ผลลัพธ์เดิม

---

## 8. หน้า Product Detail (`/books/:id`)

หน้านี้ต้องสมบูรณ์ที่สุดเป็นลำดับที่สอง รองจาก Home และต้องดูเหมือน e-commerce จริง

### Product header

แสดง breadcrumb, gallery รูปหลักและ thumbnail หลายรูป, เปลี่ยนรูปได้, zoom/lightbox แบบเรียบง่ายถ้าทำได้, ชื่อหนังสือ, ผู้เขียน, หมวดหมู่, rating, จำนวนรีวิว, condition, ราคา, ราคาใหม่/ราคาปก, discount, stock, seller และ CTA:

- `ซื้อเลย`
- `เพิ่มลงตะกร้า`
- `เพิ่มรายการโปรด`

บน mobile ต้องจัดลำดับให้ราคาและ CTA อยู่ใกล้ข้อมูลสำคัญและกดง่าย อาจใช้ sticky purchase bar ได้ถ้าทำแล้วไม่บังเนื้อหา

### Condition

รองรับ 4 ระดับพร้อมคำอธิบาย:

- `Excellent` — สภาพใกล้เคียงหนังสือใหม่
- `Very Good` — มีร่องรอยการใช้งานเล็กน้อย
- `Good` — มีร่องรอยการใช้งาน แต่ยังอ่านได้สมบูรณ์
- `Acceptable` — มีร่องรอยการใช้งานชัดเจน แต่ยังสามารถอ่านได้

### Book information

แสดงผู้เขียน, สำนักพิมพ์, ปีที่พิมพ์, ISBN, จำนวนหน้า, ภาษา, edition, condition, ตำหนิ และ seller note ใช้ Tabs หรือ accordion ได้เมื่อช่วยลดความแน่นบน mobile

### Price comparison

ต้องมี visual เปรียบเทียบ:

```text
ราคาหนังสือใหม่โดยประมาณ   ฿450
ราคา BookLoop              ฿220
ประหยัด                    ฿230 (51%)
```

คำนวณ savings และ percentage จาก data อย่า hard-code ให้ไม่ตรงกับราคา พร้อมข้อความ `ซื้อหนังสือที่คุณอยากอ่าน ในราคาที่เข้าถึงง่ายกว่า`

### Story of the book

แสดง section สำคัญ `เรื่องราวของหนังสือเล่มนี้` และคำถาม `ทำไมเจ้าของเดิมถึงส่งต่อหนังสือเล่มนี้?` ใช้ seller story จาก data และเชื่อมกับ slogan

### Seller profile

แสดง avatar, seller name, rating, จำนวนรายการขาย, response rate, join date, seller badge/verified seller และ CTA `ดูสินค้าของผู้ขาย`

### Reviews และ related books

แสดง rating summary, review list, verified purchase, customer photo ถ้ามี และ review date จาก mock data รวมถึง section `คุณอาจชอบหนังสือเหล่านี้` ที่ลิงก์ไปสินค้าที่เกี่ยวข้อง

---

## 9. หน้า Sell (`/sell`)

ทำให้เห็นว่า BookLoop เป็น marketplace สองฝั่ง:

หัวข้อ `มีหนังสือที่ไม่ได้อ่านแล้ว?`

ข้อความ `เปลี่ยนหนังสือที่ไม่ได้ใช้ ให้กลายเป็นคุณค่าใหม่`

แสดง flow:

```text
ถ่ายรูป → กรอกชื่อ / ISBN → ระบุสภาพ → ตั้งราคา → ลงขาย
```

สร้าง form prototype ที่มีอย่างน้อย title/ISBN, category, condition, price, description และ image URL/file placeholder พร้อม validation ที่อ่านเข้าใจง่าย เมื่อ submit สำเร็จให้แสดง success state ว่าเป็น demo และไม่อ้างว่าลงขายบนระบบจริง

---

## 10. หน้า Campaign (`/campaign/read-share-repeat`)

สร้าง landing page สำหรับ traffic จาก Social Media ของ campaign `อ่านจบ ส่งต่อ วนต่อไป` ประกอบด้วย:

```text
Hero
→ Campaign message
→ Featured books
→ Special offer (Demo)
→ Seller / buyer story
→ UGC mock
→ CTA ไป /books
```

ต้องมี campaign-specific copy, social share button ที่ให้ feedback, และ event tracking `campaign_view` / `campaign_click`

---

## 11. Mock data และ business rules

สร้าง data module กลาง เช่น `src/data/books.js` ให้มีหนังสืออย่างน้อย 10 รายการ ครอบคลุมหลายหมวดและหลาย condition ข้อมูลแต่ละรายการควรมี:

```js
{
  id,
  title,
  author,
  category,
  cover,
  images,
  price,
  originalPrice,
  condition,
  conditionDescription,
  rating,
  reviewCount,
  seller: {
    id,
    name,
    avatar,
    rating,
    itemsSold,
    responseRate,
    joinedAt,
    verified
  },
  stock,
  publisher,
  publishedYear,
  isbn,
  pages,
  language,
  edition,
  defects,
  sellerNote,
  story,
  tags,
  featured
}
```

กฎสำคัญ:

- `originalPrice` ต้องมากกว่า `price` เมื่อแสดงส่วนลด
- savings และ percentage ต้องคำนวณจากข้อมูลจริง
- stock เป็นตัวเลข demo และต้องไม่ติดลบเมื่อเพิ่มลงตะกร้า
- product id ต้องเข้าถึงได้จริงจาก route
- ราคาใช้รูปแบบเงินบาทและ locale ที่เหมาะสม
- ทุกตัวเลขสมาชิก/ยอดขาย/สถิติที่ไม่ใช่ข้อมูลจริงต้องติด label `Demo` หรือ `ตัวอย่างข้อมูล`
- ห้ามใช้รีวิวหรือรูปบุคคลที่ทำให้เข้าใจว่าเป็นลูกค้าจริงโดยไม่ระบุว่าเป็น mock

---

## 12. State และ interactions ที่ต้องทำงาน

ใช้ Context หรือ state management ที่เหมาะสม โดยไม่เพิ่ม dependency หนักเกินจำเป็น:

- cart เพิ่ม/ลดจำนวน/ลบสินค้า/คำนวณ subtotal
- wishlist เพิ่ม/ลบและสะท้อนสถานะใน product card กับ detail
- cart และ wishlist เก็บใน localStorage เพื่อให้ refresh แล้วยังอยู่ใน demo
- search และ filter ทำงานจริง
- product detail เปลี่ยนตาม id
- mobile menu เปิด/ปิดและปิดได้ด้วยปุ่ม/การเลือกเมนู
- image gallery เปลี่ยนภาพได้
- share button ใช้ Web Share API เมื่อมี ถ้าไม่มีให้ copy URL หรือแสดง demo feedback
- CTA ที่ยังไม่เชื่อม backend ต้องแสดง dialog/snackbar ที่บอกอย่างตรงไปตรงมาว่าเป็น demo
- loading/empty/error state ต้องอ่านเข้าใจได้

สร้าง analytics abstraction เช่น `trackEvent(name, payload)` ใน `utils/analytics.js` หรือที่เหมาะสม โดยเริ่มต้น log เฉพาะ development หรือเก็บใน memory ก็ได้ ห้ามส่งข้อมูลไปบริการภายนอกโดยไม่ได้รับอนุญาต

รองรับ event อย่างน้อย:

```text
view_home
search_book
view_category
view_product
favorite_book
add_to_cart
begin_checkout
purchase_demo
share_product
sell_book_click
sell_book_submit_demo
campaign_view
campaign_click
social_share
review_submit_demo
```

---

## 13. Accessibility, SEO และ content

### Accessibility

- ใช้ semantic landmarks: header, nav, main, section, footer
- heading hierarchy ไม่ข้ามระดับโดยไม่มีเหตุผล
- ทุกภาพมี alt ที่สื่อความหมาย หรือเป็น decorative อย่างถูกต้อง
- icon-only button มี `aria-label`
- form control มี label และ error message ที่เชื่อมกับ field
- ใช้งานด้วย keyboard ได้
- มี visible focus state
- สีและขนาดตัวอักษรมี contrast เพียงพอ
- เคารพ `prefers-reduced-motion`
- modal/drawer จัดการ focus และปิดด้วย Escape ได้ถ้า component รองรับ

### SEO และ social share

ตั้ง document title และ meta description ตาม route โดยเฉพาะ product detail มี title, description, canonical/product URL และ Open Graph สำหรับชื่อหนังสือ, รูปปก, ราคา, condition และ CTA หากเป็น SPA ให้ทำในระดับที่ทำได้โดยไม่สร้าง backend

### Writing rules

- ใช้ภาษาไทยเป็นหลักและใช้คำอังกฤษเฉพาะที่เป็น label/ศัพท์ e-commerce ที่จำเป็น
- ใช้คำกริยาที่บอกผลลัพธ์ชัด เช่น `เพิ่มลงตะกร้า`, `ค้นหาหนังสือ`, `บันทึกรายการโปรด`
- ใช้คำเดิมตลอดทั้ง flow เช่นถ้าปุ่มคือ `เพิ่มลงตะกร้า` feedback ต้องใช้คำเดียวกัน
- ไม่ใช้ข้อความขายฝันหรือสถิติที่ไม่มีที่มา
- empty state และ error ต้องบอกว่าทำอะไรต่อได้
- สื่อว่าเป็นหนังสือมือสองทุกประเภท ไม่เรียก BookLoop ว่า “ร้านหนังสือเรียนมือสอง”

---

## 14. Motion

ใช้ Framer Motion เท่าที่ช่วยลำดับการรับรู้:

- hero fade/slide เข้าอย่างเบา
- scroll reveal ของ section สำคัญ
- hover/focus ของ product/category card
- product image transition
- flow ของ BookLoop ที่เคลื่อนไหวอย่าง subtle
- social card reveal

กำหนด duration และ easing ให้สม่ำเสมอ ห้ามใส่ animation ทุกองค์ประกอบ ห้ามทำให้การซื้อหรือการค้นหาช้าลง และต้องมี reduced-motion fallback

---

## 14.1 SweetAlert2 และ feedback interactions

ติดตั้งและใช้งาน package `sweetalert2` โดย import แบบ module:

```bash
npm install sweetalert2
```

สร้าง utility กลาง เช่น `src/utils/alerts.js` เพื่อรวมรูปแบบการแจ้งเตือนและไม่เขียน configuration ซ้ำในทุก component ตัวอย่าง:

```js
import Swal from 'sweetalert2';

export function showSuccess(title, text) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: '#1769AA'
  });
}
```

ข้อกำหนดการใช้งาน:

- ปรับสี ปุ่ม ตัวอักษร และ border radius ให้เข้ากับ MUI theme ของ BookLoop
- ใช้ภาษาไทยที่สั้น ชัด และบอกผลลัพธ์ของ action
- ใช้ success alert หลังเพิ่มสินค้าลงตะกร้า, เพิ่มรายการโปรด, submit ฟอร์มขายหนังสือแบบ demo และ purchase demo สำเร็จ
- ใช้ confirmation dialog ก่อนลบสินค้าออกจากตะกร้า, ล้างตะกร้า หรือยืนยัน checkout
- ใช้ warning/error alert เมื่อสินค้าไม่มี stock, จำนวนเกิน stock, ไม่พบสินค้า, form ไม่ผ่าน validation หรือเกิดข้อผิดพลาด
- ปุ่มยืนยันต้องมีข้อความตาม action เช่น `ลบสินค้า`, `ยืนยันการสั่งซื้อ (Demo)`, `ลงขายแบบ Demo` ไม่ใช้คำกำกวมเพียงอย่างเดียว
- ใช้ `showCancelButton`, `cancelButtonText: 'ยกเลิก'` และ `focusCancel: true` กับ confirmation dialog ที่มีความเสี่ยงต่อการกดยืนยันโดยไม่ตั้งใจ
- รักษา keyboard interaction, focus ที่เหมาะสม และไม่ทำให้เกิดการนำทางที่คาดไม่ถึง
- ห้ามใช้ SweetAlert2 กับทุกข้อความเล็ก ๆ จนรบกวนการใช้งาน ใช้ MUI Snackbar สำหรับ feedback ที่ไม่ต้องให้ผู้ใช้ตัดสินใจ
- ทุกข้อความเกี่ยวกับ checkout, payment, seller หรือ account ต้องระบุว่าเป็น `Demo` หากยังไม่ได้เชื่อม backend จริง
- ห้ามใช้ native `alert()`, `confirm()` หรือ `prompt()`

ตัวอย่าง flow ที่ต้องทำให้เห็นใน prototype:

```text
เพิ่มลงตะกร้า
→ SweetAlert2 success: "เพิ่มหนังสือลงตะกร้าแล้ว"

ลบสินค้า
→ SweetAlert2 confirm: "ต้องการลบหนังสือเล่มนี้หรือไม่?"
→ success: "ลบสินค้าแล้ว"

ซื้อเลย / checkout
→ SweetAlert2 confirm: "ยืนยันการสั่งซื้อแบบ Demo หรือไม่?"
→ success: "สั่งซื้อแบบ Demo สำเร็จ"
```

หากใช้ `sweetalert2-react-content` เพิ่มเติม ให้ติดตั้งและใช้อย่างมีเหตุผลเท่านั้น ไม่จำเป็นต้องเพิ่ม wrapper หากไม่ต้อง render React component ภายใน alert

---

## 15. ขั้นตอนการทำงานที่ต้องปฏิบัติตาม

### Phase A — Inspect

1. ตรวจสอบ `package.json`, source tree, entry point และ scripts
2. ตรวจสอบว่ามี asset, theme หรือ component ใดใช้ซ้ำได้
3. ตรวจสอบวิธีรันและคำสั่ง lint/build ที่มีอยู่
4. หากมีความขัดแย้งกับข้อกำหนด ให้เลือกทางที่ทำให้โปรเจกต์รันได้และบันทึกสมมติฐาน

### Phase B — Plan

จัดทำแผนสั้น ๆ ระบุ route map, component boundaries, data model, state ownership, design tokens และเส้นทาง demo หลัก ก่อนเริ่มแก้ไฟล์

### Phase C — Implement

ลงมือสร้างตามลำดับนี้:

1. app shell, theme, router และ layout
2. mock data และ shared state
3. Home และ responsive header/search
4. Book listing, search และ filters
5. Product detail และ gallery
6. cart/wishlist interactions
7. Sell, About, Campaign และ Cart pages
8. social/funnel sections, SEO และ analytics abstraction
9. page-specific responsive layouts และ accessibility states
10. empty/error/success states และ SweetAlert2 feedback

### Phase D — Verify

รันคำสั่งที่มีอยู่ เช่น `npm run lint`, `npm run build` และ dev server ตามความเหมาะสม ตรวจอย่างน้อย:

- เปิด `/` ได้
- ทุก route ที่ระบุเปิดได้โดยตรง
- `/about`, `/sell`, `/campaign/read-share-repeat` และ `/cart` มีเนื้อหา/พฤติกรรมตาม page brief
- search ไป `/books?q=...` และคืนผลลัพธ์ถูกต้อง
- category/filter/sort เปลี่ยนผลลัพธ์จริง
- product card ไป detail ของ id ที่ถูกต้อง
- เพิ่ม/ลด/ลบสินค้าใน cart ได้
- wishlist สะท้อนสถานะข้ามหน้าได้
- refresh แล้วยังเห็น cart/wishlist จาก localStorage
- submit sell form มี validation และ success state
- demo checkout มี confirmation และ success feedback ผ่าน SweetAlert2
- mobile menu และ mobile filter ใช้งานได้
- ไม่มี horizontal overflow
- ไม่มี broken image แบบไม่มี fallback
- lint/build ผ่าน หรืออธิบาย error ที่หลีกเลี่ยงไม่ได้พร้อมแนวทางแก้

ถ้ามีเครื่องมือ browser ให้ตรวจอย่างน้อย desktop และ mobile viewport พร้อม keyboard tab ผ่าน header, search, card CTA และ cart

### Phase E — Handoff

อัปเดต README ให้มี:

- วิธีติดตั้งและรัน
- คำสั่ง lint/build
- รายการ route
- ขอบเขตที่เป็น demo/mock
- วิธีสาธิต customer journey 5–8 ขั้นตอน
- รายการ assumption หรือ limitation สำคัญ

---

## 16. Definition of Done

งานถือว่าเสร็จเมื่อครบทุกข้อ:

- เป็น React application จริง ไม่ใช่ภาพจำลอง
- Home และ Product Detail สมบูรณ์และมี visual quality ระดับ startup/portfolio
- `/books`, `/sell`, `/about`, `/campaign/read-share-repeat` และ `/cart` ใช้งานได้ในระดับ prototype
- navigation, search, filter, product detail, cart และ wishlist ทำงานจริง
- CTA สำคัญทุกปุ่มมีผลลัพธ์หรือ feedback
- feedback สำคัญใช้ SweetAlert2 อย่างสอดคล้องกับ flow และไม่มี native alert/confirm/prompt
- mock data มีความสมจริง หลากหลาย และติดป้าย demo เมื่อจำเป็น
- แสดงราคา/ส่วนลด/condition/seller/review อย่างชัดเจน
- มี Book Story และ Brand Loop ที่ทำให้ BookLoop แตกต่างจาก marketplace ทั่วไป
- มี Social Media Campaign และ funnel ที่เชื่อมกับ customer journey
- responsive บน desktop/tablet/mobile ไม่มี horizontal scroll
- accessibility พื้นฐานผ่านเกณฑ์ที่ระบุ
- มี SEO/social metadata ระดับ prototype
- motion พอดีและรองรับ reduced motion
- lint/build ผ่าน หรือมีรายงานข้อผิดพลาดอย่างโปร่งใส
- README อธิบายวิธีรันและวิธีนำเสนอ

---

## 17. รูปแบบคำตอบเมื่อสร้างเสร็จ

ตอบกลับด้วยสรุปสั้น ๆ ที่ตรวจสอบได้:

1. สิ่งที่สร้างหรือแก้ไข
2. routes ที่พร้อมใช้งาน
3. interactions ที่ทดสอบแล้ว
4. คำสั่ง run/lint/build ที่ใช้
5. ข้อจำกัดที่ยังเป็น demo หรือยังต้องต่อ backend

อย่าอ้างว่ามีการชำระเงินจริง, ผู้ขายจริง, ผู้ใช้จริง, analytics จริง หรือสถิติจริง หากยังไม่ได้เชื่อมระบบเหล่านั้น

ผลลัพธ์สุดท้ายต้องทำให้ผู้ชมรู้สึกว่า:

> BookLoop — หนังสือทุกเล่ม มีเรื่องราวให้คนถัดไป

และสามารถเห็นเส้นทางจาก Social Media → Website → Product → Purchase ได้อย่างชัดเจนภายในแอปเดียว
