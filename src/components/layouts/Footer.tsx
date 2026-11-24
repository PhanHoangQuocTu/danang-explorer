import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { FooterView } from './FooterView';

export const Footer = async () => {
  const [{ t }, { t: travel }] = await Promise.all([useTranslationsServer('common'), useTranslationsServer('travel')]);

  return <FooterView t={t} travel={travel} />;
};
