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
  createdAt: any;
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

  const { data: reminders, loading } = useCollection(queryRef);

  const addReminder = useCallback(
    async (reminder: Omit<Reminder, "id" | "createdAt" | "userId">) => {
      if (!remindersRef || !uid) return;
      await addDoc(remindersRef, {
        ...reminder,
        userId: uid,
        createdAt: serverTimestamp(),
      });
    },
    [remindersRef, uid]
  );

  const toggleReminder = useCallback(
    async (id: string, currentActive: boolean) => {
      if (!db) return;
      const docRef = doc(db, "reminders", id);
      await updateDoc(docRef, { active: !currentActive });
    },
    [db]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      if (!db) return;
      const docRef = doc(db, "reminders", id);
      await deleteDoc(docRef);
    },
    [db]
  );

  return {
    reminders: reminders || [],
    loading,
    addReminder,
    toggleReminder,
    deleteReminder,
  };
}
