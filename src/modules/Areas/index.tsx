import { notFound } from 'next/navigation';

import { MainLayout } from '@/components/layouts';
import { JsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';
import { breadcrumbJsonLd, getAbsoluteUrl, webPageJsonLd } from '@/lib/seo';

import { loadTravelDataset } from '../Travel/loadTravelDataset';
import { areaHref } from '../Travel/navigation';
import { TravelState } from '../Travel/TravelState';
import { hasCanonicalAreaMetadata, resolveArea } from './areas';
import { AreasView } from './AreasView';

export const Areas = async ({ locale }: { locale: Locale }) => {
  const [{ t }, result] = await Promise.all([useTranslationsServer('travel', locale), loadTravelDataset()]);
  const dataset = result.ok && hasCanonicalAreaMetadata(result.dataset.areas) ? result.dataset : null;
  return (
    <MainLayout showTravelRefresh>
      <AreasView t={t} locale={locale} mode='index' dataset={dataset} />
    </MainLayout>
  );
};

export const AreaDetail = async ({ locale, areaId }: { locale: Locale; areaId: string }) => {
  const result = await resolveArea(areaId);
  if (result.kind === 'not-found') notFound();
  const { t } = await useTranslationsServer('travel', locale);
  return (
    <MainLayout showTravelRefresh>
      {result.kind === 'found' ? (
        <>
          <JsonLd
            data={{
              ...webPageJsonLd(
                locale,
                areaHref(result.area.areaId),
                result.area.areaName,
                result.area.description ?? undefined
              ),
              breadcrumb: breadcrumbJsonLd([
                { name: t('detail.home'), url: getAbsoluteUrl(locale) },
                { name: t('areas.title'), url: getAbsoluteUrl(locale, ROUTES.AREAS) },
                { name: result.area.areaName, url: getAbsoluteUrl(locale, areaHref(result.area.areaId)) },
              ]),
            }}
          />
          <AreasView t={t} locale={locale} mode='detail' area={result.area} listings={result.listings} />
        </>
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
