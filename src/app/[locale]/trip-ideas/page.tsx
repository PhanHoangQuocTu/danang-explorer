import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/constants/routes';
import { toLocale } from '@/i18n/routing';
import { getGuideCopy } from '@/lib/guide-seo';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { TripIdeas } from '@/modules/TripIdeas';

interface TripIdeasPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TripIdeasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = await getGuideCopy(toLocale(locale), ROUTES.TRIP_IDEAS);
  return buildMetadata({
    locale: toLocale(locale),
    path: ROUTES.TRIP_IDEAS,
    title: copy.title,
    description: copy.description,
  });
}

export default async function TripIdeasPage({ params }: TripIdeasPageProps) {
  const { locale } = await params;
  const currentLocale = toLocale(locale);
  const { title, description } = await getGuideCopy(currentLocale, ROUTES.TRIP_IDEAS);
  return (
    <>
      <JsonLd data={webPageJsonLd(currentLocale, ROUTES.TRIP_IDEAS, title, description)} />
      {await TripIdeas({ locale: currentLocale })}
    </>
  );
}
