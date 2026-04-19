'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Activity
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis
} from 'recharts';

// Dados simulados para o gráfico de visitas
const chartData = [
  { name: 'Seg', visits: 420 },
  { name: 'Ter', visits: 380 },
  { name: 'Qua', visits: 510 },
  { name: 'Qui', visits: 450 },
  { name: 'Sex', visits: 680 },
  { name: 'Sáb', visits: 890 },
  { name: 'Dom', visits: 720 },
];

const chartConfig = {
  visits: {
    label: "Visitas",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    visits: 4281,
    active: 0,
    conversion: '4.8%',
    revenue: 'R$ 3.820,00'
  });

  // Efeito para simular usuários ativos mudando em tempo real
  useEffect(() => {
    // Valor inicial
    setStats(prev => ({ ...prev, active: Math.floor(Math.random() * (65 - 35 + 1)) + 35 }));

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        active: Math.floor(Math.random() * (70 - 30 + 1)) + 30
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Administrativo</h1>
              <p className="text-muted-foreground">Visão geral do desempenho da Unban Strategy.</p>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-primary/20">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Sistema Operacional</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Visitas</CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.visits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 inline-flex items-center font-bold">
                    +18% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span> desde o último mês
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Navegando Agora</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Monitoramento em tempo real
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversion}</div>
                <p className="text-xs text-muted-foreground mt-1">
                   <span className="text-red-500 inline-flex items-center font-bold">
                    -0.5% <ArrowDownRight className="h-3 w-3 ml-1" />
                  </span> vs média da semana
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Receita Estimada</CardTitle>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.revenue}</div>
                <p className="text-xs text-muted-foreground mt-1">Estimativa de checkouts aprovados</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-primary/10 bg-card/30">
              <CardHeader>
                <CardTitle>Acessos por Dia</CardTitle>
                <CardDescription>Tráfego de visitantes nos últimos 7 dias.</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[350px] w-full">
                   <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#888888" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `${value}`} 
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
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 border-primary/10 bg-card/30">
              <CardHeader>
                <CardTitle>Acessos Recentes</CardTitle>
                <CardDescription>Origem e dispositivo dos últimos visitantes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { location: 'São Paulo, BR', time: 'Agora', device: 'Mobile - TikTok' },
                    { location: 'Rio de Janeiro, BR', time: '3 min atrás', device: 'Mobile - Instagram' },
                    { location: 'Lisboa, PT', time: '8 min atrás', device: 'Desktop - Direto' },
                    { location: 'Belo Horizonte, BR', time: '12 min atrás', device: 'Mobile - Facebook' },
                    { location: 'Curitiba, BR', time: '20 min atrás', device: 'Mobile - TikTok' },
                    { location: 'Fortaleza, BR', time: '25 min atrás', device: 'Mobile - Google' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-primary/5 pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{item.location}</p>
                        <p className="text-xs text-muted-foreground">{item.device}</p>
                      </div>
                      <div className="text-xs font-medium text-primary/80 bg-primary/5 px-2 py-1 rounded">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
