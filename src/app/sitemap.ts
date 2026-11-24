import type { MetadataRoute } from 'next';

import { isProductionEnv } from '@/constants/env';
import { INDEXABLE_ROUTES } from '@/constants/routes';
import { routing } from '@/i18n/routing';
import { getAbsoluteUrl, getLanguageAlternates } from '@/lib/seo';
import { hasCanonicalAreaMetadata } from '@/modules/Areas/areas';
import { isPlaceId } from '@/modules/PlaceDetail/resolvePlace';
import { loadTravelDataset } from '@/modules/Travel/loadTravelDataset';
import { areaHref, placeHref } from '@/modules/Travel/navigation';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isProductionEnv) return [];
  const result = await loadTravelDataset();
  if (!result.ok || !hasCanonicalAreaMetadata(result.dataset.areas)) {
    throw new Error('The travel sitemap is temporarily unavailable.');
  }
  const routes = new Set([
    ...INDEXABLE_ROUTES,
    ...result.dataset.areas.map(({ areaId }) => areaHref(areaId)),
    ...result.dataset.listings.filter(({ id }) => isPlaceId(id)).map(({ id }) => placeHref(id)),
  ]);
  if (routes.size * routing.locales.length > 50_000) throw new Error('The travel sitemap exceeds the URL limit.');
  return [...routes].flatMap((route) =>
    routing.locales.map((locale) => ({
      url: getAbsoluteUrl(locale, route),
      alternates: { languages: getLanguageAlternates(route) },
    }))
  );
}
