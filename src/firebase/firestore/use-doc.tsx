'use client';

import { doc, onSnapshot, DocumentReference } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';

export function useDoc<T>(ref: DocumentReference | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refRef = useRef(ref);

  useEffect(() => {
    if (!refRef.current) return;

    const unsubscribe = onSnapshot(
      refRef.current,
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = {
            id: snapshot.id,
            ...snapshot.data(),
          } as T;
          setData(docData);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
