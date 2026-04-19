
'use client';

import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
      
      addDoc(visitsRef, {
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        path: window.location.pathname,
      }).then(() => {
        sessionStorage.setItem('site_visit_tracked', 'true');
      }).catch((err) => {
        // Silenciosamente falha em caso de erro (ex: regras de segurança)
        console.error("Erro ao registrar visita:", err);
      });
    }
  }, [firestore]);

  return null;
}
