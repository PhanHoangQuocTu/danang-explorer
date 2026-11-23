import { Suspense } from 'react';

import { MainLayout } from '@/components/layouts';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';

import { loadTravelDataset } from '../Travel/loadTravelDataset';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { InsightsView } from './InsightsView';
import { getInsightsMetrics } from './metrics';

export const InsightsContent = async ({ t, locale }: TravelViewProps) => {
  const result = await loadTravelDataset();
  const metrics = result.ok ? getInsightsMetrics(result.dataset.listings, result.dataset.areas) : null;
  return <InsightsView t={t} locale={locale} metrics={metrics} />;
};

export const Insights = async ({ locale }: { locale: Locale }) => {
  const { t } = await useTranslationsServer('travel', locale);
  return (
    <MainLayout showTravelRefresh>
      <Suspense fallback={<TravelState t={t} state='loading' />}>
        <InsightsContent t={t} locale={locale} />
      </Suspense>
    </MainLayout>
  );
};
