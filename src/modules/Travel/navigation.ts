import { buildRoute, ROUTES } from '@/constants/routes';
import type { AreaId } from '@/lib/travel-data/type';

export const placeHref = (id: string) => buildRoute(ROUTES.PLACE_DETAIL, { id });

export const areaHref = (areaId: AreaId) => buildRoute(ROUTES.AREA_DETAIL, { areaId });

export const exploreHref = (params: URLSearchParams) => {
  const query = params.toString();
  return query ? `${ROUTES.EXPLORE}?${query}` : ROUTES.EXPLORE;
};

export const exploreAreaHref = (areaId: AreaId) => exploreHref(new URLSearchParams({ area: areaId }));
