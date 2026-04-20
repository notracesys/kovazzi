
'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { useFirestore, useCollection, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Eye, TrendingUp, Activity, ShoppingCart, Lock, LogIn, Loader2, LogOut } from 'lucide-react';
import { format, isSameDay, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const chartConfig = {
  visits: {
    label: "Visitas",
    color: "hsl(var(--primary))",
  },
};

export default function PortalDoChefe() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const visitsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'visits');
  }, [firestore, user]);
  
  const { data: visitsData, isLoading: visitsLoading } = useCollection(visitsQuery);

  const clicksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'checkoutClicks');
  }, [firestore, user]);
  
  const { data: clicksData, isLoading: clicksLoading } = useCollection(clicksQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weeklyData = useMemo(() => {
    if (!visitsData) return [];

    const days = [];
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(start, i);
      const count = visitsData.filter(visit => {
        if (!visit.timestamp) return false;
        const visitDate = visit.timestamp.toDate ? visit.timestamp.toDate() : new Date(visit.timestamp);
        return isSameDay(visitDate, currentDay);
      }).length;

      // Garante 3 letras exatas: SE, TE, QU, QU, SE, SA, DO ou SEG, TER, QUA...
      const dayName = format(currentDay, 'EEE', { locale: ptBR })
        .replace('.', '')
        .slice(0, 3)
        .toUpperCase();

      days.push({
        name: dayName,
        visits: count,
        isToday: isSameDay(currentDay, today)
      });
    }
    return days;
  }, [visitsData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Bem-vindo de volta!",
        description: "Acesso autorizado ao Portal do Chefe.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Falha na autenticação",
        description: "E-mail ou senha incorretos.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: "Sessão encerrada",
      description: "Você saiu do Portal do Chefe.",
    });
  };

  if (!mounted) return null;

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Portal do Chefe</CardTitle>
              <p className="text-sm text-muted-foreground">Identifique-se para acessar as métricas.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@exemplo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full font-bold" disabled={isLoggingIn}>
                  {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                  Entrar no Portal
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                Portal do Chefe
                <Activity className="h-6 w-6 text-primary animate-pulse" />
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">Logado como: <span className="text-foreground font-medium">{user.email}</span></p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-fit border-primary/20 hover:bg-primary/10">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Visitas (Real)</p>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
                  {visitsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (visitsData?.length || 0).toLocaleString('pt-BR')}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Acessos únicos registrados</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Intenção de Compra</p>
                <ShoppingCart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
                  {clicksLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (clicksData?.length || 0).toLocaleString('pt-BR')}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Cliques no botão de checkout</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Conversão Checkout</p>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
                  {(!visitsData?.length || !clicksData?.length) ? '0%' : 
                    `${((clicksData.length / visitsData.length) * 100).toFixed(1)}%`
                  }
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Visitas vs Cliques no Botão</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Tráfego Semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] md:h-[350px] pt-4 px-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      interval={0}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                      allowDecimals={false} 
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="visits" radius={[4, 4, 0, 0]} barSize={32}>
                      {weeklyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isToday ? 'hsl(var(--primary))' : 'rgba(255, 204, 0, 0.15)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
