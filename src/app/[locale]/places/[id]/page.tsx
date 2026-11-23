import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata, getRobots } from '@/lib/seo';
import { PlaceDetail } from '@/modules/PlaceDetail';
import { resolvePlace } from '@/modules/PlaceDetail/resolvePlace';
import { getCanonicalAreaName } from '@/modules/Travel/catalog';
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
  const category = t(`categories.${listing.mainCategory}`);
  const area = getCanonicalAreaName(listing);
  const description = area
    ? t('detail.metaWithArea', { name: listing.name, category, area })
    : t('detail.meta', { name: listing.name, category });

  return buildMetadata({ locale, path: placeHref(listing.id), title: listing.name, description });
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { locale: localeParam, id } = await params;
  const locale = toLocale(localeParam);
  const result = await resolvePlace(id);
  if (result.kind === 'not-found') notFound();

  const { t } = await useTranslationsServer('travel', locale);
  return <PlaceDetail t={t} locale={locale} listing={result.kind === 'found' ? result.listing : null} />;
}
