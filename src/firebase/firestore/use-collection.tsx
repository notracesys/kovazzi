'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, getDocs, Query, DocumentData, collectionGroup, orderBy, limit, startAfter, endBefore, limitToLast, startAt } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface UseCollectionOptions {
    subscribe?: boolean;
}

export function useCollection<T>(
  q: Query<DocumentData> | null,
  options: UseCollectionOptions = { subscribe: true }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    if (!options.subscribe) {
        getDocs(q)
            .then(snapshot => {
                const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[];
                setData(docs);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
        return;
    }

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[];
        setData(docs);
        setLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: (q as any)._path?.canonical ?? 'unknown',
            operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [JSON.stringify(q), options.subscribe]);

  return { data, loading, error };
}
