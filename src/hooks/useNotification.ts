import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    // ปกติแปลว่า component ถูกเรนเดอร์นอก <NotificationProvider> (ดูลำดับ provider ใน src/app/providers.tsx)
    // แต่ใน dev: ถ้าโครงสร้างถูกแล้วยังเจอ error นี้ (มักเกิดหลังแก้ไฟล์ขณะเปิดหน้าเว็บอยู่)
    // = Fast Refresh อัปเดต module แบบ hot แล้วได้ context object ตัวใหม่ ไม่ตรงกับตัวที่ provider ถืออยู่
    // → กด Ctrl+Shift+R (hard reload) หรือรีสตาร์ท `npm run dev` แล้วจะหาย (ไม่ใช่บั๊กของโค้ด)
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
}
