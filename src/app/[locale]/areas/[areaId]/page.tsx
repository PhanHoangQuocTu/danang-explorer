import type { Metadata } from 'next';

import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata, getRobots } from '@/lib/seo';
import { AreaDetail } from '@/modules/Areas';
import { resolveArea } from '@/modules/Areas/areas';
import { areaHref } from '@/modules/Travel/navigation';

interface AreaPageProps {
  params: Promise<{ locale: string; areaId: string }>;
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { locale: localeParam, areaId } = await params;
  const locale = toLocale(localeParam);
  const result = await resolveArea(areaId);
  if (result.kind === 'not-found') {
    const { t } = await useTranslationsServer('common.notFound', locale);
    return { title: t('title'), robots: getRobots(true) };
  }

  const { t } = await useTranslationsServer('travel', locale);
  if (result.kind === 'source-error') {
    return { title: t('state.error'), description: t('state.errorHint'), robots: getRobots(true) };
  }

  const { area } = result;
  return buildMetadata({
    locale,
    path: areaHref(area.areaId),
    title: area.areaName,
    description: t('areas.detailMeta', { area: area.areaName }),
  });
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { locale, areaId } = await params;
  return AreaDetail({ locale: toLocale(locale), areaId });
}
