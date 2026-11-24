'use client';

import { RefreshCwIcon } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks';
import { useRouter } from '@/i18n/navigation';

const COOLDOWN_MS = 60_000;
const STORAGE_KEY = 'travel:refresh-until';

const readBrowserDeadline = (now: number) => {
  try {
    const deadline = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isSafeInteger(deadline) && deadline > now && deadline <= now + COOLDOWN_MS ? deadline : 0;
  } catch {
    return 0;
  }
};

export const TravelRefreshButton = () => {
  const router = useRouter();
  const { t } = useTranslations('travel.refresh');
  const [isPending, startTransition] = useTransition();
  const attemptDeadline = useRef(0);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  useEffect(() => {
    const sync = () => setCooldownUntil(Math.max(attemptDeadline.current, readBrowserDeadline(Date.now())));
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) sync();
    };

    sync();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (cooldownUntil === 0) return;
    const timer = window.setTimeout(() => setCooldownUntil(0), Math.max(0, cooldownUntil - Date.now()));
    return () => window.clearTimeout(timer);
  }, [cooldownUntil]);

  const refresh = () => {
    const now = Date.now();
    const activeDeadline = Math.max(attemptDeadline.current, readBrowserDeadline(now));
    if (isPending || activeDeadline > now) {
      if (activeDeadline > now) setCooldownUntil(activeDeadline);
      return;
    }

    const deadline = now + COOLDOWN_MS;
    attemptDeadline.current = deadline;
    setCooldownUntil(deadline);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(deadline));
    } catch {
      // The mounted control still enforces its cooldown when storage is unavailable.
    }
    startTransition(() => router.refresh());
  };

  return (
    <div className='shrink-0'>
      <Button
        type='button'
        size='sm'
        variant='ghost'
        className='min-h-11 min-w-11'
        title={t('label')}
        disabled={isPending || cooldownUntil > 0}
        onClick={refresh}
      >
        <RefreshCwIcon aria-hidden='true' className={isPending ? 'motion-safe:animate-spin' : undefined} />
        <span className='sr-only xl:not-sr-only'>{t('label')}</span>
      </Button>
      <span role='status' className='sr-only'>
        {isPending && t('pending')}
        {!isPending && cooldownUntil > 0 && t('cooldown')}
      </span>
    </div>
  );
};
