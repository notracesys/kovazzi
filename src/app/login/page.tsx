'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import { useFirebaseApp } from '@/firebase';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.242,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const app = useFirebaseApp();

  const handleGoogleSignIn = async () => {
    if (!app) return;
    setIsLoading(true);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login bem-sucedido!',
        description: 'Você será redirecionado em breve.',
      });
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado.',
        description: error.message || 'Não foi possível fazer login com o Google.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm animate-in fade-in-50 duration-1000">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
            <CardDescription>Faça login para acessar o painel administrativo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button disabled={isLoading} onClick={handleGoogleSignIn} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {isLoading ? 'Entrando...' : 'Entrar com Google'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
