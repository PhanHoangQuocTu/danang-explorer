import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { getPlaceDescription } from '@/lib/guide-seo';
import { breadcrumbJsonLd, buildMetadata, getAbsoluteUrl, getRobots, placeJsonLd, webPageJsonLd } from '@/lib/seo';
import { PlaceDetail } from '@/modules/PlaceDetail';
import { resolvePlace } from '@/modules/PlaceDetail/resolvePlace';
import { placeHref } from '@/modules/Travel/navigation';

interface PlacePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { locale: localeParam, id } = await params;
  const locale = toLocale(localeParam);
  const result = await resolvePlace(id);
  const { t } = await useTranslationsServer('travel', locale);

  if (result.kind === 'not-found') {
    const { t: missing } = await useTranslationsServer('common.notFound', locale);
    return { title: missing('title'), robots: getRobots(true) };
  }
  if (result.kind === 'source-error') {
    return { title: t('state.error'), description: t('state.errorHint'), robots: getRobots(true) };
  }

  const { listing } = result;
  const description = getPlaceDescription(listing, t);
  return buildMetadata({ locale, path: placeHref(listing.id), title: listing.name, description });
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { locale: localeParam, id } = await params;
  const locale = toLocale(localeParam);
  const result = await resolvePlace(id);
  if (result.kind === 'not-found') notFound();

  const { t } = await useTranslationsServer('travel', locale);
  if (result.kind !== 'found') return <PlaceDetail t={t} locale={locale} listing={null} />;
  const { listing } = result;
  const path = placeHref(listing.id);
  const url = getAbsoluteUrl(locale, path);
  return (
    <>
      <JsonLd
        data={{
          ...webPageJsonLd(locale, path, listing.name, getPlaceDescription(listing, t)),
          mainEntity: placeJsonLd(url, listing),
          breadcrumb: breadcrumbJsonLd([
            { name: t('detail.home'), url: getAbsoluteUrl(locale) },
            { name: t('detail.explore'), url: getAbsoluteUrl(locale, ROUTES.EXPLORE) },
            { name: listing.name, url },
          ]),
        }}
      />
      <PlaceDetail t={t} locale={locale} listing={listing} />
    </>
  );
}
