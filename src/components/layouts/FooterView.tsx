import { ArrowUpRightIcon, MailIcon } from 'lucide-react';
import Image from 'next/image';

import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import type { Translator } from '@/types/translation';
import { getGuideLinks } from './navigation';

export const FooterView = ({ t, travel }: { t: Translator<'common'>; travel: Translator<'travel'> }) => {
  const { owner } = siteConfig;
  return (
    <footer className='bg-[#123B4A] text-[#F8F7F2] dark:bg-card dark:text-foreground [&_:focus-visible]:outline-current'>
      <div className='mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.45fr_0.8fr_1fr] lg:gap-14 lg:px-8 lg:py-14'>
        <div className='space-y-3 sm:col-span-2 lg:col-span-1'>
          <Link href={ROUTES.HOME} prefetch={false} className='inline-flex items-center gap-3 font-serif text-2xl'>
            <Image src='/icon.svg' alt='' width={40} height={40} />
            {t('appName')}
          </Link>
          <p className='max-w-sm leading-relaxed text-white/85'>{t('seo.description')}</p>
        </div>
        <nav aria-labelledby='footer-guide'>
          <h2 id='footer-guide' className='mb-2 font-semibold'>
            {t('shell.guide')}
          </h2>
          <ul>
            {getGuideLinks(t, travel).map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  prefetch={false}
                  className='inline-flex min-h-10 items-center underline-offset-4 hover:underline'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <section aria-labelledby='footer-owner' className='min-w-0'>
          <h2 id='footer-owner' className='mb-2 font-semibold'>
            {t('shell.owner')}
          </h2>
          <p lang='vi' className='mb-2 font-serif text-xl'>
            {owner.name}
          </p>
          {owner.email && (
            <a
              href={`mailto:${owner.email}`}
              className='inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline'
            >
              <MailIcon aria-hidden='true' className='size-4 shrink-0' />
              <span className='wrap-anywhere'>{owner.email}</span>
            </a>
          )}
          <div className='flex flex-wrap gap-x-5'>
            {(
              [
                ['facebook', owner.facebookUrl],
                ['linkedin', owner.linkedinUrl],
              ] as const
            ).map(
              ([key, href]) =>
                href && (
                  <a
                    key={key}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex min-h-11 items-center gap-1 text-sm underline underline-offset-4'
                  >
                    {t(`shell.${key}`)}
                    <ArrowUpRightIcon aria-hidden='true' className='size-4' />
                  </a>
                )
            )}
          </div>
        </section>
      </div>
    </footer>
  );
};
