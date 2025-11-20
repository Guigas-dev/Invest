'use client';

import {
  collection,
  onSnapshot,
  query,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';

export function useCollection<T>(path: string, q?: Query) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const queryRef = useRef(q);

  useEffect(() => {
    if (!queryRef.current) return;

    const unsubscribe = onSnapshot(
      queryRef.current,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
}
