'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      console.error("Firebase Permission Error:", error);
      toast({
        variant: "destructive",
        title: "Erro de Permissão",
        description: error.message || "Você não tem permissão para realizar esta ação.",
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
