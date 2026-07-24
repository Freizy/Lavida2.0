'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const queryRef = useRef<Query<T> | null>(null);

  useEffect(() => {
    if (query === queryRef.current) return;
    queryRef.current = query;

    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore useCollection error:', err);
        setError(err);
        setLoading(false);
      }
    );

    unsubRef.current = unsubscribe;

    return () => {
      unsubscribe();
      unsubRef.current = null;
    };
  });

  return { data, loading, error };
}
