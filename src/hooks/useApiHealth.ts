import { useCallback, useEffect, useState } from 'react';
import { getApiBaseUrl } from '../services/apiClient';

export type ApiHealthStatus = 'checking' | 'online' | 'offline';

export interface ApiHealth {
  status: ApiHealthStatus;
  latencyMs: number | null;
  endpointCount: number | null;
  baseUrl: string;
  lastChecked: Date | null;
  recheck: () => void;
}

const CHECK_TIMEOUT_MS = 8000;
const CHECK_INTERVAL_MS = 30000;

/**
 * เช็กว่าเส้น API ต่อได้ไหมแบบเดียวกับที่ dashboard ฝั่ง backend ทำ
 * (`GET {base}/` — public endpoint ตอบ 200 JSON ไม่ต้องใช้ token)
 *
 * ใช้ plain fetch ไม่มี header พิเศษ = simple request ไม่เกิด preflight
 * ถ้าเบราว์เซอร์อ่านคำตอบไม่ได้ (CORS/challenge/เน็ตล่ม/timeout) = offline
 */
export function useApiHealth(): ApiHealth {
  const baseUrl = getApiBaseUrl();
  const [status, setStatus] = useState<ApiHealthStatus>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [endpointCount, setEndpointCount] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = useCallback(async () => {
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
    }
  }, [baseUrl]);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (alive && !document.hidden) void check();
    };
    run();
    const timer = window.setInterval(run, CHECK_INTERVAL_MS);
    const onVisible = () => {
      if (!document.hidden) void check();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [check]);

  return { status, latencyMs, endpointCount, baseUrl, lastChecked, recheck: check };
}
