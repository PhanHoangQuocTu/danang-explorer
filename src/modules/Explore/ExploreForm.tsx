'use client';

import type { FormEvent, PropsWithChildren } from 'react';

import { useRouter } from '@/i18n/navigation';

import { exploreHref } from '../Travel/navigation';

const OPTIONAL_FIELDS = new Set(['q', 'rating', 'status', 'sort']);

export const ExploreForm = ({ action, label, children }: PropsWithChildren<{ action: string; label: string }>) => {
  const router = useRouter();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value !== 'string') continue;
      const field = key === 'q' ? value.trim().replace(/\s+/gu, ' ') : value;
      if (field || !OPTIONAL_FIELDS.has(key)) params.append(key, field);
    }
    router.push(exploreHref(params));
  };

  return (
    <form action={action} method='get' aria-label={label} onSubmit={submit} className='space-y-4'>
      {children}
    </form>
  );
};
