import React from 'react';
import {
  TypeScriptLogo,
  ReactLogo,
  ViteLogo,
  ReactRouterLogo,
  MuiLogo,
  MuiIconsLogo,
  EmotionLogo,
  FramerMotionLogo,
  SweetAlert2Logo,
  LocalStorageLogo,
  TscLogo,
} from './TechLogos';

export interface StackLayerItem {
  layer: string;
  tech: string;
  logo: React.ReactNode;
  role: string;
  category: string;
}

export const stackLayers: StackLayerItem[] = [
  {
    layer: 'Programming Language',
    tech: 'TypeScript 5.8 (TSX)',
    logo: <TypeScriptLogo />,
    role: 'พิมพ์โค้ดที่มี Type Safety ครบถ้วน ตรวจจับ Type Error ก่อนรัน และสนับสนุน Refactoring',
    category: 'Core',
  },
  {
    layer: 'UI Framework & Runtime',
    tech: 'React 19',
    logo: <ReactLogo />,
    role: 'สถาปัตยกรรม Component-based แยกส่วนชัดเจน และจัดการ State ด้วย React Hooks มาตรฐาน',
    category: 'Core',
  },
  {
    layer: 'Build Tool & Dev Server',
    tech: 'Vite 8',
    logo: <ViteLogo />,
    role: 'HMR Dev server ที่รวดเร็ว และ Bundler ที่แปลงเป็น Static SPA ไฟล์พร้อม Deploy ทันที',
    category: 'Build',
  },
  {
    layer: 'Client Routing',
    tech: 'React Router v7',
    logo: <ReactRouterLogo />,
    role: 'ระบบ SPA Routing รองรับ Nested Layout, Dynamic URL (:id), และ Search Query params',
    category: 'Navigation',
  },
  {
    layer: 'UI Component System',
    tech: 'MUI v6 / v9 Standard',
    logo: <MuiLogo />,
    role: 'UI Foundation หลัก ควบคุม Layout, Grid, Typography, Input, Card, Modal, และ Breakpoints',
    category: 'Design System',
  },
  {
    layer: 'Iconography',
    tech: '@mui/icons-material',
    logo: <MuiIconsLogo />,
    role: 'ชุดไอคอนมาตรฐาน Material Design ครอบคลุมการซื้อขาย ค้นหา ตัวกรอง และการแจ้งเตือน',
    category: 'Design System',
  },
  {
    layer: 'Styling Engine',
    tech: 'Emotion + MUI Theme',
    logo: <EmotionLogo />,
    role: 'CSS-in-JS Engine จัดการ Theme Tokens, Color Palettes และ Custom sx properties',
    category: 'Design System',
  },
  {
    layer: 'Animation & Motion',
    tech: 'Framer Motion / Motion',
    logo: <FramerMotionLogo />,
    role: 'Page Reveal, Transitions, Card Hover Effect, และการแสดงผล BookLoop Flow',
    category: 'UX/Animation',
  },
  {
    layer: 'Feedback & Modals',
    tech: 'SweetAlert2 + MUI Snackbar',
    logo: <SweetAlert2Logo />,
    role: 'Dialog ยืนยันการสั่งซื้อ แจ้งเตือนข้อผิดพลาด และ Interactive Alerts สำหรับผู้ใช้',
    category: 'Feedback',
  },
  {
    layer: 'State & Storage',
    tech: 'React Context + localStorage',
    logo: <LocalStorageLogo />,
    role: 'Cart/Wishlist Global State พร้อม Client Persistence บันทึกข้อมูลลงเบราว์เซอร์อัตโนมัติ',
    category: 'State',
  },
  {
    layer: 'Code Quality & Lint',
    tech: 'TypeScript Compiler (tsc)',
    logo: <TscLogo />,
    role: 'ตรวจสอบ Type Integrity ปราศจาก Any เพื่อให้ Codebase สะอาดและปลอดภัยต่อการ Deploy',
    category: 'Quality',
  },
];

export const corePrinciples = [
  {
    title: '1. Standard Component First',
    desc: 'ใช้ MUI components สำหรับ Layout, Navigation, Form, Card, Table และ Feedback ก่อนสร้าง component ขึ้นมาเอง',
  },
  {
    title: '2. Theme as Single Source of Truth',
    desc: 'ใช้ ThemeProvider และ createTheme เป็นแหล่งกำหนดค่าสี Typography, Spacing, Radius และ Shadows ร่วมกัน',
  },
  {
    title: '3. Token-based Styling (sx Props)',
    desc: 'ใช้ sx props หรือ Emotion สำหรับ custom style โดยอ้างอิง tokens จาก MUI theme เสมอ ห้ามฮาร์ดโค้ดค่าสีสุ่ม',
  },
  {
    title: '4. Unified Iconography System',
    desc: 'ใช้ @mui/icons-material เป็นระบบไอคอนมาตรฐานเดียวกันทั้งระบบ เพื่อความสวยงามและประสิทธิภาพสูง',
  },
  {
    title: '5. No Framework Duplication',
    desc: 'ไม่เพิ่ม Bootstrap หรือ UI Library อื่นมาทับซ้อน เพื่อให้ Bundle Size มีขนาดกะทัดรัดและโหลดเร็ว',
  },
  {
    title: '6. Zero Redundant CSS',
    desc: 'หลีกเลี่ยงการเขียน CSS ซ้ำซ้อนเพื่อเลียนแบบ UI ที่ MUI มีให้อยู่แล้ว เช่น Modal, Drawer, Tooltip, Badge',
  },
  {
    title: '7. Accessibility & Keyboard Nav',
    desc: 'คงไว้ซึ่งการรองรับ Keyboard Navigation, Focus Indicators, ARIA labels และ Responsive Drawer ครบถ้วน',
  },
];

export const colorTokens = [
  { name: 'Ink / Primary Navy', hex: '#102A43', usage: 'Header, Primary Buttons, Main Headings, Strong Emphasis', darkText: false },
  { name: 'Deep Navy', hex: '#0B1F33', usage: 'Footer Background, High-contrast Dark Sections', darkText: false },
  { name: 'Action Blue / Secondary', hex: '#1769AA', usage: 'Action Buttons, Active State, Selected Filters, Links', darkText: false },
  { name: 'Soft Blue Surface', hex: '#E8F1F8', usage: 'Badge Backgrounds, Highlighted Panels, Icon Containers', darkText: true },
  { name: 'Warm Surface / Canvas BG', hex: '#F7F9FB', usage: 'Page Background Canvas, Neutral Dividers', darkText: true },
  { name: 'Paper White', hex: '#FFFFFF', usage: 'Card Backgrounds, Modals, Drawer Backgrounds', darkText: true },
  { name: 'Muted Text Slate', hex: '#52606D', usage: 'Secondary Text, Descriptions, Metadata, Labels', darkText: false },
  { name: 'Border Slate', hex: '#D9E2EC', usage: 'Card Borders, Input Outlines, Table Borders', darkText: true },
  { name: 'Status: Eco Green', hex: '#2E7D5B', usage: 'สภาพเหมือนใหม่ (Excellent), ประหยัดเงิน, สำเร็จ', darkText: false },
  { name: 'Status: Amber Orange', hex: '#B7791F', usage: 'สภาพดี / พอใช้ (Good/Acceptable), เตือนสต็อก', darkText: false },
  { name: 'Status: Danger Red', hex: '#B42318', usage: 'ปุ่มลบสินค้า, ส่วนลดพิเศษ, Wishlist Active', darkText: false },
];
