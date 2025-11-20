'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { PortfolioSnapshot } from '@/lib/types';

interface PortfolioEvolutionChartProps {
  data: PortfolioSnapshot[];
}

const chartConfig = {
  totalValue: {
    label: 'Valor Total (R$)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const PortfolioEvolutionChart: React.FC<PortfolioEvolutionChartProps> = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `R$${value / 1000}k`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="totalValue"
          type="natural"
          fill="var(--color-totalValue)"
          fillOpacity={0.4}
          stroke="var(--color-totalValue)"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default PortfolioEvolutionChart;
