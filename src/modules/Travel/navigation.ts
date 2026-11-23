import { buildRoute, ROUTES } from '@/constants/routes';

export const placeHref = (id: string) => buildRoute(ROUTES.PLACE_DETAIL, { id });

export const exploreHref = (params: URLSearchParams) => {
  const query = params.toString();
  return query ? `${ROUTES.EXPLORE}?${query}` : ROUTES.EXPLORE;
};
