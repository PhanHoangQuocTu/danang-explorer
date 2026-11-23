import type { Metadata } from 'next';

import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { toLocale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';
import { Home } from '@/modules/Home';
import type { PageProps } from '@/types/type';

type HomePageProps = Pick<PageProps<{ locale: string }>, 'params'>;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await useTranslationsServer('travel.home', locale);

  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.HOME,
    title: { absolute: t('title') },
    description: t('description'),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  return <Home locale={toLocale(locale)} />;
}
