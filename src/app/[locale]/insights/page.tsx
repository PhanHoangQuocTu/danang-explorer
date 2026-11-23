import type { Metadata } from 'next';

import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { Insights } from '@/modules/Insights';

interface InsightsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: InsightsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await useTranslationsServer('travel.insights', locale);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.INSIGHTS,
    title: t('title'),
    description: t('description'),
  });
}

export default async function InsightsPage({ params }: InsightsPageProps) {
  const { locale } = await params;
  return <Insights locale={toLocale(locale)} />;
}
