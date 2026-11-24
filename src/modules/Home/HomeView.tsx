import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BedDoubleIcon,
  CoffeeIcon,
  MountainIcon,
  TicketIcon,
  UtensilsIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { getPathname, Link } from '@/i18n/navigation';
import type { ITravelDataset } from '@/lib/travel-data/type';

import { getCanonicalAreas, getListingCounts, MAIN_CATEGORIES } from '../Travel/catalog';
import { areaHref, exploreHref } from '../Travel/navigation';
import { SearchField } from '../Travel/SearchField';
import { TopPicksContent } from '../Travel/TopPicksContent';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';

const CATEGORY_ICONS = {
  'sightseeing-nature': MountainIcon,
  'food-dining': UtensilsIcon,
  'cafe-checkin': CoffeeIcon,
  entertainment: TicketIcon,
  accommodation: BedDoubleIcon,
};

const textLink =
  'inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring';

export const HomeView = ({ t, locale, dataset }: TravelViewProps & { dataset: ITravelDataset | null }) => (
  <div className='space-y-12 pb-8 sm:space-y-16'>
    <section className='relative isolate overflow-hidden rounded-2xl bg-secondary text-secondary-foreground lg:grid lg:grid-cols-[1.45fr_1fr]'>
      <div className='relative z-10 px-5 py-9 sm:px-9 sm:py-12 lg:py-16 xl:px-12'>
        <h1 className='max-w-[11ch] text-[clamp(3.25rem,7vw,6rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance'>
          {t('home.title')}
        </h1>
        <p className='mt-5 max-w-[45ch] leading-relaxed text-pretty sm:text-lg'>{t('home.description')}</p>
        <form
          action={getPathname({ locale, href: ROUTES.EXPLORE })}
          method='get'
          role='search'
          className='mt-7 flex max-w-xl flex-wrap gap-2'
        >
          <SearchField t={t} />
          <Button type='submit' className='h-12 px-5'>
            {t('search.submit')} <ArrowRightIcon aria-hidden='true' />
          </Button>
        </form>
      </div>
      <svg
        aria-hidden='true'
        focusable='false'
        viewBox='0 0 480 380'
        preserveAspectRatio='xMidYMid slice'
        className='block h-24 w-full text-primary sm:h-36 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[39%]'
      >
        <rect width='480' height='380' fill='currentColor' />
        <circle cx='300' cy='152' r='80' fill='var(--coral)' />
        <path d='M0 254 Q98 191 194 226 T390 233 T550 219 V395 H0Z' fill='var(--secondary)' />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
          <path
            key={line}
            d='M-45 277 Q90 187 201 238 T420 237 T550 225'
            transform={`translate(0 ${line * 16})`}
            fill='none'
            stroke='currentColor'
            strokeWidth={line === 0 ? 3 : 1.5}
          />
        ))}
      </svg>
    </section>
    {dataset ? <HomeDiscovery t={t} locale={locale} dataset={dataset} /> : <TravelState t={t} state='error' />}
  </div>
);

