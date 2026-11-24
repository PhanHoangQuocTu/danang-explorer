import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import type { Locale } from '@/i18n/routing';
import type { ITravelListing } from '@/lib/travel-data/type';
import { PAGE_SIZE } from '@/modules/Explore/discovery';
import { getCanonicalAreaName } from '@/modules/Travel/catalog';
import { loadTravelDataset } from '@/modules/Travel/loadTravelDataset';
import type { Translator } from '@/types/translation';

export const guideSections = {
  [ROUTES.HOME]: 'home',
  [ROUTES.EXPLORE]: 'explore',
  [ROUTES.AREAS]: 'areas',
  [ROUTES.TRIP_IDEAS]: 'tripIdeas',
  [ROUTES.INSIGHTS]: 'insights',
} as const;

export const getGuideCopy = async (locale: Locale, path: keyof typeof guideSections) => {
  const { t } = await useTranslationsServer(`travel.${guideSections[path]}`, locale);
  return { title: t('title'), description: t('description') };
};

export const getPlaceDescription = (listing: ITravelListing, t: Translator<'travel'>) => {
  const category = t(`categories.${listing.mainCategory}`);
  const area = getCanonicalAreaName(listing);
  return area
    ? t('detail.metaWithArea', { name: listing.name, category, area })
    : t('detail.meta', { name: listing.name, category });
};

type SearchParams = Record<string, string | string[] | undefined>;

export const getExploreSeo = async (locale: Locale, query: SearchParams) => {
  const { t } = await useTranslationsServer('travel.explore', locale);
  const base = { path: ROUTES.EXPLORE, title: t('title'), description: t('description') };
  const keys = Object.keys(query);
  if (!keys.length) return { ...base, noIndex: false };
  const { page } = query;
  if (keys.length === 1 && typeof page === 'string' && /^[1-9]\d{0,8}$/u.test(page) && Number(page) > 1) {
    const result = await loadTravelDataset();
    const total = result.ok && Math.ceil(result.dataset.listings.length / PAGE_SIZE);
    if (total && Number(page) <= total) {
      return {
        ...base,
        noIndex: false,
        path: `${ROUTES.EXPLORE}?page=${page}`,
        title: `${base.title} · ${t('page', { page: Number(page), total })}`,
      };
    }
  }
  return { ...base, noIndex: true };
};
