'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Loader2, Info, AlertTriangle, PartyPopper, ArrowRight, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
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
      <div className="flex min-h-full flex-col bg-background">
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

          <div className="w-full max-w-md space-y-8 animate-in fade-in-50 duration-1000">
            <section className="text-center space-y-2">
                <div className="inline-block bg-primary/10 p-3 rounded-full">
                    <UserCheck className="w-8 h-8 text-primary" />
                </div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary animate-text-pulse">Verifique sua Conta</h2>
              <p className="text-lg text-muted-foreground">
                Informe o ID da sua conta banida para dar o primeiro passo na recuperação.
              </p>
            </section>

             <div className="relative">
                <div className={cn(
                    "absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-red-600/50 transition-all duration-500",
                    isVerified ? "opacity-100 blur-md" : "opacity-0 blur-none",
                )}></div>
                <Card className="w-full relative overflow-hidden transition-all duration-500">
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                           <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">1</span> 
                           Identificação da Conta
                        </h3>
                         <p className="text-sm text-muted-foreground mt-1">
                            Use apenas o ID numérico do jogo.
                         </p>
                    </div>

                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleVerify, handleFormError)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="accountId"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex rounded-md shadow-sm bg-input border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                                <div className="pl-3 pr-2 flex items-center pointer-events-none">
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <FormControl>
                                <Input 
                                    placeholder="Insira o ID de jogador aqui" 
                                    {...field} 
                                    className="text-base border-0 bg-transparent h-12 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    disabled={isVerified || isVerifying}
                                />
                                </FormControl>
                                <div className="p-1.5">
                                    <Button 
                                        type="submit" 
                                        className={cn(
                                            "px-6 font-bold w-[120px] h-full",
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
                            </div>
                            <FormMessage className="pl-2" hidden={!form.formState.errors.accountId} />
                            </FormItem>
                        )}
                        />
                    </form>
                    </Form>
                </CardContent>
                </Card>
            </div>

            {isVerified && (
              <div className="relative animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/80 to-green-500/80 opacity-100 blur-lg animate-glow"></div>

                <Card className="w-full relative">
                    <CardContent className="p-6 text-center space-y-4">
                        <div className="inline-block bg-green-500/10 p-3 rounded-full">
                            <PartyPopper className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="font-bold text-xl">Conta Verificada!</h3>
                        <p className="text-muted-foreground">Tudo certo! Sua conta foi identificada. Agora vamos para a análise detalhada do seu caso.</p>
                        <Button asChild size="lg" className="w-full font-bold mt-4 bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shine before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
                        <Link href="/analysis">
                            Prosseguir para Análise
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        </Button>
                    </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
