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

const recoveryOptions = [
    { name: 'Google', icon: Mail, href: 'https://chk.eduzz.com/39ZQX63Z9E' },
    { name: 'Facebook', icon: Facebook, href: 'https://chk.eduzz.com/60EEXPY303' },
    { name: 'Convidado', icon: User, href: null },
    { name: 'Twitter', icon: Twitter, href: null },
    { name: 'VK', icon: MessageSquare, href: null },
];

export default function RecuperarPage() {
  const [agreed, setAgreed] = useState(false);

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
                                        <DialogTitle>Termos de Responsabilidade e Condições</DialogTitle>
                                        <DialogDescription>
                                            Leia atentamente antes de prosseguir.
                                        </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="h-72 w-full rounded-md border p-4">
                                            <p className="text-sm text-foreground/80 space-y-4">
                                                <span className="block font-bold text-foreground">Fica expressamente reconhecido que o CONTRATADO não garante, promete ou assegura a reversão, desbloqueio, recuperação ou restabelecimento de contas, itens virtuais, progressos, patentes ou quaisquer ativos digitais, uma vez que a decisão final e soberana compete exclusivamente à plataforma responsável pelo jogo.</span>
                                                <span className="block">O presente site tem por objeto a prestação de serviços independentes de análise técnica, orientação e suporte informacional, voltados exclusivamente à contestação administrativa de banimentos aplicados em contas de jogos online.</span>
                                                <span className="block">O CONTRATANTE declara ciência inequívoca de que o CONTRATADO não possui, mantém ou alega possuir qualquer vínculo, parceria, autorização, representação, afiliação ou relação comercial com a empresa Garena, com o jogo Free Fire ou com quaisquer de suas controladoras, coligadas ou subsidiárias, sendo todas as marcas mencionadas de propriedade exclusiva de seus respectivos titulares.</span>
                                                <span className="block">O CONTRATADO não realiza, em nenhuma hipótese, acesso direto ou indireto, autorizado ou não, a sistemas internos, servidores, bancos de dados, códigos-fonte ou mecanismos de segurança de terceiros. Os serviços prestados limitam-se à análise das informações fornecidas pelo CONTRATANTE, organização de dados e orientação quanto a procedimentos formais de solicitação de revisão, sempre em conformidade com os termos de uso da plataforma.</span>
                                                <span className="block">O CONTRATANTE declara que todas as informações fornecidas são verdadeiras, assumindo integral responsabilidade por eventuais inconsistências, omissões ou declarações inverídicas que possam comprometer o resultado do procedimento.</span>
                                                <span className="block">O CONTRATADO não se responsabiliza por danos diretos, indiretos, incidentais, consequenciais, lucros cessantes ou perda de chance decorrentes de decisões adotadas pela plataforma do jogo, tampouco por suspensões, banimentos adicionais ou definitivos.</span>
                                                <span className="block">Este site não incentiva, apoia, promove ou compactua com o uso de trapaças, programas ilegais, hacks, exploits, engenharia reversa ou qualquer prática que viole os termos de uso, políticas internas ou legislação vigente.</span>
                                                <span className="block">Ao utilizar este site ou contratar quaisquer serviços nele oferecidos, o CONTRATANTE declara ter lido, compreendido e concordado integralmente com os presentes termos, que possuem caráter vinculante e irrevogável.</span>
                                            </p>
                                        </ScrollArea>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id={`terms-${option.name}`} checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                                            <Label htmlFor={`terms-${option.name}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Li e concordo com os termos e quero prosseguir.
                                            </Label>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary" size="sm">
                                                Cancelar
                                                </Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button asChild disabled={!agreed} size="sm" className={cn("mb-2 sm:mb-0", !agreed && "cursor-not-allowed")}>
                                                    <Link href={option.href!} target="_blank">
                                                        Prosseguir
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
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
