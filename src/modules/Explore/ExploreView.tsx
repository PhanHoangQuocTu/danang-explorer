import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { ITravelDataset } from '@/lib/travel-data/type';

import { MAIN_CATEGORIES } from '../Travel/catalog';
import { exploreHref } from '../Travel/navigation';
import { SectionBreadcrumb } from '../Travel/SectionBreadcrumb';
import { TravelState } from '../Travel/TravelState';
import type { TravelViewProps } from '../Travel/type';
import {
  clearExploreState,
  discoverListings,
  type ExploreState,
  getExploreOptions,
  parseExploreState,
  serializeExploreState,
  VIEWS,
} from './discovery';
import { ExploreFilters, ExploreSort } from './ExploreFilters';
import { ExploreResults } from './ExploreResults';

interface ExploreViewProps extends TravelViewProps {
  query: URLSearchParams;
  dataset: ITravelDataset | null;
}

export const ExploreView = ({ t, locale, query, dataset }: ExploreViewProps) => (
  <div className='min-w-0 space-y-6 pb-6'>
    <SectionBreadcrumb t={t} title={t('explore.title')} />
    <header className='guide-intro'>
      <h1 className='guide-heading'>{t('explore.title')}</h1>
      <p className='max-w-prose leading-relaxed text-muted-foreground'>{t('explore.description')}</p>
    </header>
    {dataset ? (
      <ExploreDiscovery t={t} locale={locale} query={query} dataset={dataset} />
    ) : (
      <TravelState t={t} state='error' />
    )}
  </div>
);

const ExploreDiscovery = ({
  t,
  locale,
  query,
  dataset,
}: Omit<ExploreViewProps, 'dataset'> & { dataset: ITravelDataset }) => {
  const options = getExploreOptions(dataset.listings);
  const state = parseExploreState(query, options);
  const categoryLabels = Object.fromEntries(MAIN_CATEGORIES.map((key) => [key, t(`categories.${key}`)]));
  const results = discoverListings(dataset.listings, state, locale, categoryLabels);
  const href = (changes: Partial<ExploreState>) =>
    exploreHref(serializeExploreState({ ...state, page: results.page, ...changes }, query));
  const clearHref = exploreHref(serializeExploreState(clearExploreState(state), query));

  return (
    <>
      <ExploreFilters
        t={t}
        locale={locale}
        state={state}
        query={query}
        options={options}
        areas={dataset.areas}
        clearHref={clearHref}
      />
      <section aria-labelledby='explore-results' className='min-w-0 space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2
            id='explore-results'
            aria-live='polite'
            className='font-serif text-3xl tracking-tight text-ocean tabular-nums'
          >
            {t('explore.results', { count: results.total })}
          </h2>
          <div className='flex max-w-full flex-wrap items-center gap-x-5 gap-y-3'>
            <ExploreSort key={state.sort} t={t} locale={locale} state={state} query={query} />
            <nav
              aria-label={t('explore.views')}
              className='flex max-w-full flex-wrap gap-1 rounded-lg border bg-muted/50 p-1'
            >
              {VIEWS.map((view) => (
                <Button
                  key={view}
                  asChild
                  size='sm'
                  variant={state.view === view ? 'default' : 'ghost'}
                  className='min-h-10'
                >
                  <Link href={href({ view })} aria-current={state.view === view ? 'true' : undefined} prefetch={false}>
                    {t(`explore.view.${view}`)}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
        {results.total > 0 && <ExploreResults t={t} locale={locale} listings={results.listings} view={state.view} />}
        {dataset.listings.length === 0 && <TravelState t={t} state='empty' />}
        {dataset.listings.length > 0 && results.total === 0 && (
          <div className='space-y-2 rounded-xl border bg-muted/30 p-6 sm:p-8'>
            <p className='font-medium'>{t('explore.empty')}</p>
            <p className='text-sm text-muted-foreground'>{t('explore.emptyHint')}</p>
            <Button asChild variant='outline' className='mt-2'>
              <Link href={clearHref} prefetch={false}>
                {t('explore.clear')}
              </Link>
            </Button>
          </div>
        )}
        {results.pageCount > 1 && (
          <nav
            aria-label={t('explore.pagination')}
            className='flex flex-wrap items-center justify-between gap-3 border-t pt-4'
          >
            <p aria-current='page' className='text-sm text-muted-foreground tabular-nums'>
              {t('explore.page', { page: results.page, total: results.pageCount })}
            </p>
            <div className='flex gap-2'>
              {results.page > 1 ? (
                <Button asChild variant='outline'>
                  <Link href={href({ page: results.page - 1 })} prefetch={false}>
                    {t('explore.previous')}
                  </Link>
                </Button>
              ) : (
                <Button variant='outline' type='button' disabled>
                  {t('explore.previous')}
                </Button>
              )}
              {results.page < results.pageCount ? (
                <Button asChild variant='outline'>
                  <Link href={href({ page: results.page + 1 })} prefetch={false}>
                    {t('explore.next')}
                  </Link>
                </Button>
              ) : (
                <Button variant='outline' type='button' disabled>
                  {t('explore.next')}
                </Button>
              )}
            </div>
          </nav>
        )}
      </section>
    </>
  );
};
