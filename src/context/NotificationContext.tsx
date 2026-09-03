import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AppNotification, NotificationContextType } from '../types/notification';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext<NotificationContextType | null>(null);

const STORAGE_KEY = 'bookloop_notifications';
const MAX_NOTIFICATIONS = 50;

function getStorageKey(userId: string | null): string {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
}

function loadNotifications(userId: string | null): AppNotification[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(userId: string | null, notifications: AppNotification[]): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(notifications));
  } catch {
    // storage full — silently drop oldest
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications(userId));

  useEffect(() => {
    setNotifications(loadNotifications(userId));
  }, [userId]);

  useEffect(() => {
    saveNotifications(userId, notifications);
  }, [userId, notifications]);

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: AppNotification = {
        ...n,
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        return next.length > MAX_NOTIFICATIONS ? next.slice(0, MAX_NOTIFICATIONS) : next;
      });
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
