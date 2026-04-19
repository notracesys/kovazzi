
'use client';

import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Componente invisível que registra uma visita no Firestore.
 * Usa sessionStorage para garantir que a visita seja contada apenas uma vez por sessão do navegador.
 */
export function VisitTracker() {
  const firestore = useFirestore();

  useEffect(() => {
    // Verifica se já rastreamos esta visita nesta sessão para evitar duplicatas ao atualizar a página
    const hasTracked = sessionStorage.getItem('site_visit_tracked');

    if (!hasTracked && firestore) {
      const visitsRef = collection(firestore, 'visits');
      
      const visitData = {
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        path: window.location.pathname,
      };

      addDoc(visitsRef, visitData)
        .then(() => {
          sessionStorage.setItem('site_visit_tracked', 'true');
        })
        .catch(async (err) => {
          // Emite um erro contextual para o listener global em vez de usar console.error
          const permissionError = new FirestorePermissionError({
            path: 'visits',
            operation: 'create',
            requestResourceData: visitData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  }, [firestore]);

  return null;
}
