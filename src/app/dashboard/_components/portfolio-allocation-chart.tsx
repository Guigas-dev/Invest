'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Sector } from 'recharts';
import * as React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Investment } from '@/lib/types';

interface PortfolioAllocationChartProps {
  data: Investment[];
}

const PortfolioAllocationChart: React.FC<PortfolioAllocationChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const allocationData = React.useMemo(() => {
    const allocation = data.reduce((acc, investment) => {
      const value = investment.currentPrice * investment.quantity;
      if (!acc[investment.type]) {
        acc[investment.type] = { name: investment.type, value: 0, fill: '' };
      }
      acc[investment.type].value += value;
      return acc;
    }, {} as { [key: string]: { name: string; value: number; fill: string } });

    const chartColors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    return Object.values(allocation).map((item, index) => ({
      ...item,
      fill: chartColors[index % chartColors.length],
    }));
  }, [data]);
  
  const totalValue = React.useMemo(() => {
    return allocationData.reduce((acc, curr) => acc + curr.value, 0);
  }, [allocationData]);


  return (
    <ChartContainer config={{}} className="mx-auto aspect-square h-[300px]">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={allocationData}
          dataKey="value"
          nameKey="name"
          innerRadius={80}
          outerRadius={110}
          activeIndex={activeIndex}
          activeShape={({
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
          }) => (
            <g>
              <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--foreground))" className="text-2xl font-bold">
                {payload.name}
              </text>
              <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--muted-foreground))">
                {((payload.value / totalValue) * 100).toFixed(1)}%
              </text>
              <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
              />
            </g>
          )}
          onMouseEnter={(_, index) => setActiveIndex(index)}
        />
      </PieChart>
    </ChartContainer>
  );
};

export default PortfolioAllocationChart;
