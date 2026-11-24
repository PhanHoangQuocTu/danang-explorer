import { Skeleton } from '@/components/ui/skeleton';
import type { Translator } from '@/types/translation';

export const TravelState = ({ t, state }: { t: Translator<'travel'>; state: 'loading' | 'error' | 'empty' }) => (
  <div
    role={state === 'error' ? 'alert' : 'status'}
    data-state={state}
    className='space-y-3 rounded-xl bg-secondary p-6 text-secondary-foreground data-[state=loading]:min-h-svh sm:p-8'
  >
    <p className='text-2xl font-semibold'>{t(`state.${state}`)}</p>
    {state === 'loading' && <Skeleton aria-hidden='true' className='h-2 w-40' />}
    {state === 'error' && <p className='text-sm text-muted-foreground'>{t('state.errorHint')}</p>}
  </div>
);
