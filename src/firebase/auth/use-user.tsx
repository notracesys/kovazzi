'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

interface UseUser {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUser {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, loading, error };
}
