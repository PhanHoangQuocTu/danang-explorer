import { ChevronDownIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { SheetClose } from '@/components/ui/sheet';
import { ROUTES } from '@/constants/routes';
import { getPathname, Link } from '@/i18n/navigation';
import type { IAreaMetadata } from '@/lib/travel-data/type';

import { getCanonicalAreas, LISTING_STATUSES, MAIN_CATEGORIES } from '../Travel/catalog';
import { exploreHref } from '../Travel/navigation';
import { SearchField } from '../Travel/SearchField';
import type { TravelViewProps } from '../Travel/type';
import { type ExploreState, type getExploreOptions, RATINGS, serializeExploreState, SORTS } from './discovery';
import { ExploreForm, MobileFilterSheet } from './ExploreForm';

type MultiFilter = 'category' | 'sourceCategory' | 'area' | 'suitableFor' | 'recommendedTime';
type FilterKey = MultiFilter | 'q' | 'rating' | 'status';
interface Option {
  value: string;
  label: string;
}
const asOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));
interface ExploreFiltersProps extends TravelViewProps {
  state: ExploreState;
  query: URLSearchParams;
  areas: readonly IAreaMetadata[];
  options: ReturnType<typeof getExploreOptions>;
  clearHref: string;
}

const hiddenFields = (params: URLSearchParams) =>
  Array.from(params, ([name, value], index) => (
    <input key={`${name}-${index}`} type='hidden' name={name} value={value} />
  ));

