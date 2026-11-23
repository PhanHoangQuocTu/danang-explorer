import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import type { IAreaMetadata, ITravelDataset, ITravelListing } from '@/lib/travel-data/type';

import { ExploreResults } from '../Explore/ExploreResults';
import { getListingCounts } from '../Travel/catalog';
import { areaHref, exploreAreaHref } from '../Travel/navigation';
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
        <header className='border-b pt-3 pb-6 sm:pt-5'>
          <h1 className='font-[family-name:Times_New_Roman,Times,serif] text-4xl tracking-tight sm:text-5xl'>
            {t('areas.title')}
          </h1>
          <p className='mt-3 max-w-xl text-muted-foreground'>{t('areas.description')}</p>
        </header>
        {dataset && counts ? (
          <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {dataset.areas.map(({ areaId, areaName }) => (
              <li key={areaId} className='min-w-0'>
                <Link
                  href={areaHref(areaId)}
                  prefetch={false}
                  className='flex h-full items-center gap-4 rounded-xl border bg-card p-5 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring sm:p-6'
                >
                  <span className='min-w-0 flex-1'>
                    <span
                      lang='vi'
                      className='wrap-anywhere block font-[family-name:Times_New_Roman,Times,serif] text-2xl'
                    >
                      {areaName}
                    </span>
                    <span className='mt-1 block text-muted-foreground text-sm tabular-nums'>
                      {t('explore.results', { count: counts.get(areaId) ?? 0 })}
                    </span>
                  </span>
                  <ArrowRightIcon aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />
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
        <ol className='flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-sm'>
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
      <header className='space-y-4 border-b pb-7'>
        <h1
          lang='vi'
          className='wrap-anywhere font-[family-name:Times_New_Roman,Times,serif] text-4xl tracking-tight sm:text-6xl'
        >
          {area.areaName}
        </h1>
        {area.description && (
          <p lang='vi' className='wrap-anywhere max-w-prose whitespace-pre-wrap text-muted-foreground leading-relaxed'>
            {area.description}
          </p>
        )}
      </header>
      <section aria-labelledby='area-listings' className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 id='area-listings' className='font-[family-name:Times_New_Roman,Times,serif] text-2xl'>
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
