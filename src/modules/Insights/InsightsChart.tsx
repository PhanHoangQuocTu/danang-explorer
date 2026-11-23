'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Locale } from '@/i18n/routing';

export interface InsightsChartRow {
  id: string;
  label: string;
  count: number;
}

interface InsightsChartProps {
  rows: InsightsChartRow[];
  layout: 'horizontal' | 'vertical';
  countLabel: string;
  locale: Locale;
}

const axisTick = { fill: 'var(--muted-foreground)' };

export const InsightsChart = ({ rows, layout, countLabel, locale }: InsightsChartProps) => {
  const barsRunHorizontally = layout === 'vertical';
  const config = { count: { label: countLabel, color: 'var(--chart-2)' } } satisfies ChartConfig;
  const number = new Intl.NumberFormat(locale);
  const height = barsRunHorizontally ? rows.length * 28 + 34 : 192;

  return (
    <ChartContainer aria-hidden='true' config={config} className='aspect-auto w-full min-w-0' style={{ height }}>
      <BarChart
        data={rows}
        layout={layout}
        margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
        accessibilityLayer={false}
      >
        <CartesianGrid horizontal={!barsRunHorizontally} vertical={barsRunHorizontally} />
        {barsRunHorizontally ? (
          <XAxis
            type='number'
            dataKey='count'
            allowDecimals={false}
            tick={axisTick}
            tickFormatter={(value: number) => number.format(value)}
          />
        ) : (
          <XAxis type='category' dataKey='label' interval={0} tick={axisTick} tickLine={false} />
        )}
        {barsRunHorizontally ? (
          <YAxis
            type='category'
            dataKey='label'
            width={144}
            interval={0}
            axisLine={false}
            tick={axisTick}
            tickLine={false}
          />
        ) : (
          <YAxis
            type='number'
            width={34}
            allowDecimals={false}
            tick={axisTick}
            tickFormatter={(value: number) => number.format(value)}
          />
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className='tabular-nums'>
                  {countLabel} {typeof value === 'number' ? number.format(value) : value}
                </span>
              )}
            />
          }
        />
        <Bar dataKey='count' fill='var(--color-count)' radius={3} maxBarSize={36} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
};
