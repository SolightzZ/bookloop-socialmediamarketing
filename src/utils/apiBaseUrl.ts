/**
 * Shared API base URL resolver (no imports — กัน circular import).
 * apiClient.ts และ utils/logger.ts ใช้ตัวเดียวกัน จะได้ไม่ drift กัน
 */
export function getApiBaseUrl(): string {
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
