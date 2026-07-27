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

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: "daily" | "twice_daily" | "three_times_daily" | "weekly" | "as_needed";
  times: string[];
  notes: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  createdAt: Timestamp;
  userId: string;
};

export function useMedications() {
  const db = useFirestore();
  const { user } = useUser();
  const uid = user?.uid ?? null;

  const medicationsRef = useMemo(() => {
    if (!db || !uid) return null;
    return collection(db, "medications");
  }, [db, uid]);

  const queryRef = useMemo(() => {
    if (!medicationsRef || !uid) return null;
    return query(medicationsRef, where("userId", "==", uid));
  }, [medicationsRef, uid]);

  const { data: rawMedications, loading } = useCollection(queryRef);
  const medications = useMemo(() => (rawMedications || []) as Medication[], [rawMedications]);

  const addMedication = useCallback(
    async (med: Omit<Medication, "id" | "createdAt" | "userId">) => {
      if (!medicationsRef || !uid) return;
      try {
        await addDoc(medicationsRef, {
          ...med,
          userId: uid,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("[LaVida] Failed to add medication:", err);
        throw err;
      }
    },
    [medicationsRef, uid]
  );

  const updateMedication = useCallback(
    async (id: string, updates: Partial<Medication>) => {
      if (!db) return;
      try {
        const docRef = doc(db, "medications", id);
        await updateDoc(docRef, updates);
      } catch (err) {
        console.error("[LaVida] Failed to update medication:", err);
        throw err;
      }
    },
    [db]
  );

  const deleteMedication = useCallback(
    async (id: string) => {
      if (!db) return;
      try {
        const docRef = doc(db, "medications", id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error("[LaVida] Failed to delete medication:", err);
        throw err;
      }
    },
    [db]
  );

  const toggleActive = useCallback(
    async (id: string, currentActive: boolean) => {
      await updateMedication(id, { active: !currentActive });
    },
    [updateMedication]
  );

  const activeMedications = medications.filter((m) => m.active);
  const inactiveMedications = medications.filter((m) => !m.active);

  return {
    medications,
    activeMedications,
    inactiveMedications,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleActive,
  };
}
