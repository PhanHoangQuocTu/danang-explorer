import { Suspense } from 'react';

import { MainLayout } from '@/components/layouts';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';

import { loadTravelDataset } from '../Travel/loadTravelDataset';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import { HomeView } from './HomeView';

export const HomeContent = async ({ t, locale }: TravelViewProps) => {
  const result = await loadTravelDataset();
  return <HomeView t={t} locale={locale} dataset={result.ok ? result.dataset : null} />;
};

export const Home = async ({ locale }: { locale: Locale }) => {
  const { t } = await useTranslationsServer('travel', locale);
  return (
    <MainLayout showTravelRefresh>
      <Suspense fallback={<TravelState t={t} state='loading' />}>
        <HomeContent t={t} locale={locale} />
      </Suspense>
    </MainLayout>
  );
};
