import { ChevronRightIcon } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import type { ITravelListing } from '@/lib/travel-data/type';
import { cn } from '@/lib/utils';

import { getCanonicalAreaName } from '../Travel/catalog';
import { ListingMapsLink } from '../Travel/ListingLinks';
import { ListingStatusBadge } from '../Travel/ListingStatusBadge';
import type { TravelViewProps } from '../Travel/type';

type Fact = readonly [label: string, value: string | null | undefined];
const availableFacts = (facts: readonly Fact[]) =>
  facts.filter((fact): fact is readonly [string, string] => Boolean(fact[1]));
const sourceText = 'wrap-anywhere whitespace-pre-wrap';

const Facts = ({ entries }: { entries: readonly (readonly [string, string])[] }) => (
  <dl className='divide-y'>
    {entries.map(([label, value]) => (
      <div key={label} className='space-y-1 py-3 first:pt-0 last:pb-0'>
        <dt className='font-medium text-sm'>{label}</dt>
        <dd lang='vi' className={cn(sourceText, 'text-muted-foreground')}>
          {value}
        </dd>
      </div>
    ))}
  </dl>
);

const TextSection = ({ id, title, value }: { id: string; title: string; value: string | null }) =>
  value ? (
    <section aria-labelledby={id} className='space-y-3 border-t pt-6'>
      <h2 id={id} className='font-semibold text-2xl tracking-tight sm:text-3xl'>
        {title}
      </h2>
      <p lang='vi' className={cn(sourceText, 'max-w-prose leading-relaxed')}>
        {value}
      </p>
    </section>
  ) : null;

export const PlaceDetailView = ({ t, locale, listing }: TravelViewProps & { listing: ITravelListing }) => {
  const area = getCanonicalAreaName(listing);
  const facts = availableFacts([
    [t('detail.address'), listing.address],
    [t('explore.ratingHeading'), listing.rating === null ? null : new Intl.NumberFormat(locale).format(listing.rating)],
    [t('explore.price'), listing.priceText],
    [t('detail.openingHours'), listing.openingHoursText],
    [t('explore.sourceCategory'), listing.sourceCategory],
  ]);
  const profile = listing.visitProfile;
  const profileFacts = availableFacts([
    [t('explore.suitableFor'), profile?.suitableFor],
    [t('explore.recommendedTime'), profile?.recommendedTime],
    [t('detail.duration'), profile?.suggestedDuration],
    [t('detail.distance'), profile?.distanceFromCenterText],
  ]);
  const practical = facts.length > 0 || Boolean(listing.mapsUrl);

  return (
    <article className='min-w-0 space-y-8 pb-8 sm:space-y-10'>
      <nav aria-label={t('detail.breadcrumb')} className='text-muted-foreground text-sm'>
        <ol className='flex flex-wrap items-center gap-x-2 gap-y-1'>
          <li>
            <Link
              href={ROUTES.HOME}
              prefetch={false}
              className='rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring'
            >
              {t('detail.home')}
            </Link>
          </li>
          <li className='flex items-center gap-2'>
            <ChevronRightIcon aria-hidden='true' className='size-3.5 shrink-0' />
            <Link
              href={ROUTES.EXPLORE}
              prefetch={false}
              className='rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring'
            >
              {t('detail.explore')}
            </Link>
          </li>
          <li className='flex min-w-0 items-start gap-2'>
            <ChevronRightIcon aria-hidden='true' className='mt-0.5 size-3.5 shrink-0' />
            <span lang='vi' aria-current='page' className='wrap-anywhere text-foreground'>
              {listing.name}
            </span>
          </li>
        </ol>
      </nav>

      <header className='space-y-4 border-b pb-7 sm:pb-9'>
        <div className='flex flex-wrap items-center gap-3'>
          <p className='font-medium text-muted-foreground text-sm'>{t(`categories.${listing.mainCategory}`)}</p>
          <ListingStatusBadge t={t} status={listing.status} />
        </div>
        <h1
          lang='vi'
          className='wrap-anywhere max-w-4xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl'
        >
          {listing.name}
        </h1>
        {area && (
          <p className='text-muted-foreground text-sm'>
            <span className='sr-only'>{t('explore.area')} </span>
            <span lang='vi' className={sourceText}>
              {area}
            </span>
          </p>
        )}
      </header>

      <div className={cn('grid gap-8', practical && 'lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.52fr)] lg:gap-12')}>
        {practical && (
          <section
            aria-labelledby='place-facts'
            className='min-w-0 space-y-4 self-start rounded-xl border bg-muted/30 p-5 sm:p-6 lg:col-start-2 lg:row-start-1'
          >
            <h2 id='place-facts' className='font-semibold text-2xl tracking-tight'>
              {t('detail.facts')}
            </h2>
            <ListingMapsLink listing={listing} t={t} prominent />
            {facts.length > 0 && <Facts entries={facts} />}
          </section>
        )}
        <div className='min-w-0 space-y-7 lg:col-start-1 lg:row-start-1'>
          <TextSection id='place-highlights' title={t('detail.highlights')} value={listing.highlightsText} />
          <TextSection id='place-notes' title={t('detail.notes')} value={listing.notesText} />
          {(profileFacts.length > 0 || listing.visitProfileRaw) && (
            <section aria-labelledby='place-profile' className='space-y-4 border-t pt-6'>
              <h2 id='place-profile' className='font-semibold text-2xl tracking-tight sm:text-3xl'>
                {t('detail.profile')}
              </h2>
              {profileFacts.length > 0 ? (
                <Facts entries={profileFacts} />
              ) : (
                <p lang='vi' className={sourceText}>
                  {listing.visitProfileRaw}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </article>
  );
};
