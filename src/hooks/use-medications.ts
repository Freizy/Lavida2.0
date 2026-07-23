"use client";

import { useState, useEffect, useCallback } from "react";

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
  createdAt: Date;
};

const STORAGE_KEY = "lavidamedications";

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }));
        setMedications(parsed);
      } catch {}
    }
  }, []);

  const save = useCallback((items: Medication[]) => {
    setMedications(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addMedication = useCallback(
    (med: Omit<Medication, "id" | "createdAt">) => {
      const newItem: Medication = {
        ...med,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      save([newItem, ...medications]);
      return newItem;
    },
    [medications, save]
  );

  const updateMedication = useCallback(
    (id: string, updates: Partial<Medication>) => {
      save(medications.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    },
    [medications, save]
  );

  const deleteMedication = useCallback(
    (id: string) => {
      save(medications.filter((m) => m.id !== id));
    },
    [medications, save]
  );

  const toggleActive = useCallback(
    (id: string) => {
      save(
        medications.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
      );
    },
    [medications, save]
  );

  const activeMedications = medications.filter((m) => m.active);
  const inactiveMedications = medications.filter((m) => !m.active);

  return {
    medications,
    activeMedications,
    inactiveMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleActive,
  };
}
