import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import type { IAreaMetadata, ITravelDataset, ITravelListing } from '@/lib/travel-data/type';

import { ExploreResults } from '../Explore/ExploreResults';
import { getListingCounts } from '../Travel/catalog';
import { areaHref, exploreAreaHref } from '../Travel/navigation';
import { SectionBreadcrumb } from '../Travel/SectionBreadcrumb';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';

type AreasViewProps = TravelViewProps &
  (
    | { mode: 'index'; dataset: ITravelDataset | null }
    | { mode: 'detail'; area: IAreaMetadata; listings: ITravelListing[] }
  );

export const AreasView = (props: AreasViewProps) => {
  const { t, locale } = props;
  if (props.mode === 'index') {
    const { dataset } = props;
    const counts = dataset && getListingCounts(dataset.listings).areas;
    return (
      <div className='space-y-8 pb-6'>
        <SectionBreadcrumb t={t} title={t('areas.title')} />
        <header className='guide-intro'>
          <h1 className='guide-heading'>{t('areas.title')}</h1>
          <p className='max-w-prose leading-relaxed text-muted-foreground'>{t('areas.description')}</p>
        </header>
        {dataset && counts ? (
          <ul className='grid gap-x-12 border-t border-ocean/50 md:grid-cols-2'>
            {dataset.areas.map(({ areaId, areaName }) => (
              <li key={areaId} className='min-w-0'>
                <Link
                  href={areaHref(areaId)}
                  prefetch={false}
                  className='group flex h-full items-center gap-4 border-b py-5 hover:text-primary sm:py-7'
                >
                  <span className='min-w-0 flex-1'>
                    <span lang='vi' className='block font-serif text-3xl tracking-tight wrap-anywhere sm:text-4xl'>
                      {areaName}
                    </span>
                    <span className='mt-1 block text-sm text-muted-foreground tabular-nums'>
                      {t('explore.results', { count: counts.get(areaId) ?? 0 })}
                    </span>
                  </span>
                  <ArrowRightIcon
                    aria-hidden='true'
                    className='size-5 shrink-0 text-primary group-hover:translate-x-1 motion-safe:transition-transform'
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <TravelState t={t} state='error' />
        )}
      </div>
    );
  }

  const { area, listings } = props;
  return (
    <div className='min-w-0 space-y-8 pb-6'>
      <nav aria-label={t('detail.breadcrumb')}>
        <ol className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground'>
          <li>
            <Link prefetch={false} href={ROUTES.HOME} className='underline-offset-4 hover:underline'>
              {t('detail.home')}
            </Link>
          </li>
          <li aria-hidden='true'>/</li>
          <li>
            <Link prefetch={false} href={ROUTES.AREAS} className='underline-offset-4 hover:underline'>
              {t('areas.title')}
            </Link>
          </li>
          <li aria-hidden='true'>/</li>
          <li aria-current='page' lang='vi' className='wrap-anywhere text-foreground'>
            {area.areaName}
          </li>
        </ol>
      </nav>
      <header className='guide-intro rounded-xl border-0 bg-secondary p-6 sm:p-10'>
        <h1 lang='vi' className='guide-heading'>
          {area.areaName}
        </h1>
        {area.description && (
          <p lang='vi' className='max-w-prose leading-relaxed wrap-anywhere whitespace-pre-wrap text-muted-foreground'>
            {area.description}
          </p>
        )}
      </header>
      <section aria-labelledby='area-listings' className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 id='area-listings' className='font-serif text-3xl text-ocean'>
            {t('explore.results', { count: listings.length })}
          </h2>
          <Button asChild variant='outline'>
            <Link href={exploreAreaHref(area.areaId)} prefetch={false}>
              {t('areas.explore')}
            </Link>
          </Button>
        </div>
        {listings.length ? (
          <ExploreResults view='list' t={t} locale={locale} listings={listings} />
        ) : (
          <p role='status' className='rounded-xl border bg-muted/30 p-6 text-muted-foreground'>
            {t('areas.empty')}
          </p>
        )}
      </section>
    </div>
  );
};
