import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { RecentlyViewedBook, RecentlyViewedContextType } from '../types/recentlyViewed';
import { logWarn } from '../utils/logger';

export const RecentlyViewedContext = createContext<RecentlyViewedContextType | null>(null);

const STORAGE_KEY = 'bookloop_recently_viewed';
const MAX_ITEMS = 20;

function load(): RecentlyViewedBook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    logWarn('load recently viewed: corrupt data, starting empty', e);
    return [];
  }
}

function save(items: RecentlyViewedBook[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // storage เต็ม — ข้ามการ persist รอบนี้ แต่ต้องเห็นใน console
    logWarn('save recently viewed: storage write failed', e);
  }
}

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedBook[]>(load);

  useEffect(() => {
    save(recentlyViewed);
  }, [recentlyViewed]);

  const trackView = useCallback((bookId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r.bookId !== bookId);
      const next = [{ bookId, viewedAt: Date.now() }, ...filtered];
      return next.length > MAX_ITEMS ? next.slice(0, MAX_ITEMS) : next;
    });
  }, []);

  const getRecentIds = useCallback(
    (count = 8) => recentlyViewed.slice(0, count).map((r) => r.bookId),
    [recentlyViewed],
  );

  const clearRecent = useCallback(() => setRecentlyViewed([]), []);

  const value = useMemo<RecentlyViewedContextType>(
    () => ({ recentlyViewed, trackView, getRecentIds, clearRecent }),
    [recentlyViewed, trackView, getRecentIds, clearRecent],
  );

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
};
