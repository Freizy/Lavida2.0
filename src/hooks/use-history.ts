"use client";

import { useMemo } from "react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";

export type HistoryCondition = {
  name: string;
  cause?: string;
  urgency: string;
  nextSteps?: string;
};

export type HistoryDoc = {
  id: string;
  gender: string;
  age: number;
  symptoms: string;
  conditions: HistoryCondition[];
  timestamp: { toDate: () => Date } | null;
  userId: string;
};

export function useHistory(maxItems = 50) {
  const { user } = useUser();
  const db = useFirestore();

  const historyQuery = useMemo(() => {
    if (!user?.uid || !db) return null;
    return query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      limit(maxItems),
    );
  }, [user?.uid, db, maxItems]);

  const { data: rawItems, loading, error } = useCollection(historyQuery);

  const items = useMemo(() => {
    if (!rawItems) return null;
    return [...rawItems].sort((a, b) => {
      const aTime = (a.timestamp as HistoryDoc["timestamp"])?.toDate?.()?.getTime?.() || 0;
      const bTime = (b.timestamp as HistoryDoc["timestamp"])?.toDate?.()?.getTime?.() || 0;
      return bTime - aTime;
    }) as HistoryDoc[];
  }, [rawItems]);

  return { items, loading, error };
}
