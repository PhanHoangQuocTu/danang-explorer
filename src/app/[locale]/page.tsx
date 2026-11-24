import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/constants/routes';
import { toLocale } from '@/i18n/routing';
import { getGuideCopy } from '@/lib/guide-seo';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { Home } from '@/modules/Home';
import type { PageProps } from '@/types/type';

type HomePageProps = Pick<PageProps<{ locale: string }>, 'params'>;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getGuideCopy(toLocale(locale), ROUTES.HOME);

  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.HOME,
    title: { absolute: copy.title },
    description: copy.description,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const currentLocale = toLocale(locale);
  const { title, description } = await getGuideCopy(currentLocale, ROUTES.HOME);
  return (
    <>
      <JsonLd data={webPageJsonLd(currentLocale, ROUTES.HOME, title, description)} />
      <Home locale={currentLocale} />
    </>
  );
}
