/**
 * คืน path ปลายทางหลัง login/register ที่ปลอดภัย — อนุญาตเฉพาะ path ภายในแอป
 * (ขึ้นต้นด้วย `/` ตัวเดียว ไม่ใช่ `//`, `/\`, หรือ URL เต็ม) กัน open redirect
 * ไปเว็บฟิชชิงผ่าน `?redirect=` หรือ `location.state.from`
 */
export function getSafeRedirectPath(candidate: unknown, fallback = '/'): string {
  let path: string | null = null;

  if (typeof candidate === 'string') {
    path = candidate;
  } else if (
    candidate &&
    typeof candidate === 'object' &&
    typeof (candidate as { pathname?: unknown }).pathname === 'string'
  ) {
    // บางที่ส่ง state.from มาเป็น { pathname } object
    path = (candidate as { pathname: string }).pathname;
  }

  if (!path) return fallback;

  const trimmed = path.trim();
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\')
  ) {
    return fallback;
  }

  return trimmed;
}
