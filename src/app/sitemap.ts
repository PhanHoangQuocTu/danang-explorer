import type { MetadataRoute } from 'next';

import { INDEXABLE_ROUTES } from '@/constants/routes';
import { routing } from '@/i18n/routing';
import { AREA_IDS } from '@/lib/travel-data/const';
import { getAbsoluteUrl, getLanguageAlternates } from '@/lib/seo';
import { areaHref } from '@/modules/Travel/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  return [...INDEXABLE_ROUTES, ...Object.values(AREA_IDS).map(areaHref)].flatMap((route) =>
    routing.locales.map((locale) => ({
      url: getAbsoluteUrl(locale, route),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '/' ? 1 : 0.7,
      alternates: { languages: getLanguageAlternates(route) },
    }))
  );
}
