import { notFound } from 'next/navigation';

import { MainLayout } from '@/components/layouts';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';

import { loadTravelDataset } from '../Travel/loadTravelDataset';
import { TravelState } from '../Travel/TravelState';
import { hasCanonicalAreaMetadata, resolveArea } from './areas';
import { AreasView } from './AreasView';

export const Areas = async ({ locale }: { locale: Locale }) => {
  const [{ t }, result] = await Promise.all([useTranslationsServer('travel', locale), loadTravelDataset()]);
  const dataset = result.ok && hasCanonicalAreaMetadata(result.dataset.areas) ? result.dataset : null;
  return (
    <MainLayout>
      <AreasView t={t} locale={locale} mode='index' dataset={dataset} />
    </MainLayout>
  );
};

export const AreaDetail = async ({ locale, areaId }: { locale: Locale; areaId: string }) => {
  const result = await resolveArea(areaId);
  if (result.kind === 'not-found') notFound();
  const { t } = await useTranslationsServer('travel', locale);
  return (
    <MainLayout>
      {result.kind === 'found' ? (
        <AreasView t={t} locale={locale} mode='detail' area={result.area} listings={result.listings} />
      ) : (
        <div className='space-y-6'>
          <h1 className='font-[family-name:Times_New_Roman,Times,serif] text-4xl tracking-tight sm:text-5xl'>
            {t('areas.title')}
          </h1>
          <TravelState t={t} state='error' />
        </div>
      )}
    </MainLayout>
  );
};
