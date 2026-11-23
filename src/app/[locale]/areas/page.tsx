import type { Metadata } from 'next';

import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { Areas } from '@/modules/Areas';

interface AreasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AreasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await useTranslationsServer('travel.areas', locale);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.AREAS,
    title: t('title'),
    description: t('description'),
  });
}

export default async function AreasPage({ params }: AreasPageProps) {
  const { locale } = await params;
  return Areas({ locale: toLocale(locale) });
}
