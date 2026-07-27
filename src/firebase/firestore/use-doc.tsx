'use client';

import { useEffect, useState, useRef } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setError(null);
      setLoading(false);
      lastPathRef.current = null;
      return;
    }

    const path = ref.path;
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? snapshot.data()! : null);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore useDoc error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      lastPathRef.current = null;
    };
  }, [ref]);

  return { data, loading, error };
}
