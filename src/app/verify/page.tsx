'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Loader2, Info, AlertTriangle, PartyPopper, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const accountIdSchema = z.object({
  accountId: z.string()
    .min(8, { message: 'O ID da conta deve ter entre 8 e 12 dígitos.' })
    .max(12, { message: 'O ID da conta deve ter entre 8 e 12 dígitos.' })
    .regex(/^\d+$/, { message: 'Insira apenas números.' }),
});

type AccountIdForm = z.infer<typeof accountIdSchema>;

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', description: '', isError: true });

  const form = useForm<AccountIdForm>({
    resolver: zodResolver(accountIdSchema),
    defaultValues: { accountId: '' },
  });

  const handleVerify = (values: AccountIdForm) => {
    if (isVerified) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };
  
  const onDialogClose = () => {
    setShowDialog(false);
  }

  const handleFormError = (errors: any) => {
    const accountIdError = errors.accountId?.message;
    if (accountIdError) {
        setDialogContent({
            title: 'ID Inválido',
            description: accountIdError,
            isError: true,
        });
        setShowDialog(true);
    }
  };


  return (
    <>
      <div className="flex min-h-full flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 justify-center">
                  {dialogContent.isError ? 
                    <AlertTriangle className="text-destructive" /> : 
                    <PartyPopper className="text-primary" />
                  }
                  {dialogContent.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={onDialogClose} className="bg-primary hover:bg-primary/90">
                  Tentar Novamente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="w-full max-w-2xl space-y-8 animate-in fade-in-50 duration-1000">
            <section className="text-center">
              <h1 className="font-headline text-3xl md:text-4xl font-bold">Verificar Conta</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Informe o ID da sua conta para dar o primeiro passo.
              </p>
            </section>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Identificação da Conta</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleVerify, handleFormError)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="accountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">ID do jogador</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="Insira o ID de jogador aqui" 
                                {...field} 
                                className={cn(
                                  "text-base", 
                                  isVerified && "border-green-500"
                                )} 
                                disabled={isVerified || isVerifying}
                              />
                            </FormControl>
                            <Button 
                              type="submit" 
                              className={cn(
                                "px-8 font-bold",
                                isVerified && "bg-green-500 hover:bg-green-600"
                              )}
                              disabled={isVerifying || isVerified}
                            >
                              {isVerifying ? (
                                <Loader2 className="animate-spin" />
                              ) : isVerified ? (
                                <ShieldCheck />
                              ) : 'Verificar'}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            {isVerified && (
              <Card className="w-full animate-in fade-in-50 duration-1000">
                <CardHeader>
                    <CardTitle>Conta Verificada!</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Tudo certo! Agora vamos para a análise detalhada do seu caso.</p>
                    <Button asChild size="lg" className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                       <Link href="/analysis">
                           Prosseguir para Análise
                           <ArrowRight className="ml-2 h-5 w-5" />
                       </Link>
                    </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
