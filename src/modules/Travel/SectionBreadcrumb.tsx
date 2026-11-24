import { ROUTES } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import type { TravelViewProps } from './type';

export const SectionBreadcrumb = ({ t, title }: Pick<TravelViewProps, 't'> & { title: string }) => (
  <nav aria-label={t('detail.breadcrumb')}>
    <ol className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
      <li>
        <Link href={ROUTES.HOME} prefetch={false} className='underline-offset-4 hover:underline'>
          {t('detail.home')}
        </Link>
      </li>
      <li aria-hidden='true'>/</li>
      <li aria-current='page' className='text-foreground'>
        {title}
      </li>
    </ol>
  </nav>
);
