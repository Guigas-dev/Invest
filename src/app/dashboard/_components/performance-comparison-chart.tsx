'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BenchmarkData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceComparisonChartProps {
  data: BenchmarkData[];
}

const chartConfig = {
  portfolio: {
    label: 'Carteira',
    color: 'hsl(var(--chart-1))',
  },
  cdi: {
    label: 'CDI',
    color: 'hsl(var(--chart-2))',
  },
  ibovespa: {
    label: 'Ibovespa',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const PerformanceComparisonChart: React.FC<PerformanceComparisonChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rentabilidade vs. Benchmarks</CardTitle>
        <CardDescription>
          Compare a performance da sua carteira com CDI e Ibovespa (base 100).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 24,
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
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="portfolio"
              type="monotone"
              stroke="var(--color-portfolio)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="cdi"
              type="monotone"
              stroke="var(--color-cdi)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="ibovespa"
              type="monotone"
              stroke="var(--color-ibovespa)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparisonChart;
