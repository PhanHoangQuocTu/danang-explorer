export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  PLACE_DETAIL: '/places/:id',
  AREAS: '/areas',
  AREA_DETAIL: '/areas/:areaId',
  TRIP_IDEAS: '/trip-ideas',
  HEALTH: '/health',
} as const;

/** Routes listed in `sitemap.xml`. Operational pages (e.g. health) are left out on purpose. */
export const INDEXABLE_ROUTES: string[] = [ROUTES.HOME, ROUTES.EXPLORE, ROUTES.AREAS, ROUTES.TRIP_IDEAS];

/**
 * Replace `:param` placeholders of a route.
 * @example buildRoute('/users/:id', { id: 1 }) // '/users/1'
 */
export const buildRoute = (route: string, params: Record<string, string | number> = {}): string =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(String(value))),
    route
  );
