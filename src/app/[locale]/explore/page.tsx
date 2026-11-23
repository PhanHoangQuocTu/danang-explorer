import type { Metadata } from 'next';

import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { Explore } from '@/modules/Explore';

interface ExplorePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: ExplorePageProps): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const { t } = await useTranslationsServer('travel.explore', locale);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.EXPLORE,
    title: t('title'),
    description: t('description'),
    noIndex: Object.keys(query).length > 0,
  });
}

export default async function ExplorePage({ params, searchParams }: ExplorePageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const entries = Object.entries(query).flatMap(([key, value]) =>
    value === undefined ? [] : [value].flat().map((item): [string, string] => [key, item])
  );
  return <Explore locale={toLocale(locale)} query={new URLSearchParams(entries)} />;
}
