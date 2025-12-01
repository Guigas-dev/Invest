'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PortfolioAllocationChart from './_components/portfolio-allocation-chart';
import PortfolioEvolutionChart from './_components/portfolio-evolution-chart';
import { mockSnapshots, mockBenchmarkData } from '@/lib/data';
import PerformanceComparisonChart from './_components/performance-comparison-chart';
import { useCollection, useFirebaseApp, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Investment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const investmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'investments');
  }, [user, firestore]);

  const { data: investments, isLoading } = useCollection<Investment>(investmentsQuery);

  const { totalValue, totalInvested, profitability, profitabilityPercentage, totalAssets } = useMemo(() => {
    if (!investments) {
      return { totalValue: 0, totalInvested: 0, profitability: 0, profitabilityPercentage: 0, totalAssets: 0 };
    }

    const totalValue = investments.reduce(
      (acc, inv) => acc + (inv.currentPrice ?? inv.purchasePrice) * inv.quantity,
      0
    );
    const totalInvested = investments.reduce(
      (acc, inv) => acc + inv.purchasePrice * inv.quantity,
      0
    );
    const profitability = totalValue - totalInvested;
    const profitabilityPercentage = totalInvested > 0 ? (profitability / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, profitability, profitabilityPercentage, totalAssets: investments.length };
  }, [investments]);

  if (isLoading) {
    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-3/4" />
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-3 w-1/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full" />
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
             </div>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
             </Card>
        </div>
    )
  }


  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Total</CardDescription>
            <CardTitle className="text-4xl">
              {totalValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Patrimônio atualizado
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rentabilidade</CardDescription>
            <CardTitle
              className={`text-4xl ${
                profitability >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {profitability.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-xs ${
                profitability >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {profitabilityPercentage.toFixed(2)}% de rendimento total
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ativos na Carteira</CardDescription>
            <CardTitle className="text-4xl">{totalAssets}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Total de ativos cadastrados
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Perfil de Risco (IA)</CardDescription>
            <CardTitle className="text-4xl">Moderado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Análise baseada na sua carteira
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Evolução da Carteira</CardTitle>
            <CardDescription>
              Acompanhe o crescimento do seu patrimônio ao longo do tempo.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PortfolioEvolutionChart data={mockSnapshots} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alocação de Ativos</CardTitle>
            <CardDescription>
              Veja a distribuição da sua carteira por tipo de ativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {investments && investments.length > 0 ? (
                <PortfolioAllocationChart data={investments} />
            ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    <p>Sem dados de alocação para exibir.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      <PerformanceComparisonChart data={mockBenchmarkData} />
    </div>
  );
}