const HomeDiscovery = ({ t, locale, dataset }: TravelViewProps & { dataset: ITravelDataset }) => {
  const areas = getCanonicalAreas(dataset.areas);
  const counts = getListingCounts(dataset.listings);
  const editorial = dataset.editorial.topPicks.slice(0, 3);
  const number = new Intl.NumberFormat(locale);
  return (
    <>
      {dataset.listings.length === 0 && <TravelState t={t} state='empty' />}
      <section aria-labelledby='home-category'>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-x-4'>
          <h2 id='home-category' className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            {t('home.categories')}
          </h2>
          <Link href={ROUTES.EXPLORE} className={textLink}>
            {t('explore.title')} <ArrowRightIcon aria-hidden='true' className='size-4' />
          </Link>
        </div>
        <ul className='grid overflow-hidden rounded-xl border bg-card sm:grid-cols-2 lg:grid-cols-5'>
          {MAIN_CATEGORIES.map((id) => {
            const Icon = CATEGORY_ICONS[id];
            const label = t(`categories.${id}`);
            const count = counts.categories.get(id) ?? 0;
            return (
              <li key={id} className='min-w-0 border-b last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0'>
                <Link
                  href={exploreHref(new URLSearchParams({ category: id }))}
                  prefetch={false}
                  aria-label={`${label}, ${t('explore.results', { count })}`}
                  className='group flex h-full items-center gap-3 p-4 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring lg:flex-col lg:items-start lg:gap-2 lg:p-5'
                >
                  <Icon
                    aria-hidden='true'
                    strokeWidth={1.5}
                    className='size-6 shrink-0 text-primary lg:mb-3 lg:size-8'
                  />
                  <span className='font-semibold'>{label}</span>
                  <span className='ml-auto text-sm text-muted-foreground tabular-nums lg:mt-auto lg:ml-0'>
                    {t('explore.results', { count })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section aria-labelledby='home-area' className='grid gap-5 border-t pt-8 lg:grid-cols-[1fr_2fr] lg:gap-12'>
        <div>
          <h2 id='home-area' className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            {t('home.areas')}
          </h2>
          <Link href={ROUTES.AREAS} className={textLink}>
            {t('home.allAreas')} <ArrowRightIcon aria-hidden='true' className='size-4' />
          </Link>
        </div>
        <ul className='grid gap-x-8 sm:grid-cols-2'>
          {areas.map(({ id, name }) => {
            const count = counts.areas.get(id) ?? 0;
            return (
              <li key={id} className='border-b'>
                <Link
                  href={areaHref(id)}
                  prefetch={false}
                  aria-label={`${name}, ${t('explore.results', { count })}`}
                  className='group flex min-h-13 items-center gap-3 rounded-sm px-1 font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-ring'
                >
                  <span lang='vi' className='flex-1'>
                    {name}
                  </span>
                  <span className='text-sm text-muted-foreground tabular-nums'>{number.format(count)}</span>
                  <ArrowUpRightIcon aria-hidden='true' className='size-4 text-primary' />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      {editorial.length > 0 && (
        <section aria-labelledby='home-editorial' className='rounded-xl bg-secondary px-5 py-7 sm:p-9'>
          <div className='flex flex-wrap items-center justify-between gap-x-4'>
            <h2 id='home-editorial' className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              {t('home.editorial')}
            </h2>
            <Link href={ROUTES.TRIP_IDEAS} className={textLink}>
              {t('tripIdeas.title')} <ArrowRightIcon aria-hidden='true' className='size-4' />
            </Link>
          </div>
          <div className='mt-5 grid gap-5 xl:grid-cols-[repeat(auto-fit,minmax(min(100%,19rem),1fr))] xl:gap-8'>
            {editorial.map(({ title, content }, index) => (
              <article
                key={`${title}-${index}`}
                lang='vi'
                className='min-w-0 space-y-3 border-t border-primary/25 pt-4 sm:grid sm:grid-cols-[minmax(9rem,1fr)_minmax(0,2fr)] sm:gap-5 sm:space-y-0 xl:block xl:space-y-3'
              >
                <h3 className='text-lg leading-snug font-semibold wrap-anywhere whitespace-pre-wrap'>{title}</h3>
                <TopPicksContent content={content} />
              </article>
            ))}
          </div>
        </section>
      )}
      <div className='flex flex-wrap items-center justify-between gap-4 border-y py-4'>
        <dl className='flex flex-wrap gap-x-6 gap-y-2'>
          {(
            [
              ['home.placesTotal', dataset.listings.length],
              ['home.categoriesTotal', MAIN_CATEGORIES.length],
              ['home.areasTotal', areas.length],
            ] as const
          ).map(([label, count]) => (
            <div key={label} className='flex flex-row-reverse items-baseline gap-1.5'>
              <dt className='text-sm text-muted-foreground'>{t(label)}</dt>
              <dd className='font-semibold tabular-nums'>{number.format(count)}</dd>
            </div>
          ))}
        </dl>
        <Link href={ROUTES.INSIGHTS} className={textLink}>
          {t('insights.nav')} <ArrowRightIcon aria-hidden='true' className='size-4' />
        </Link>
      </div>
    </>
  );
};
