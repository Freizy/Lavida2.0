"use client";

import { useState, useEffect, useCallback } from "react";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  type: "reminder" | "alert" | "info";
};

const STORAGE_KEY = "lavidanotifications";

export function useNotificationStore() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          time: new Date(n.time),
        }));
        setNotifications(parsed);
      } catch {}
    }
  }, []);

  const save = useCallback((items: NotificationItem[]) => {
    setNotifications(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addNotification = useCallback(
    (title: string, body: string, type: NotificationItem["type"] = "info") => {
      const item: NotificationItem = {
        id: Date.now().toString(),
        title,
        body,
        time: new Date(),
        read: false,
        type,
      };
      save([item, ...notifications]);
    },
    [notifications, save]
  );

  const markAsRead = useCallback(
    (id: string) => {
      save(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    },
    [notifications, save]
  );

  const markAllAsRead = useCallback(() => {
    save(notifications.map((n) => ({ ...n, read: true })));
  }, [notifications, save]);

  const clearNotification = useCallback(
    (id: string) => {
      save(notifications.filter((n) => n.id !== id));
    },
    [notifications, save]
  );

  const clearAll = useCallback(() => {
    save([]);
  }, [save]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  };
}
