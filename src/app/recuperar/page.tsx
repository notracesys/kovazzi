
'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Facebook, Twitter, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const recoveryOptions = [
    { name: 'Google', icon: Mail, href: 'https://chk.eduzz.com/39ZQX63Z9E' },
    { name: 'Facebook', icon: Facebook, href: 'https://chk.eduzz.com/60EEXPY303' },
    { name: 'Convidado', icon: User, href: null },
    { name: 'Twitter', icon: Twitter, href: null },
    { name: 'VK', icon: MessageSquare, href: null },
];

export default function RecuperarPage() {
  const [agreed, setAgreed] = useState(false);
  const firestore = useFirestore();

  const handleTrackCheckout = (url: string) => {
    if (!firestore) return;
    addDoc(collection(firestore, 'checkoutClicks'), {
      timestamp: serverTimestamp(),
      source: 'recuperar-vincular',
      url: url
    });
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-8 animate-in fade-in-50 duration-1000">
            <section className="text-center">
              <h1 className="font-headline text-3xl md:text-4xl font-bold">Recuperar Acesso</h1>
              <p className="mt-2 text-lg text-muted-foreground">Selecione a forma como sua conta estava conectada para iniciar a recuperação.</p>
            </section>
            
            <Card>
                <CardHeader>
                    <CardTitle>Qual o meio de vínculo da sua conta?</CardTitle>
                    <CardDescription>Clique na opção correspondente para iniciar o processo de recuperação.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    {recoveryOptions.map((option) => {
                        const Icon = option.icon;
                        const isAvailable = !!option.href;
                        if (isAvailable) {
                            return (
                                <Dialog key={option.name} onOpenChange={(open) => !open && setAgreed(false)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="lg" className="justify-start text-base">
                                            <Icon className="mr-3 h-5 w-5" />
                                            <span>{option.name}</span>
                                            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
                                        <DialogHeader>
                                        <DialogTitle>Termos de Responsabilidade</DialogTitle>
                                        <DialogDescription>Leia atentamente antes de prosseguir.</DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-72 w-full rounded-md border p-4">
                                            <div className="text-sm text-foreground/80 space-y-4">
                                                <p className="font-bold">Fica expressamente reconhecido que o CONTRATADO não garante a reversão de banimentos.</p>
                                                <p>O presente site presta serviços independentes de orientação e suporte técnico.</p>
                                                <p>Ao contratar, você declara ciência de que não temos vínculo com a Garena ou Free Fire.</p>
                                            </div>
                                        </ScrollArea>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id={`terms-${option.name}`} checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                                            <Label htmlFor={`terms-${option.name}`} className="text-sm font-medium">Li e concordo com os termos.</Label>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild><Button type="button" variant="secondary" size="sm">Cancelar</Button></DialogClose>
                                            <DialogClose asChild>
                                                <Button asChild disabled={!agreed} onClick={() => handleTrackCheckout(option.href!)} size="sm" className={cn("mb-2 sm:mb-0", !agreed && "cursor-not-allowed")}>
                                                    <Link href={option.href!} target="_blank">Prosseguir <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )
                        } else {
                            return (
                                <Button key={option.name} variant="outline" size="lg" className="justify-start text-base" disabled>
                                    <Icon className="mr-3 h-5 w-5" />
                                    <span>{option.name}</span>
                                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Em breve</span>
                                </Button>
                            )
                        }
                    })}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
