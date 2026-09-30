const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// ตัด trailing slash ท้ายกัน URL ซ้อนเป็น `//auth_me.php` (frontend อยู่ sub-path บน Pages)
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

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
  const url = `${API_BASE_URL}/${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = readStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

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
    throw new ApiError(
      isHtmlChallenge
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
    return request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};