export const ExploreFilters = ({ t, locale, state, query, areas, options, clearHref }: ExploreFiltersProps) => {
  const fields: { key: MultiFilter; items: Option[] }[] = [
    { key: 'category', items: MAIN_CATEGORIES.map((value) => ({ value, label: t(`categories.${value}`) })) },
    { key: 'sourceCategory', items: asOptions(options.sourceCategory) },
    { key: 'area', items: getCanonicalAreas(areas).map(({ id, name }) => ({ value: id, label: name })) },
    { key: 'suitableFor', items: asOptions(options.suitableFor) },
    { key: 'recommendedTime', items: asOptions(options.recommendedTime) },
  ];
  const active: { key: FilterKey; value: string; label: string }[] = fields.flatMap(({ key, items }) =>
    items.filter(({ value }) => state[key].some((selected) => selected === value)).map((item) => ({ ...item, key }))
  );
  if (state.rating)
    active.push({ key: 'rating', value: state.rating, label: t('explore.ratingValue', { value: state.rating }) });
  if (state.status) active.push({ key: 'status', value: state.status, label: t(`statuses.${state.status}`) });
  const filterCount = active.length;
  if (state.q) active.unshift({ key: 'q', value: state.q, label: state.q });
  const action = getPathname({ locale, href: ROUTES.EXPLORE });
  const current = serializeExploreState({ ...state, page: 1 }, query);
  const searchParams = new URLSearchParams(current);
  searchParams.delete('q');
  const filterParams = new URLSearchParams(current);
  for (const { key } of fields) filterParams.delete(key);
  filterParams.delete('rating');
  filterParams.delete('status');

  const filtersForm = (mobile: boolean) => (
    <ExploreForm key={current.toString()} action={action} label={t('explore.filters')} className='space-y-3'>
      {hiddenFields(filterParams)}
      <div className='grid gap-2 lg:grid-cols-4'>
        {fields.map(({ key, items }) => (
          <details key={key} className='group h-fit min-w-0 rounded-lg border bg-card'>
            <summary className='flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden'>
              <span className='flex-1 font-medium'>{t(`explore.${key}`)}</span>
              {state[key].length > 0 && (
                <span className='text-xs text-primary'>{t('explore.selected', { count: state[key].length })}</span>
              )}
              <ChevronDownIcon
                aria-hidden='true'
                className='size-4 shrink-0 text-muted-foreground group-open:rotate-180'
              />
            </summary>
            {items.length > 0 ? (
              <fieldset className='max-h-56 overflow-y-auto border-t px-3 py-1'>
                <legend className='sr-only'>{t(`explore.${key}`)}</legend>
                {items.map(({ value, label }) => (
                  <label key={value} className='flex min-h-11 cursor-pointer items-center gap-2 py-1 text-sm'>
                    <input
                      type='checkbox'
                      name={key}
                      value={value}
                      defaultChecked={state[key].some((selected) => selected === value)}
                      className='size-4 shrink-0 accent-primary'
                    />
                    <span className='wrap-anywhere' lang={key === 'category' ? undefined : 'vi'}>
                      {label}
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <p className='border-t px-3 py-2 text-sm text-muted-foreground'>{t('explore.noOptions')}</p>
            )}
          </details>
        ))}
        {(['rating', 'status'] as const).map((key) => {
          const id = `explore-${mobile ? 'mobile-' : ''}${key}`;
          return (
            <label
              key={key}
              htmlFor={id}
              className='flex min-h-11 items-center justify-between gap-2 rounded-lg border bg-card px-3 text-sm font-medium'
            >
              {t(`explore.${key}`)}
              <NativeSelect
                id={id}
                name={key}
                defaultValue={state[key] ?? ''}
                className='max-w-full border-0 bg-transparent shadow-none'
              >
                <NativeSelectOption value=''>{t('explore.all')}</NativeSelectOption>
                {key === 'rating'
                  ? RATINGS.map((rating) => (
                      <NativeSelectOption key={rating} value={rating}>
                        {t('explore.ratingValue', { value: rating })}
                      </NativeSelectOption>
                    ))
                  : LISTING_STATUSES.map((status) => (
                      <NativeSelectOption key={status} value={status}>
                        {t(`statuses.${status}`)}
                      </NativeSelectOption>
                    ))}
              </NativeSelect>
            </label>
          );
        })}
        <div className='flex flex-wrap items-center gap-3'>
          <Button type='submit' className='h-11 grow'>
            {t('explore.apply')}
          </Button>
          {mobile && (
            <SheetClose asChild>
              <Link
                prefetch={false}
                href={clearHref}
                className='inline-flex min-h-11 items-center text-sm text-primary underline'
              >
                {t('explore.clear')}
              </Link>
            </SheetClose>
          )}
        </div>
      </div>
    </ExploreForm>
  );
  return (
    <section aria-label={t('explore.filters')} className='min-w-0 space-y-4 border-b pb-5'>
      <div className='flex flex-wrap items-center gap-2'>
        <ExploreForm
          key={state.q}
          action={action}
          label={t('search.label')}
          className='flex min-w-0 grow basis-72 flex-wrap gap-2'
        >
          {hiddenFields(searchParams)}
          <SearchField t={t} query={state.q} />
          <Button type='submit' className='h-12 px-5'>
            <SearchIcon aria-hidden='true' />
            {t('search.submit')}
          </Button>
        </ExploreForm>
        <MobileFilterSheet label={t('explore.filters')} closeLabel={t('explore.closeFilters')} count={filterCount}>
          <div className='pt-4'>{filtersForm(true)}</div>
        </MobileFilterSheet>
      </div>
      <div className='hidden lg:block'>
        <h2 className='mb-2 flex items-center gap-2 text-sm font-semibold'>
          <SlidersHorizontalIcon aria-hidden='true' className='size-4 text-primary' />
          {t('explore.filters')}
        </h2>
        {filtersForm(false)}
      </div>
      {(active.length > 0 || state.sort !== 'source') && (
        <div aria-label={t('explore.activeFilters')} role='group' className='flex flex-wrap items-center gap-2'>
          {active.map(({ key, value, label }) => {
            const params = new URLSearchParams(current);
            params.delete(key, value);
            const dimension = key === 'q' ? t('search.label') : t(`explore.${key}`);
            return (
              <Link
                key={`${key}:${value}`}
                href={exploreHref(params)}
                prefetch={false}
                aria-label={t('explore.removeFilter', { filter: dimension, value: label })}
                className='inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-primary/30 bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:border-primary focus-visible:outline-2 focus-visible:outline-ring'
              >
                <span className='min-w-0 wrap-anywhere'>{label}</span>
                <XIcon aria-hidden='true' className='size-3.5 shrink-0' />
              </Link>
            );
          })}
          <Link
            href={clearHref}
            prefetch={false}
            className='inline-flex min-h-11 items-center rounded-sm px-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring'
          >
            {t('explore.clear')}
          </Link>
        </div>
      )}
    </section>
  );
};

export const ExploreSort = ({
  t,
  locale,
  state,
  query,
}: Pick<ExploreFiltersProps, 't' | 'locale' | 'state' | 'query'>) => {
  const params = serializeExploreState({ ...state, sort: 'source', page: 1 }, query);
  return (
    <ExploreForm
      action={getPathname({ locale, href: ROUTES.EXPLORE })}
      label={t('explore.sort')}
      className='flex flex-wrap items-center gap-2'
    >
      {hiddenFields(params)}
      <label htmlFor='explore-sort' className='text-sm font-medium'>
        {t('explore.sort')}
      </label>
      <NativeSelect
        id='explore-sort'
        name='sort'
        defaultValue={state.sort === 'source' ? '' : state.sort}
        className='h-11'
      >
        {SORTS.map((sort) => (
          <NativeSelectOption key={sort} value={sort === 'source' ? '' : sort}>
            {t(`explore.sorts.${sort}`)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <Button variant='outline' type='submit' className='h-11'>
        {t('explore.applySort')}
      </Button>
    </ExploreForm>
  );
};
