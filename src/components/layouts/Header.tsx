import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TravelRefreshButton } from './TravelRefreshButton';

export const Header = async ({ showTravelRefresh = false }: { showTravelRefresh?: boolean } = {}) => {
  const [{ t }, { t: travel }] = await Promise.all([useTranslationsServer('common'), useTranslationsServer('travel')]);
  const links = [
    [ROUTES.EXPLORE, t('explore')],
    [ROUTES.AREAS, travel('areas.title')],
    [ROUTES.TRIP_IDEAS, travel('tripIdeas.title')],
    [ROUTES.INSIGHTS, travel('insights.nav')],
  ] as const;

  return (
    <header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur'>
      <div className='mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-1 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-x-4'>
        <Link href={ROUTES.HOME} prefetch={false} className='w-fit font-semibold tracking-tight'>
          {t('appName')}
        </Link>
        <nav
          aria-label={travel('navigation')}
          className='col-span-2 row-start-2 flex flex-wrap items-center gap-x-1 lg:col-span-1 lg:col-start-2 lg:row-start-1'
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className='rounded-sm px-2 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring'
            >
              {label}
            </Link>
          ))}
          {showTravelRefresh && <TravelRefreshButton />}
        </nav>
        <div className='col-start-2 row-start-1 flex items-center gap-2 lg:col-start-3'>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
