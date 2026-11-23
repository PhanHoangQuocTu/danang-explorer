import type { Metadata } from 'next';

import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { TripIdeas } from '@/modules/TripIdeas';

interface TripIdeasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TripIdeasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await useTranslationsServer('travel.tripIdeas', locale);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.TRIP_IDEAS,
    title: t('title'),
    description: t('description'),
  });
}

export default async function TripIdeasPage({ params }: TripIdeasPageProps) {
  const { locale } = await params;
  return TripIdeas({ locale: toLocale(locale) });
}
