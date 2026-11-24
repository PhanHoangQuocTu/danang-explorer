import { StarIcon } from 'lucide-react';

import type { ITravelListing } from '@/lib/travel-data/type';
import { cn } from '@/lib/utils';

import { ListingMapsLink, ListingNameLink } from '../Travel/ListingLinks';
import { ListingStatusBadge } from '../Travel/ListingStatusBadge';
import type { TravelViewProps } from '../Travel/type';
import type { ExploreState } from './discovery';

interface ExploreResultsProps extends TravelViewProps {
  listings: readonly ITravelListing[];
  view: ExploreState['view'];
}

export const ExploreResults = ({ t, locale, listings, view }: ExploreResultsProps) => {
  const number = new Intl.NumberFormat(locale);
  if (view === 'table') {
    const columns = ['name', 'category', 'sourceCategory', 'area', 'ratingHeading', 'price', 'status', 'map'] as const;
    return (
      <div
        role='region'
        aria-label={t('explore.view.table')}
        className='max-w-full overflow-x-auto rounded-lg border focus-visible:outline-2 focus-visible:outline-ring'
      >
        <table className='w-full min-w-180 text-sm'>
          <caption className='sr-only'>{t('explore.view.table')}</caption>
          <thead className='bg-muted/70 text-left'>
            <tr>
              {columns.map((column) => (
                <th key={column} scope='col' className='px-3 py-3 font-semibold'>
                  {t(`explore.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y'>
            {listings.map((listing) => (
              <tr key={listing.id} className='align-top hover:bg-muted/30'>
                <th scope='row' className='min-w-38 px-3 py-3 text-left font-semibold'>
                  <ListingNameLink id={listing.id} name={listing.name} />
                  {listing.address && (
                    <p lang='vi' className='mt-1 font-normal text-muted-foreground'>
                      {listing.address}
                    </p>
                  )}
                </th>
                <td className='px-3 py-3'>{t(`categories.${listing.mainCategory}`)}</td>
                <td lang='vi' className='px-3 py-3'>
                  {listing.sourceCategory}
                </td>
                <td lang='vi' className='px-3 py-3'>
                  {listing.areaName}
                </td>
                <td className='px-3 py-3 tabular-nums'>{listing.rating !== null && number.format(listing.rating)}</td>
                <td lang='vi' className='px-3 py-3'>
                  {listing.priceText}
                </td>
                <td className='px-3 py-3'>
                  <ListingStatusBadge t={t} status={listing.status} />
                </td>
                <td className='px-3 py-2'>
                  <ListingMapsLink t={t} listing={listing} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <ul
      aria-label={t(`explore.view.${view}`)}
      className={cn(view === 'grid' ? 'grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3' : 'divide-y border-y')}
    >
      {listings.map((listing) => (
        <li
          key={listing.id}
          className={cn('min-w-0', view === 'grid' && 'flex border-t-2 border-primary/60 bg-card text-card-foreground')}
        >
          <article
            className={cn(
              'w-full min-w-0 gap-4',
              view === 'grid'
                ? 'flex flex-col p-5 sm:p-6'
                : 'grid py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-x-6'
            )}
          >
            <div className='min-w-0 space-y-2'>
              <p className='text-xs font-medium text-muted-foreground'>{t(`categories.${listing.mainCategory}`)}</p>
              <h3 className='font-serif text-2xl leading-tight tracking-tight wrap-anywhere text-ocean'>
                <ListingNameLink id={listing.id} name={listing.name} />
              </h3>
              {(listing.areaName || listing.address) && (
                <p lang='vi' className='text-sm wrap-anywhere text-muted-foreground'>
                  {[listing.areaName, listing.address].filter(Boolean).join(' · ')}
                </p>
              )}
              {view === 'grid' && listing.highlightsText && (
                <p lang='vi' className='line-clamp-2 text-sm wrap-anywhere text-muted-foreground'>
                  {listing.highlightsText}
                </p>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-2 text-sm'>
              <ListingStatusBadge t={t} status={listing.status} />
              {listing.rating !== null && (
                <span className='inline-flex items-center gap-1 tabular-nums'>
                  <StarIcon aria-hidden='true' className='size-3.5' />
                  <span className='sr-only'>{t('explore.ratingHeading')}</span>
                  {number.format(listing.rating)}
                </span>
              )}
              {listing.priceText && (
                <span lang='vi' className='wrap-anywhere text-muted-foreground'>
                  {listing.priceText}
                </span>
              )}
            </div>
            {listing.mapsUrl && (
              <div className={cn(view === 'grid' && 'mt-auto border-t pt-2')}>
                <ListingMapsLink t={t} listing={listing} />
              </div>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
};
