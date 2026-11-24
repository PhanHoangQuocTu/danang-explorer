'use client';

import { useTranslations } from '@/hooks';

import { ErrorState } from '@/components/common';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslations('common');

  return (
    <div className='mx-auto my-12 max-w-xl rounded-xl bg-secondary p-8'>
      <ErrorState
        title={t('error.title')}
        description={t('error.description')}
        action={
          <Button size='sm' variant='outline' onClick={reset}>
            {t('actions.retry')}
          </Button>
        }
      />
    </div>
  );
}
