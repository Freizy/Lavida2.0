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
  type Timestamp,
} from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { useCollection } from "@/firebase";

export type Reminder = {
  id: string;
  title: string;
  description: string;
  time: string;
  repeat: "daily" | "weekly" | "once";
  active: boolean;
  createdAt: Timestamp;
  userId: string;
};

export function useReminders() {
  const db = useFirestore();
  const { user } = useUser();
  const uid = user?.uid ?? null;

  const remindersRef = useMemo(() => {
    if (!db || !uid) return null;
    return collection(db, "reminders");
  }, [db, uid]);

  const queryRef = useMemo(() => {
    if (!remindersRef || !uid) return null;
    return query(remindersRef, where("userId", "==", uid));
  }, [remindersRef, uid]);

  const { data: rawReminders, loading } = useCollection(queryRef);
  const reminders = useMemo(() => (rawReminders || []) as unknown as Reminder[], [rawReminders]);

  const addReminder = useCallback(
    async (reminder: Omit<Reminder, "id" | "createdAt" | "userId">) => {
      if (!remindersRef || !uid) return;
      try {
        await addDoc(remindersRef, {
          ...reminder,
          userId: uid,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[LaVida] Failed to add reminder:", err);
        throw err;
      }
    },
    [remindersRef, uid]
  );

  const toggleReminder = useCallback(
    async (id: string, currentActive: boolean) => {
      if (!db) return;
      try {
        const docRef = doc(db, "reminders", id);
        await updateDoc(docRef, { active: !currentActive });
      } catch (err) {
        console.error("[LaVida] Failed to toggle reminder:", err);
        throw err;
      }
    },
    [db]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      if (!db) return;
      try {
        const docRef = doc(db, "reminders", id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error("[LaVida] Failed to delete reminder:", err);
        throw err;
      }
    },
    [db]
  );

  return {
    reminders,
    loading,
    addReminder,
    toggleReminder,
    deleteReminder,
  };
}
