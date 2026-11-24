'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from '@/hooks';
import { Link, usePathname } from '@/i18n/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';
import { getCurrentLink, getGuideLinks } from './navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TravelRefreshButton } from './TravelRefreshButton';

export const HeaderNavigation = ({ showTravelRefresh = false }: { showTravelRefresh?: boolean }) => {
  const { t } = useTranslations('common');
  const { t: travel } = useTranslations('travel');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = getGuideLinks(t, travel);

  return (
    <>
      <nav aria-label={travel('navigation')} className='hidden items-center gap-0.5 lg:flex xl:gap-1'>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            aria-current={getCurrentLink(href, pathname)}
            className='flex min-h-11 items-center rounded-sm px-2.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-primary aria-[current]:text-primary aria-[current]:underline aria-[current]:decoration-2 aria-[current]:underline-offset-8'
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className='flex shrink-0 items-center gap-0.5 sm:gap-1.5'>
        {showTravelRefresh && <TravelRefreshButton />}
        <LanguageSwitcher />
        <div className='hidden lg:block'>
          <ThemeSwitcher />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-11 lg:hidden'
              aria-label={t('shell.menu')}
            >
              <MenuIcon aria-hidden='true' className='size-5' />
            </Button>
          </SheetTrigger>
          <SheetContent
            showCloseButton={false}
            aria-describedby={undefined}
            className='w-[min(22rem,90vw)] gap-0 overflow-y-auto p-5'
          >
            <div className='flex items-center justify-between gap-4 border-b pb-4'>
              <SheetTitle className='font-serif text-2xl'>{t('shell.menu')}</SheetTitle>
              <SheetClose asChild>
                <Button type='button' variant='ghost' size='icon' className='size-11' aria-label={t('shell.closeMenu')}>
                  <XIcon aria-hidden='true' />
                </Button>
              </SheetClose>
            </div>
            <nav aria-label={travel('navigation')} className='flex flex-col py-3'>
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  aria-current={getCurrentLink(href, pathname)}
                  onClick={() => setOpen(false)}
                  className='rounded-sm px-2 py-3 font-medium text-muted-foreground hover:text-primary aria-[current]:bg-accent aria-[current]:text-accent-foreground aria-[current]:underline aria-[current]:underline-offset-4'
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className='flex items-center justify-between border-t pt-4'>
              <span className='text-sm font-medium'>{t('theme.label')}</span>
              <ThemeSwitcher />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
