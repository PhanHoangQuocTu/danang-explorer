import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { getPathname, Link } from '@/i18n/navigation';
import type { ITravelDataset } from '@/lib/travel-data/type';

import { getCanonicalAreas, getListingCounts, MAIN_CATEGORIES } from '../Travel/catalog';
import { areaHref, exploreHref } from '../Travel/navigation';
import { SearchField } from '../Travel/SearchField';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';

export const HomeView = ({ t, locale, dataset }: TravelViewProps & { dataset: ITravelDataset | null }) => (
  <div className='space-y-12 pb-6 sm:space-y-16'>
    <section className='border-b pt-5 pb-9 sm:pt-9 sm:pb-12'>
      <h1 className='max-w-3xl font-serif text-5xl leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl'>
        {t('home.title')}
      </h1>
      <p className='mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg'>{t('home.description')}</p>
      <form
        action={getPathname({ locale, href: ROUTES.EXPLORE })}
        method='get'
        role='search'
        className='mt-7 flex max-w-xl flex-wrap items-center gap-2'
      >
        <SearchField t={t} />
        <Button type='submit' className='h-11'>
          {t('search.submit')}
          <ArrowRightIcon aria-hidden='true' />
        </Button>
      </form>
    </section>
    {dataset ? <HomeDiscovery t={t} locale={locale} dataset={dataset} /> : <TravelState t={t} state='error' />}
  </div>
);

const HomeDiscovery = ({ t, locale, dataset }: TravelViewProps & { dataset: ITravelDataset }) => {
  const areas = getCanonicalAreas(dataset.areas);
  const counts = getListingCounts(dataset.listings);
  const number = new Intl.NumberFormat(locale);
  const editorial = dataset.editorial.topPicks.slice(0, 3);
  const groups = [
    {
      title: t('home.categories'),
      key: 'category',
      rows: MAIN_CATEGORIES.map((id) => ({
        id,
        name: t(`categories.${id}`),
        count: counts.categories.get(id) ?? 0,
        href: exploreHref(new URLSearchParams({ category: id })),
      })),
    },
    {
      title: t('home.areas'),
      key: 'area',
      rows: areas.map(({ id, name }) => ({ id, name, count: counts.areas.get(id) ?? 0, href: areaHref(id) })),
    },
  ];

  return (
    <>
      <dl className='grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-4 sm:gap-8 sm:p-6'>
        {(
          [
            ['home.placesTotal', dataset.listings.length],
            ['home.categoriesTotal', MAIN_CATEGORIES.length],
            ['home.areasTotal', areas.length],
          ] as const
        ).map(([label, count]) => (
          <div key={label} className='flex min-w-0 flex-col-reverse gap-1'>
            <dt className='text-sm text-muted-foreground'>{t(label)}</dt>
            <dd className='text-2xl font-semibold tabular-nums sm:text-3xl'>{number.format(count)}</dd>
          </div>
        ))}
      </dl>
      {dataset.listings.length === 0 && <TravelState t={t} state='empty' />}
      <div className='grid gap-10 md:grid-cols-2 md:gap-14'>
        {groups.map(({ title, key, rows }) => (
          <section key={key} aria-labelledby={`home-${key}`}>
            <h2 id={`home-${key}`} className='mb-4 font-serif text-3xl tracking-tight'>
              {title}
            </h2>
            <ul className='divide-y border-y'>
              {rows.map(({ id, name, count, href }) => (
                <li key={id}>
                  <Link
                    href={href}
                    prefetch={false}
                    aria-label={`${name}, ${t('explore.results', { count })}`}
                    className='flex min-h-12 items-center gap-3 rounded-sm px-2 py-2 font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring'
                  >
                    <span className='flex-1'>{name}</span>
                    <span className='text-sm text-muted-foreground tabular-nums'>{number.format(count)}</span>
                    <ArrowRightIcon aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {editorial.length > 0 && (
        <section aria-labelledby='home-editorial' className='border-t pt-8'>
          <h2 id='home-editorial' className='font-serif text-3xl tracking-tight'>
            {t('home.editorial')}
          </h2>
          <div className='mt-5 grid gap-4 md:grid-cols-3'>
            {editorial.map(({ title, content }, index) => (
              <article key={`${title}-${index}`} lang='vi' className='min-w-0 rounded-xl border bg-muted/30 p-5'>
                <h3 className='font-semibold wrap-anywhere'>{title}</h3>
                <p className='mt-2 text-sm wrap-anywhere whitespace-pre-wrap text-muted-foreground'>{content}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
