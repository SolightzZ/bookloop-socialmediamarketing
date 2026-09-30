const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://panitijahem.xo.je/api';
// ตัด trailing slash ท้ายกัน URL ซ้อนเป็น `//auth_me.php` (frontend อยู่ sub-path บน Pages)
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/** Base URL ของ backend ที่ build นี้ยิงไป (ให้ health check / debug UI ใช้อันเดียวกับ request จริง) */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

const SESSION_TOKEN_KEY = 'bookloop_auth_session_token';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Error thrown for a non-2xx response or a `success: false` payload.
 * `status` lets callers tell "this token is no longer valid" (401/403)
 * apart from "the backend is unreachable" (5xx) without matching strings.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function readStoredToken(): string | null {
  try {
    const stored = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    return session?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = readStoredToken();
  const method = (options.method ?? 'GET').toUpperCase();

  // ส่ง token โดยไม่ใช้ Authorization header (shared host มักตัดทิ้ง):
  // ส่ง token ใน query (GET/DELETE) หรือใน JSON body (POST) แทน
  // Content-Type: application/json — production หลักคือ /app/ (same-origin) จึงไม่ติด preflight
  let url = `${API_BASE_URL}/${endpoint}`;
  if (token && (method === 'GET' || method === 'DELETE')) {
    url += `${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
  }

  let body: string | undefined;
  if (options.body !== undefined) {
    const raw = options.body as string;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (token && method === 'POST' && parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        body = JSON.stringify({ ...(parsed as Record<string, unknown>), token });
      } else {
        body = raw;
      }
    } catch {
      body = raw;
    }
  } else if (token && method === 'POST') {
    // POST ตัวเปล่า (เช่น auth_logout) — ใส่ token ใน body ให้ backend หาเจอโดยไม่ต้องมี header
    body = JSON.stringify({ token });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json;charset=UTF-8',
    ...(options.headers as Record<string, string>),
  };
  delete headers['Authorization'];

  // fetch ล้ม (เน็ตล่ม / DNS / CORS preflight ไม่ผ่าน) จะโยน TypeError ดิบๆ
  // ("Failed to fetch") — แปลงเป็น ApiError ภาษาไทย ให้ฟอร์มแสดงรู้เรื่อง
  // ใช้ status 0 = ระดับเครือข่าย (ไม่ใช่ HTTP status) caller ที่แยก 401/403
  // ออกจาก 5xx จะได้ปฏิบัติกับเคสนี้แบบเดียวกับ "backend ชั่วคราวไม่พร้อม"
  // credentials:include = ส่ง __test cookie ของ InfinityFree ไปด้วย (ไม่มีแล้วโดนหน้า challenge)
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body,
      credentials: 'include',
    });
  } catch {
    throw new ApiError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้ง', 0);
  }

  // body อาจไม่ใช่ JSON (PHP fatal / InfinityFree anti-bot ส่ง HTML มา) — กัน "Unexpected token '<'"
  const text = await response.text().catch(() => '');
  let result: ApiResponse<T> | null = null;
  try {
    result = text ? (JSON.parse(text) as ApiResponse<T>) : null;
  } catch {
    result = null;
  }

  if (!response.ok || !result?.success) {
    const isHtmlChallenge = text.trimStart().startsWith('<');
    // HTTP 200 + HTML = หน้า JS challenge ของโฮสต์ (InfinityFree ส่งหน้า aes.js มาแทน JSON เมื่อ
    // request ไม่มีคุกกี้ __test) — fetch เรียกหน้า challenge ให้รัน JS เองไม่ได้ และเบราว์เซอร์ก็ไม่ส่ง
    // คุกกี้ Lax แบบข้ามโดเมน → ได้ 200 ที่ไม่มี ACAO header = "blocked by CORS policy"
    const isHostChallenge = isHtmlChallenge && response.status === 200;
    throw new ApiError(
      isHostChallenge
        ? 'backend ถูกบังด้วยระบบป้องกันบอตของโฮสต์ (ตอบกลับเป็นหน้า HTML ไม่ใช่ JSON) — ต้องเสิร์ฟ frontend จากโดเมนเดียวกับ backend จึงจะใช้งานได้ (ดู infinityfree_package/CORS-TROUBLESHOOTING.txt)'
        : isHtmlChallenge
          ? `เชื่อมต่อ backend ไม่ได้ (เซิร์ฟเวอร์ตอบกลับเป็น HTML แทน JSON, HTTP ${response.status})`
          : result?.message || `เกิดข้อผิดพลาด (${response.status})`,
      response.status,
    );
  }

  return result as T;
}

export const apiClient = {
  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, data?: unknown): Promise<T> {
    // ส่ง DELETE เป็น POST + _method แทน (backend ยอมรับทั้งสองแบบ)
    const payload =
      data !== null && typeof data === 'object' && !Array.isArray(data)
        ? { ...(data as Record<string, unknown>), _method: 'DELETE' }
        : { _method: 'DELETE' };
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
