
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redireciona usuários da rota antiga /admin para /portaldochefe
 */
export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/portaldochefe');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Redirecionando para o Portal do Chefe...</p>
      </div>
    </div>
  );
}
