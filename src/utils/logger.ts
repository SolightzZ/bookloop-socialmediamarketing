/**
 * Central frontend logger (src/utils/logger.ts)
 *
 * - logWarn: งาน background / best-effort / storage fallback — console.warn อย่างเดียว
 *   (ไม่ส่ง backend กันสแปม rate-limit ของ /api/log.php)
 * - logError: งานที่ user เห็นว่า fail — console.error + ฝาก backend เก็บลง error.log
 *   ผ่าน POST /api/log.php แบบ fire-and-forget (ไปโผล่ console ของ `php -S` ฝั่ง server ด้วย)
 *
 * กฎกัน loop / กันพัง:
 * - ห้าม import apiClient/authService ในไฟล์นี้ (กัน circular import) — ใช้ plain fetch
 * - ห้ามเรียก logWarn/logError ซ้ำข้างใน catch ของตัวเอง
 * - logging ต้องไม่ throw — flow หลักต้องไปต่อเสมอ
 */

function getLoggerApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const { hostname, origin, pathname } = window.location;
    if (hostname.includes('xo.je') || pathname.startsWith('/app') || import.meta.env.BASE_URL === '/app/') {
      return `${origin}/api`;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const envUrl = import.meta.env.VITE_API_BASE_URL;
      if (envUrl && (envUrl.includes('localhost:8000') || envUrl.includes('127.0.0.1:8000'))) {
        return envUrl.replace(/\/+$/, '');
      }
      return '/api';
    }
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://panitijahem.xo.je/api';
}

function errorDetails(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    const stack = error.stack ? ` | ${error.stack.split('\n').slice(0, 3).join(' ')}` : '';
    return { error: `${error.name}: ${error.message}${stack}`.slice(0, 500) };
  }
  if (typeof error === 'string') return { error: error.slice(0, 500) };
  if (error === undefined || error === null) return { error: 'unknown' };
  try {
    return { error: (JSON.stringify(error) ?? 'unknown').slice(0, 500) };
  } catch {
    return { error: 'unserializable' };
  }
}

function currentPage(): string {
  try {
    return window.location.pathname.slice(0, 200);
  } catch {
    return '';
  }
}

/** background / best-effort / storage fallback — เห็นใน devtools console อย่างเดียวพอ */
export function logWarn(message: string, error?: unknown): void {
  if (error === undefined) console.warn(`[BookLoop] ${message}`);
  else console.warn(`[BookLoop] ${message}`, error);
}

/** user-visible failure — console + ฝาก backend เก็บลง error.log (best-effort) */
export function logError(message: string, error?: unknown, extraContext: Record<string, unknown> = {}): void {
  if (error === undefined) console.error(`[BookLoop] ${message}`);
  else console.error(`[BookLoop] ${message}`, error);

  // fire-and-forget — ห้าม throw / ห้าม log ซ้ำข้างใน (กัน loop)
  try {
    const body = JSON.stringify({
      level: 'ERROR',
      message: `[frontend] ${message}`.slice(0, 2000),
      context: {
        page: currentPage(),
        ...errorDetails(error),
        ...extraContext,
      },
    });
    // กัน context ก้อนยักษ์ (backend ปฏิเสธถ้า context เกิน 2KB)
    if (body.length > 3800) return;
    fetch(`${getLoggerApiBaseUrl()}/log.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body,
    }).catch(() => {
      // ตัว endpoint ฝาก log ต้องเงียบเสมอ — กัน loop
    });
  } catch {
    // ignore — logging ต้องไม่พัง flow หลัก
  }
}
