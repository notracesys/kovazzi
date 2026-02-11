'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import { Users, Eye, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// TODO: Replace this with your actual admin User ID (UID) from Firebase Authentication.
const ADMIN_UID = 'REPLACE_WITH_YOUR_FIREBASE_USER_ID';

const chartConfig = {
  visits: {
    label: 'Visitas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const staticLogsData = [
  { id: 'log_001', user: 'user_12345', action: 'Login', status: 'Success', timestamp: '2024-07-24 10:30:00' },
  { id: 'log_002', user: 'user_67890', action: 'Generate Prompt', status: 'Success', timestamp: '2024-07-24 10:32:15' },
  { id: 'log_003', user: 'user_54321', action: 'Verify ID', status: 'Failed', error: 'Invalid ID format', timestamp: '2024-07-24 10:35:45' },
  { id: 'log_004', user: 'user_11223', action: 'Page View: /analysis', status: 'Success', timestamp: '2024-07-24 10:38:20' },
  { id: 'log_005', user: 'user_44556', action: 'Submit Quiz', status: 'Success', timestamp: '2024-07-24 10:40:55' },
  { id: 'log_006', user: 'user_98765', action: 'Page View: /admin', status: 'Success', timestamp: '2024-07-24 10:41:30' },
  { id: 'log_007', user: 'user_12345', action: 'Logout', status: 'Success', timestamp: '2024-07-24 10:45:00' },
];

export default function AdminPage() {
  const { user, loading } = useUser();
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayVisits: 0, totalVisits: 0, errorLogs: 0 });

  useEffect(() => {
    setChartData([
        { date: '01/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
        { date: '02/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
        { date: '03/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
        { date: '04/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
        { date: '05/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
        { date: '06/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
        { date: '07/07', visits: Math.floor(Math.random() * (450 - 100 + 1)) + 100 },
    ]);
    setStats({
      todayVisits: 345,
      totalVisits: 12534,
      errorLogs: 12,
    });
  }, []);
  
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
        <Header />
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-2">
                <ShieldAlert className="h-12 w-12 text-destructive" />
                Acesso Negado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página. Por favor, faça login com uma conta de administrador.
              </p>
              <Button asChild className="mt-4">
                <Link href={user ? '/' : '/login'}>
                  {user ? 'Voltar para o Início' : 'Ir para o Login'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acessos Hoje</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayVisits}</div>
              <p className="text-xs text-muted-foreground">+10.2% desde ontem</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acessos Totais</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground">Total de acessos na plataforma</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Logs de Erro</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.errorLogs}</div>
              <p className="text-xs text-muted-foreground">Nas últimas 24 horas</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Visão Geral de Acessos (Últimos 7 dias)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
               <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="visits" fill="var(--color-visits)" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 text-sm p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staticLogsData.slice(0, 7).map((log) => (
                             <TableRow key={log.id}>
                                <TableCell>
                                    <div className="font-medium">{log.user}</div>
                                    <div className="hidden text-xs text-muted-foreground md:inline">
                                        {log.timestamp}
                                    </div>
                                </TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={log.status === 'Success' ? 'outline' : 'destructive'} className={cn(log.status === 'Success' && 'bg-green-500/20 border-transparent text-green-700 hover:bg-green-500/30 dark:text-green-400')}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
