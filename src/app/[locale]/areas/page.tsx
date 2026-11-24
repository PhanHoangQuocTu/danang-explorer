import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/constants/routes';
import { toLocale } from '@/i18n/routing';
import { getGuideCopy } from '@/lib/guide-seo';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { Areas } from '@/modules/Areas';

interface AreasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AreasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getGuideCopy(toLocale(locale), ROUTES.AREAS);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.AREAS,
    title: copy.title,
    description: copy.description,
  });
}

export default async function AreasPage({ params }: AreasPageProps) {
  const { locale } = await params;
  const currentLocale = toLocale(locale);
  const { title, description } = await getGuideCopy(currentLocale, ROUTES.AREAS);
  return (
    <>
      <JsonLd data={webPageJsonLd(currentLocale, ROUTES.AREAS, title, description)} />
      {await Areas({ locale: currentLocale })}
    </>
  );
}
