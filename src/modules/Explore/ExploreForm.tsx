'use client';

import { SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { type FormEvent, type PropsWithChildren, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from '@/i18n/navigation';

import { exploreHref } from '../Travel/navigation';

const OPTIONAL_FIELDS = new Set(['q', 'rating', 'status', 'sort']);

export const ExploreForm = ({
  action,
  label,
  children,
  className,
}: PropsWithChildren<{ action: string; label: string; className?: string }>) => {
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
    <form action={action} method='get' aria-label={label} onSubmit={submit} className={className}>
      {children}
    </form>
  );
};

export const MobileFilterSheet = ({
  label,
  closeLabel,
  count,
  children,
}: PropsWithChildren<{ label: string; closeLabel: string; count: number }>) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' aria-label={`${label} (${count})`} className='h-12 lg:hidden'>
          <SlidersHorizontalIcon aria-hidden='true' />
          {label}
          <span className='rounded-full bg-secondary px-2 text-xs tabular-nums'>{count}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='bottom'
        aria-describedby={undefined}
        showCloseButton={false}
        onSubmit={() => setOpen(false)}
        className='max-h-[90dvh] gap-0 overflow-y-auto overscroll-contain rounded-t-2xl px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'
      >
        <div className='sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background py-2'>
          <SheetTitle className='font-serif text-2xl'>{label}</SheetTitle>
          <SheetClose asChild>
            <Button type='button' variant='ghost' size='icon' className='size-11' aria-label={closeLabel}>
              <XIcon aria-hidden='true' />
            </Button>
          </SheetClose>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  );
};
