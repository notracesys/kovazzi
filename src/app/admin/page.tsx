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
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Eye, TrendingUp, Activity } from 'lucide-react';
import { format, isSameDay, startOfWeek, addDays } from 'date-fns';
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

  const visitsQuery = useMemoFirebase(() => collection(firestore, 'visits'), [firestore]);
  const { data: visitsData, isLoading } = useCollection(visitsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weeklyData = useMemo(() => {
    if (!visitsData) return [];

    const days = [];
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Começa na Segunda

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(start, i);
      const count = visitsData.filter(visit => {
        if (!visit.timestamp) return false;
        const visitDate = visit.timestamp.toDate ? visit.timestamp.toDate() : new Date(visit.timestamp);
        return isSameDay(visitDate, currentDay);
      }).length;

      days.push({
        name: format(currentDay, 'EEEEEE', { locale: ptBR }).replace('.', '').toUpperCase(),
        fullName: format(currentDay, 'EEEE', { locale: ptBR }),
        visits: count,
        isToday: isSameDay(currentDay, today)
      });
    }
    return days;
  }, [visitsData]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-grow container mx-auto px-2 md:px-4 py-6 md:py-10">
        <div className="flex flex-col gap-6 animate-in fade-in duration-700 max-w-full">
          <div className="space-y-1 px-2">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              Painel de Controle
              <Activity className="h-5 w-5 text-primary animate-pulse" />
            </h1>
            <p className="text-xs md:text-base text-muted-foreground">Monitoramento real de tráfego e engajamento.</p>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {/* Card de Total de Visitas */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm lg:col-span-1 shadow-xl mx-2 md:mx-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4">
                <CardTitle className="text-[10px] md:text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  Total de Visitas
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                </CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="px-4 pb-6">
                <div className="text-3xl md:text-5xl font-black text-primary tracking-tighter">
                  {isLoading ? (
                    <span className="animate-pulse opacity-50">...</span>
                  ) : (
                    (visitsData?.length || 0).toLocaleString('pt-BR')
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-[9px] md:text-xs text-muted-foreground font-medium">Conectado ao banco de dados real</p>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico Semanal */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm lg:col-span-2 shadow-xl mx-2 md:mx-0">
              <CardHeader className="px-4">
                <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Tráfego da Semana
                </CardTitle>
                <CardDescription className="text-[10px] md:text-sm">Acessos únicos por dia da semana atual.</CardDescription>
              </CardHeader>
              <CardContent className="h-[220px] md:h-[300px] px-0">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={weeklyData} 
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#666" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        interval={0}
                        tick={{ fill: '#888', fontWeight: 500 }}
                      />
                      <YAxis 
                        stroke="#666" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar 
                        dataKey="visits" 
                        radius={[4, 4, 0, 0]} 
                        barSize={24}
                      >
                        {weeklyData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isToday ? 'hsl(var(--primary))' : 'rgba(255, 204, 0, 0.2)'} 
                          />
                        ))}
                      </Bar>
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