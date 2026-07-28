"use client";

import { useMemo, useCallback } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { useCollection } from "@/firebase";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  type: "reminder" | "alert" | "info";
  createdAt: Timestamp;
  userId: string;
};

const BATCH_LIMIT = 500;

export function useNotificationStore() {
  const db = useFirestore();
  const { user } = useUser();
  const uid = user?.uid ?? null;

  const notificationsRef = useMemo(() => {
    if (!db || !uid) return null;
    return collection(db, "notifications");
  }, [db, uid]);

  const queryRef = useMemo(() => {
    if (!notificationsRef || !uid) return null;
    return query(notificationsRef, where("userId", "==", uid));
  }, [notificationsRef, uid]);

  const { data: rawNotifications, loading } = useCollection(queryRef);
  const notifications = useMemo(() => (rawNotifications || []) as unknown as NotificationItem[], [rawNotifications]);

  const addNotification = useCallback(
    async (title: string, body: string, type: NotificationItem["type"] = "info") => {
      if (!notificationsRef || !uid) return;
      try {
        await addDoc(notificationsRef, {
          title,
          body,
          type,
          read: false,
          userId: uid,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[LaVida] Failed to add notification:", err);
        throw err;
      }
    },
    [notificationsRef, uid]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      if (!db) return;
      try {
        const docRef = doc(db, "notifications", id);
        await updateDoc(docRef, { read: true });
      } catch (err) {
        console.error("[LaVida] Failed to mark notification as read:", err);
        throw err;
      }
    },
    [db]
  );

  const markAllAsRead = useCallback(async () => {
    if (!db || !notifications) return;
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      for (let i = 0; i < unread.length; i += BATCH_LIMIT) {
        const chunk = unread.slice(i, i + BATCH_LIMIT);
        const batch = writeBatch(db);
        chunk.forEach((n) => {
          const docRef = doc(db, "notifications", n.id);
          batch.update(docRef, { read: true });
        });
        await batch.commit();
      }
    } catch (err) {
      console.error("[LaVida] Failed to mark all notifications as read:", err);
      throw err;
    }
  }, [db, notifications]);

  const clearNotification = useCallback(
    async (id: string) => {
      if (!db) return;
      try {
        const docRef = doc(db, "notifications", id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error("[LaVida] Failed to clear notification:", err);
        throw err;
      }
    },
    [db]
  );

  const clearAll = useCallback(async () => {
    if (!db || !notifications || notifications.length === 0) return;
    try {
      for (let i = 0; i < notifications.length; i += BATCH_LIMIT) {
        const chunk = notifications.slice(i, i + BATCH_LIMIT);
        const batch = writeBatch(db);
        chunk.forEach((n) => {
          const docRef = doc(db, "notifications", n.id);
          batch.delete(docRef);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error("[LaVida] Failed to clear all notifications:", err);
      throw err;
    }
  }, [db, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return {
    notifications: notifications || [],
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  };
}
