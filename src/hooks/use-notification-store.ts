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
} from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { useCollection } from "@/firebase";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  type: "reminder" | "alert" | "info";
  createdAt: any;
  userId: string;
};

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

  const { data: notifications, loading } = useCollection(queryRef);

  const addNotification = useCallback(
    async (title: string, body: string, type: NotificationItem["type"] = "info") => {
      if (!notificationsRef || !uid) return;
      await addDoc(notificationsRef, {
        title,
        body,
        type,
        read: false,
        userId: uid,
        createdAt: serverTimestamp(),
      });
    },
    [notificationsRef, uid]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      if (!db) return;
      const docRef = doc(db, "notifications", id);
      await updateDoc(docRef, { read: true });
    },
    [db]
  );

  const markAllAsRead = useCallback(async () => {
    if (!db || !notifications) return;
    const batch = writeBatch(db);
    notifications.forEach((n: NotificationItem) => {
      if (!n.read) {
        const docRef = doc(db, "notifications", n.id);
        batch.update(docRef, { read: true });
      }
    });
    await batch.commit();
  }, [db, notifications]);

  const clearNotification = useCallback(
    async (id: string) => {
      if (!db) return;
      const docRef = doc(db, "notifications", id);
      await deleteDoc(docRef);
    },
    [db]
  );

  const clearAll = useCallback(async () => {
    if (!db || !notifications) return;
    const batch = writeBatch(db);
    notifications.forEach((n: NotificationItem) => {
      const docRef = doc(db, "notifications", n.id);
      batch.delete(docRef);
    });
    await batch.commit();
  }, [db, notifications]);

  const unreadCount = useMemo(
    () => (notifications || []).filter((n: NotificationItem) => !n.read).length,
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
