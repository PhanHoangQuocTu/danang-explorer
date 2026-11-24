import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/constants/routes';
import { toLocale } from '@/i18n/routing';
import { getGuideCopy } from '@/lib/guide-seo';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { Insights } from '@/modules/Insights';

interface InsightsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: InsightsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getGuideCopy(toLocale(locale), ROUTES.INSIGHTS);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.INSIGHTS,
    title: copy.title,
    description: copy.description,
  });
}

export default async function InsightsPage({ params }: InsightsPageProps) {
  const { locale } = await params;
  const currentLocale = toLocale(locale);
  const { title, description } = await getGuideCopy(currentLocale, ROUTES.INSIGHTS);
  return (
    <>
      <JsonLd data={webPageJsonLd(currentLocale, ROUTES.INSIGHTS, title, description)} />
      <Insights locale={currentLocale} />
    </>
  );
}
