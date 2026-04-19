
'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Eye, TrendingUp } from 'lucide-react';
import { format, subDays, isSameDay, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const chartConfig = {
  visits: {
    label: "Visitas",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const firestore = useFirestore();

  // Busca a coleção de visitas reais do Firestore
  const visitsQuery = useMemoFirebase(() => collection(firestore, 'visits'), [firestore]);
  const { data: visitsData, isLoading } = useCollection(visitsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Processa os dados para o gráfico semanal
  const weeklyData = useMemo(() => {
    if (!visitsData) return [];

    const days = [];
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Começa na Segunda

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(start, i);
      const count = visitsData.filter(visit => {
        if (!visit.timestamp) return false;
        // Converte timestamp do Firestore para Date se necessário
        const visitDate = visit.timestamp.toDate ? visit.timestamp.toDate() : new Date(visit.timestamp);
        return isSameDay(visitDate, currentDay);
      }).length;

      days.push({
        name: format(currentDay, 'EEE', { locale: ptBR }),
        visits: count,
      });
    }
    return days;
  }, [visitsData]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Painel de Controle</h1>
            <p className="text-muted-foreground">Métricas reais de acesso ao site.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {/* Card de Total de Visitas */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total de Visitas</CardTitle>
                <Eye className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-primary">
                  {isLoading ? '...' : (visitsData?.length || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Acessos únicos registrados
                </p>
              </CardContent>
            </Card>

            {/* Gráfico Semanal */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Tráfego Semanal</CardTitle>
                <CardDescription>Visitas distribuídas pelos dias da semana atual.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="visits" 
                        fill="var(--color-visits)" 
                        radius={[4, 4, 0, 0]} 
                        className="hover:opacity-80 transition-opacity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
