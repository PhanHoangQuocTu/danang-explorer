import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { toLocale } from '@/i18n/routing';
import { getExploreSeo } from '@/lib/guide-seo';
import { buildMetadata, webPageJsonLd } from '@/lib/seo';
import { Explore } from '@/modules/Explore';

interface ExplorePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: ExplorePageProps): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const currentLocale = toLocale(locale);
  return buildMetadata({ locale: currentLocale, ...(await getExploreSeo(currentLocale, query)), followLinks: true });
}

export default async function ExplorePage({ params, searchParams }: ExplorePageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const entries = Object.entries(query).flatMap(([key, value]) =>
    value === undefined ? [] : [value].flat().map((item): [string, string] => [key, item])
  );
  const currentLocale = toLocale(locale);
  const { path, title, description } = await getExploreSeo(currentLocale, query);
  return (
    <>
      <JsonLd data={webPageJsonLd(currentLocale, path, title, description)} />
      <Explore locale={currentLocale} query={new URLSearchParams(entries)} />
    </>
  );
}
