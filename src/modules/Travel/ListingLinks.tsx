import { ArrowUpRightIcon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { ITravelListing } from '@/lib/travel-data/type';

import { placeHref } from './navigation';
import type { TravelViewProps } from './type';

export const ListingNameLink = ({ id, name }: Pick<ITravelListing, 'id' | 'name'>) => (
  <Link
    href={placeHref(id)}
    prefetch={false}
    lang='vi'
    className='rounded-sm wrap-anywhere underline decoration-muted-foreground/60 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-ring'
  >
    {name}
  </Link>
);

export const ListingMapsLink = ({
  listing,
  t,
  prominent = false,
}: Pick<TravelViewProps, 't'> & { listing: Pick<ITravelListing, 'mapsUrl' | 'name'>; prominent?: boolean }) =>
  listing.mapsUrl ? (
    <a
      href={listing.mapsUrl}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={prominent ? undefined : t('explore.mapFor', { name: listing.name })}
      className={
        prominent
          ? buttonVariants({ size: 'lg' })
          : 'inline-flex min-h-8 items-center gap-1 rounded-sm text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring'
      }
    >
      {t(prominent ? 'detail.maps' : 'explore.map')}
      <ArrowUpRightIcon aria-hidden='true' className='size-3.5 shrink-0' />
    </a>
  ) : null;
