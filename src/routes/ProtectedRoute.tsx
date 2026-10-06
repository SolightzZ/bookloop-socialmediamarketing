import { RequireAuth } from '../components/auth/RequireAuth';

/** Alias โดยตั้งใจ: /account/* ใช้ guard เดียวกับ /checkout (ตรวจสอบแล้ว logic เดียวกัน) */
export const ProtectedRoute = RequireAuth;
