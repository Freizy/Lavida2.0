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
  createdAt: any;
  userId: string;
};

export function useMedications() {
  const db = useFirestore();
  const { user } = useUser();

  const medicationsRef = useMemo(() => {
    if (!db || !user) return null;
    return collection(db, "medications");
  }, [db, user]);

  const queryRef = useMemo(() => {
    if (!medicationsRef || !user) return null;
    return query(medicationsRef, where("userId", "==", user.uid));
  }, [medicationsRef, user]);

  const { data: medications, loading } = useCollection(queryRef);

  const addMedication = useCallback(
    async (med: Omit<Medication, "id" | "createdAt" | "userId">) => {
      if (!medicationsRef || !user) return;
      await addDoc(medicationsRef, {
        ...med,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    },
    [medicationsRef, user]
  );

  const updateMedication = useCallback(
    async (id: string, updates: Partial<Medication>) => {
      if (!db || !user) return;
      const docRef = doc(db, "medications", id);
      await updateDoc(docRef, updates);
    },
    [db, user]
  );

  const deleteMedication = useCallback(
    async (id: string) => {
      if (!db) return;
      const docRef = doc(db, "medications", id);
      await deleteDoc(docRef);
    },
    [db]
  );

  const toggleActive = useCallback(
    async (id: string, currentActive: boolean) => {
      await updateMedication(id, { active: !currentActive });
    },
    [updateMedication]
  );

  const activeMedications = (medications || []).filter((m: Medication) => m.active);
  const inactiveMedications = (medications || []).filter((m: Medication) => !m.active);

  return {
    medications: medications || [],
    activeMedications,
    inactiveMedications,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleActive,
  };
}
