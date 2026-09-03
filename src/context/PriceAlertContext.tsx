import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { PriceAlert, PriceAlertContextType } from '../types/priceAlert';

export const PriceAlertContext = createContext<PriceAlertContextType | null>(null);

const STORAGE_KEY = 'bookloop_price_alerts';

function load(): PriceAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(alerts: PriceAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // ignore
  }
}

export const PriceAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(load);

  useEffect(() => {
    save(alerts);
  }, [alerts]);

  const addAlert = useCallback(
    (bookId: string, bookTitle: string, bookCover: string, targetPrice: number, currentPrice: number) => {
      setAlerts((prev) => {
        const existing = prev.find((a) => a.bookId === bookId);
        if (existing) {
          return prev.map((a) => (a.bookId === bookId ? { ...a, targetPrice, currentPrice } : a));
        }
        return [
          ...prev,
          {
            id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            bookId,
            bookTitle,
            bookCover,
            targetPrice,
            currentPrice,
            createdAt: Date.now(),
            triggered: false,
          },
        ];
      });
    },
    [],
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const hasAlert = useCallback((bookId: string) => alerts.some((a) => a.bookId === bookId), [alerts]);

  const checkAlerts = useCallback(
    (bookId: string, newPrice: number) => {
      const alert = alerts.find((a) => a.bookId === bookId && !a.triggered);
      if (alert && newPrice <= alert.targetPrice) {
        setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, triggered: true, currentPrice: newPrice } : a)));
        return true;
      }
      return false;
    },
    [alerts],
  );

  const value = useMemo<PriceAlertContextType>(
    () => ({ alerts, addAlert, removeAlert, hasAlert, checkAlerts }),
    [alerts, addAlert, removeAlert, hasAlert, checkAlerts],
  );

  return <PriceAlertContext.Provider value={value}>{children}</PriceAlertContext.Provider>;
};
