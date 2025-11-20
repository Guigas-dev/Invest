import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import PortfolioAllocationChart from './_components/portfolio-allocation-chart';
import PortfolioEvolutionChart from './_components/portfolio-evolution-chart';
import { mockInvestments, mockSnapshots } from '@/lib/data';

export default function DashboardPage() {
  const totalValue = mockInvestments.reduce(
    (acc, inv) => acc + inv.currentPrice * inv.quantity,
    0
  );
  const totalInvested = mockInvestments.reduce(
    (acc, inv) => acc + inv.purchasePrice * inv.quantity,
    0
  );
  const profitability = totalValue - totalInvested;
  const profitabilityPercentage = (profitability / totalInvested) * 100;

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
              +25% em relação ao mês passado
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
            <CardTitle className="text-4xl">{mockInvestments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +2 adicionados este mês
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
            <PortfolioAllocationChart data={mockInvestments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
