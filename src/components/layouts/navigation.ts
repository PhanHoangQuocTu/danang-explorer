import { ROUTES } from '@/constants/routes';
import type { Translator } from '@/types/translation';

export const getGuideLinks = (common: Translator<'common'>, travel: Translator<'travel'>) =>
  [
    { href: ROUTES.HOME, label: travel('detail.home') },
    { href: ROUTES.EXPLORE, label: common('explore') },
    { href: ROUTES.AREAS, label: travel('areas.title') },
    { href: ROUTES.TRIP_IDEAS, label: travel('tripIdeas.title') },
    { href: ROUTES.INSIGHTS, label: travel('insights.nav') },
  ] as const;

/** Detail pages belong to their discovery section, but only exact links represent the current page. */
export const getCurrentLink = (href: string, pathname: string) => {
  if (pathname === href) return 'page';
  if (href === ROUTES.AREAS && pathname.startsWith('/areas/')) return 'location';
  if (href === ROUTES.EXPLORE && pathname.startsWith('/places/')) return 'location';
  return undefined;
};
