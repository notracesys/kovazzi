'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Facebook, Twitter, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const recoveryOptions = [
    { name: 'Google', icon: Mail, href: 'https://chk.eduzz.com/39ZQX63Z9E' },
    { name: 'Facebook', icon: Facebook, href: 'https://chk.eduzz.com/60EEXPY303' },
    { name: 'Convidado', icon: User, href: null },
    { name: 'Twitter', icon: Twitter, href: null },
    { name: 'VK', icon: MessageSquare, href: null },
];

export default function RecuperarPage() {

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-8 animate-in fade-in-50 duration-1000">
            <section className="text-center">
              <h1 className="font-headline text-3xl md:text-4xl font-bold">Recuperar Acesso</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Selecione a forma como sua conta estava conectada para iniciar a recuperação.
              </p>
            </section>
            
            <Card>
                <CardHeader>
                    <CardTitle>Qual o meio de vínculo da sua conta?</CardTitle>
                    <CardDescription>
                        Clique na opção correspondente para iniciar o processo de recuperação. Para contas Google e Facebook, você será levado ao checkout do método. As demais opções de vínculo estarão disponíveis em breve.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    {recoveryOptions.map((option) => {
                        const Icon = option.icon;
                        const isAvailable = !!option.href;

                        if (isAvailable) {
                            return (
                                <Button asChild key={option.name} variant="outline" size="lg" className="justify-start text-base">
                                    <Link href={option.href!} target="_blank">
                                        <Icon className="mr-3 h-5 w-5" />
                                        <span>{option.name}</span>
                                        <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                                    </Link>
                                </Button>
                            )
                        } else {
                            return (
                                <Button key={option.name} variant="outline" size="lg" className="justify-start text-base" disabled>
                                    <Icon className="mr-3 h-5 w-5" />
                                    <span>{option.name}</span>
                                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Em breve
                                    </span>
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
