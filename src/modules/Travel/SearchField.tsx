import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import type { Translator } from '@/types/translation';

import { QUERY_LIMIT } from '../Explore/discovery';

export const SearchField = ({ t, query }: { t: Translator<'travel'>; query?: string }) => (
  <label htmlFor='travel-search' className='relative block min-w-0 flex-1 basis-52'>
    <span className='sr-only'>{t('search.label')}</span>
    <SearchIcon
      aria-hidden='true'
      className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground'
    />
    <Input
      id='travel-search'
      type='search'
      name='q'
      defaultValue={query}
      maxLength={QUERY_LIMIT}
      placeholder={t('search.placeholder')}
      className='h-11 bg-background pl-11'
    />
  </label>
);
