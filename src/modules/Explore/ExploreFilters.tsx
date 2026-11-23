import { ChevronDownIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { ROUTES } from '@/constants/routes';
import { getPathname, Link } from '@/i18n/navigation';
import type { IAreaMetadata } from '@/lib/travel-data/type';

import { getCanonicalAreas, LISTING_STATUSES, MAIN_CATEGORIES } from '../Travel/catalog';
import { SearchField } from '../Travel/SearchField';
import type { TravelViewProps } from '../Travel/type';
import { type ExploreState, type getExploreOptions, getUnrelatedParams, RATINGS, SORTS } from './discovery';
import { ExploreForm } from './ExploreForm';

interface Option {
  value: string;
  label: string;
}

const asOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

type MultiFilter = 'category' | 'sourceCategory' | 'area' | 'suitableFor' | 'recommendedTime';

interface ExploreFiltersProps extends TravelViewProps {
  state: ExploreState;
  query: URLSearchParams;
  areas: readonly IAreaMetadata[];
  options: ReturnType<typeof getExploreOptions>;
  clearHref: string;
}

export const ExploreFilters = ({ t, locale, state, query, areas, options, clearHref }: ExploreFiltersProps) => {
  const fields: { key: MultiFilter; items: Option[] }[] = [
    { key: 'category', items: MAIN_CATEGORIES.map((value) => ({ value, label: t(`categories.${value}`) })) },
    { key: 'sourceCategory', items: asOptions(options.sourceCategory) },
    { key: 'area', items: getCanonicalAreas(areas).map(({ id, name }) => ({ value: id, label: name })) },
    { key: 'suitableFor', items: asOptions(options.suitableFor) },
    { key: 'recommendedTime', items: asOptions(options.recommendedTime) },
  ];
  const active = fields.flatMap(({ key, items }) =>
    items
      .filter(({ value }) => state[key].some((selected) => selected === value))
      .map(({ value, label }) => ({ id: `${key}:${value}`, label }))
  );
  if (state.q) active.unshift({ id: 'q', label: state.q });
  if (state.rating) active.push({ id: 'rating', label: t('explore.ratingValue', { value: state.rating }) });
  if (state.status) active.push({ id: 'status', label: t(`statuses.${state.status}`) });

  return (
    <section aria-labelledby='explore-filters' className='min-w-0 space-y-4 rounded-xl border bg-muted/25 p-4 sm:p-5'>
      <h2 id='explore-filters' className='font-semibold'>
        {t('explore.filters')}
      </h2>
      <ExploreForm action={getPathname({ locale, href: ROUTES.EXPLORE })} label={t('explore.filters')}>
        {Array.from(getUnrelatedParams(query), ([name, value], index) => (
          <input key={`${name}-${index}`} type='hidden' name={name} value={value} />
        ))}
        {state.view !== 'grid' && <input type='hidden' name='view' value={state.view} />}
        <div className='flex flex-wrap items-center gap-2'>
          <SearchField t={t} query={state.q} />
          <Button type='submit' className='h-11'>
            {t('search.submit')}
          </Button>
        </div>
        <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
          {fields.map(({ key, items }) => (
            <details key={key} className='group min-w-0 rounded-md border bg-background'>
              <summary className='flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden'>
                <span className='flex-1 font-medium'>{t(`explore.${key}`)}</span>
                {state[key].length > 0 && (
                  <span className='text-muted-foreground text-xs'>
                    {t('explore.selected', { count: state[key].length })}
                  </span>
                )}
                <ChevronDownIcon
                  className='size-4 shrink-0 text-muted-foreground group-open:rotate-180'
                  aria-hidden='true'
                />
              </summary>
              {items.length > 0 ? (
                <fieldset className='max-h-48 space-y-1.5 overflow-y-auto border-t px-3 py-2'>
                  <legend className='sr-only'>{t(`explore.${key}`)}</legend>
                  {items.map(({ value, label }) => (
                    <label key={value} className='flex min-h-9 cursor-pointer items-start gap-2 py-1 text-sm'>
                      <input
                        type='checkbox'
                        name={key}
                        value={value}
                        defaultChecked={state[key].some((selected) => selected === value)}
                        className='mt-0.5 size-4 shrink-0 accent-primary'
                      />
                      <span className='wrap-anywhere'>{label}</span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <p className='border-t px-3 py-2 text-muted-foreground text-sm'>{t('explore.noOptions')}</p>
              )}
            </details>
          ))}
        </div>
        <div className='flex flex-wrap items-end gap-x-4 gap-y-3'>
          <label htmlFor='explore-rating' className='grid gap-1 text-sm'>
            <span>{t('explore.rating')}</span>
            <NativeSelect id='explore-rating' name='rating' defaultValue={state.rating ?? ''}>
              <NativeSelectOption value=''>{t('explore.all')}</NativeSelectOption>
              {RATINGS.map((rating) => (
                <NativeSelectOption key={rating} value={rating}>
                  {t('explore.ratingValue', { value: rating })}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <label htmlFor='explore-status' className='grid gap-1 text-sm'>
            <span>{t('explore.status')}</span>
            <NativeSelect id='explore-status' name='status' defaultValue={state.status ?? ''}>
              <NativeSelectOption value=''>{t('explore.all')}</NativeSelectOption>
              {LISTING_STATUSES.map((status) => (
                <NativeSelectOption key={status} value={status}>
                  {t(`statuses.${status}`)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <label htmlFor='explore-sort' className='grid gap-1 text-sm'>
            <span>{t('explore.sort')}</span>
            <NativeSelect id='explore-sort' name='sort' defaultValue={state.sort === 'source' ? '' : state.sort}>
              {SORTS.map((sort) => (
                <NativeSelectOption key={sort} value={sort === 'source' ? '' : sort}>
                  {t(`explore.sorts.${sort}`)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <div className='flex flex-wrap gap-2 sm:ml-auto'>
            <Button asChild variant='ghost'>
              <Link href={clearHref} prefetch={false}>
                {t('explore.clear')}
              </Link>
            </Button>
            <Button type='submit' variant='outline'>
              {t('explore.apply')}
            </Button>
          </div>
        </div>
      </ExploreForm>
      {active.length > 0 && (
        <div className='flex flex-wrap items-center gap-2 border-t pt-3'>
          <p className='text-muted-foreground text-sm'>{t('explore.activeFilters')}</p>
          <ul className='flex min-w-0 flex-wrap gap-1.5'>
            {active.map(({ id, label }) => (
              <li key={id} className='min-w-0 max-w-full'>
                <Badge variant='secondary' className='wrap-anywhere h-auto max-w-full whitespace-normal'>
                  {label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
