import Image from 'next/image';

import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { Link } from '@/i18n/navigation';

import { HeaderNavigation } from './HeaderNavigation';

export const Header = async ({ showTravelRefresh = false }: { showTravelRefresh?: boolean } = {}) => {
  const { t } = await useTranslationsServer('common');

  return (
    <header className='border-b border-border bg-background'>
      <a
        href='#main-content'
        className='sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground'
      >
        {t('shell.skip')}
      </a>
      <div className='mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-2 px-4 sm:gap-5 sm:px-6 lg:min-h-20 lg:px-8'>
        <Link
          href={ROUTES.HOME}
          prefetch={false}
          className='flex min-w-0 items-center gap-2 rounded-sm py-2 text-lg leading-tight font-semibold tracking-tight sm:gap-3 sm:text-xl'
        >
          <Image src='/icon.svg' alt='' width={38} height={38} className='size-8 shrink-0 sm:size-10' />
          <span>{t('appName')}</span>
        </Link>
        <HeaderNavigation showTravelRefresh={showTravelRefresh} />
      </div>
    </header>
  );
};
