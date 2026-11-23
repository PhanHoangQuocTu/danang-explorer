import { Suspense } from 'react';

import { MainLayout } from '@/components/layouts';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';

import { loadTravelDataset } from '../Travel/loadTravelDataset';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { ExploreView } from './ExploreView';

export const ExploreContent = async ({ t, locale, query }: TravelViewProps & { query: URLSearchParams }) => {
  const result = await loadTravelDataset();
  return <ExploreView t={t} locale={locale} query={query} dataset={result.ok ? result.dataset : null} />;
};

export const Explore = async ({ locale, query }: { locale: Locale; query: URLSearchParams }) => {
  const { t } = await useTranslationsServer('travel', locale);
  return (
    <MainLayout>
      <Suspense key={query.toString()} fallback={<TravelState t={t} state='loading' />}>
        <ExploreContent t={t} locale={locale} query={query} />
      </Suspense>
    </MainLayout>
  );
};
