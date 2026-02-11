'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseContext.Provider value={props}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = (): FirebaseApp => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebaseApp must be used within a FirebaseProvider.');
  return context.app;
};

export const useAuth = (): Auth => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useAuth must be used within a FirebaseProvider.');
  return context.auth;
};

export const useFirestore = (): Firestore => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirestore must be used within a FirebaseProvider.');
  return context.firestore;
};
