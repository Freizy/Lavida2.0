"use client";

import { useState, useEffect, useCallback } from "react";

type NotificationPermission = "default" | "granted" | "denied";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return "denied";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission !== "granted") return null;
      return new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    },
    [permission]
  );

  const scheduleReminder = useCallback(
    (title: string, body: string, delayMs: number) => {
      if (permission !== "granted") return null;
      const timeoutId = setTimeout(() => {
        sendNotification(title, { body, tag: "medication-reminder" });
      }, delayMs);
      return () => clearTimeout(timeoutId);
    },
    [permission, sendNotification]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleReminder,
  };
}
