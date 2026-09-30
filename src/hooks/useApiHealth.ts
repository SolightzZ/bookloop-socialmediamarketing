import { useCallback, useRef, useState } from 'react';
import { getApiBaseUrl } from '../services/apiClient';

export type ApiHealthStatus = 'idle' | 'checking' | 'online' | 'offline';

export interface ApiHealth {
  status: ApiHealthStatus;
  latencyMs: number | null;
  endpointCount: number | null;
  baseUrl: string;
  lastChecked: Date | null;
  recheck: () => void;
}

const CHECK_TIMEOUT_MS = 8000;

/**
 * เช็กว่าเส้น API ต่อได้ไหมแบบเดียวกับที่ dashboard ฝั่ง backend ทำ
 * (`GET {base}/` — public endpoint ตอบ 200 JSON ไม่ต้องใช้ token)
 *
 * ใช้ plain fetch ไม่มี header พิเศษ = simple request ไม่เกิด preflight
 * ถ้าเบราว์เซอร์อ่านคำตอบไม่ได้ (CORS/challenge/เน็ตล่ม/timeout) = offline
 *
 * ตั้งใจให้เช็กเฉพาะตอน user กดเท่านั้น (เริ่มที่ idle ไม่ยิงเอง) เพราะทุกครั้ง
 * ที่ยิงแล้วอ่านไม่ได้ browser จะ log CORS error ลง console — auto-poll
 * ทุก 30 วินาทีเลยกลายเป็นตัวผลิต console noise ซะเอง
 */
export function useApiHealth(): ApiHealth {
  const baseUrl = getApiBaseUrl();
  const [status, setStatus] = useState<ApiHealthStatus>('idle');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [endpointCount, setEndpointCount] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const busyRef = useRef(false);

  const check = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setStatus('checking');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
    const started = performance.now();
    try {
      const res = await fetch(`${baseUrl}/`, { cache: 'no-store', signal: controller.signal });
      const text = await res.text();
      let data: { success?: boolean; count?: number } | null = null;
      try {
        data = text ? (JSON.parse(text) as { success?: boolean; count?: number }) : null;
      } catch {
        data = null;
      }
      if (res.ok && data?.success === true) {
        setStatus('online');
        setLatencyMs(Math.round(performance.now() - started));
        setEndpointCount(typeof data.count === 'number' ? data.count : null);
      } else {
        setStatus('offline');
        setLatencyMs(null);
      }
    } catch {
      setStatus('offline');
      setLatencyMs(null);
    } finally {
      window.clearTimeout(timeout);
      setLastChecked(new Date());
      busyRef.current = false;
    }
  }, [baseUrl]);

  return { status, latencyMs, endpointCount, baseUrl, lastChecked, recheck: check };
}
