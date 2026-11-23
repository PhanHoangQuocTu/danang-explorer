import { Skeleton } from '@/components/ui/skeleton';
import type { Translator } from '@/types/translation';

export const TravelState = ({ t, state }: { t: Translator<'travel'>; state: 'loading' | 'error' | 'empty' }) => (
  <div role={state === 'error' ? 'alert' : 'status'} className='space-y-3 rounded-xl border bg-muted/30 p-6 sm:p-8'>
    <p className='font-medium'>{t(`state.${state}`)}</p>
    {state === 'loading' && <Skeleton aria-hidden='true' className='h-2 w-40' />}
    {state === 'error' && <p className='text-muted-foreground text-sm'>{t('state.errorHint')}</p>}
  </div>
);
