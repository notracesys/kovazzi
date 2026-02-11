'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc, getDoc, DocumentReference, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface UseDocOptions {
    subscribe?: boolean;
}

export function useDoc<T>(
  ref: DocumentReference<DocumentData> | null,
  options: UseDocOptions = { subscribe: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (!options.subscribe) {
        getDoc(ref)
            .then(doc => {
                if (doc.exists()) {
                    setData({ ...doc.data(), id: doc.id } as T);
                } else {
                    setData(null);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
        return;
    }

    const unsubscribe = onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setData({ ...doc.data(), id: doc.id } as T);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (err) => {
        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [ref, options.subscribe]);

  return { data, loading, error };
}
