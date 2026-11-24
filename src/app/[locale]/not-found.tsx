import type { Metadata } from 'next';

import { MainLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await useTranslationsServer('common.notFound');

  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function NotFound() {
  const { t } = await useTranslationsServer('common');

  return (
    <MainLayout>
      <section className='mx-auto my-12 flex max-w-3xl flex-col items-start gap-5 rounded-xl bg-secondary p-8 sm:p-14'>
        <p className='text-6xl font-semibold text-primary'>404</p>
        <h1 className='guide-heading'>{t('notFound.title')}</h1>
        <p className='text-sm text-muted-foreground'>{t('notFound.description')}</p>
        <Button asChild>
          <Link href={ROUTES.HOME}>{t('actions.backHome')}</Link>
        </Button>
      </section>
    </MainLayout>
  );
}
