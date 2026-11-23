import { useTranslationsServer } from '@/hooks/useTranslationsServer';

export const Footer = async () => {
  const { t } = await useTranslationsServer('common');

  return (
    <footer className='border-t py-6 text-center text-sm text-muted-foreground'>
      © {new Date().getFullYear()} {t('appName')}
    </footer>
  );
};
