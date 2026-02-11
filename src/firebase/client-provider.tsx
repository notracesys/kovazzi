'use client';

import { useState, useEffect } from 'react';
import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const { app, auth, firestore } = initializeFirebase();
    setInstances({ app, auth, firestore });
  }, []);

  if (!instances) {
    // You can return a loader here if you'd like
    return null;
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
