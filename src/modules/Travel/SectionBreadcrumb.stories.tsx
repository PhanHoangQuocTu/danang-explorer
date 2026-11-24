import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';
import { SectionBreadcrumb } from './SectionBreadcrumb';

export default { title: 'Travel/Section breadcrumb' } satisfies Meta;
export const Areas: StoryObj = {
  render: () => {
    const { t } = useTranslations('travel');
    return <SectionBreadcrumb t={t} title={t('areas.title')} />;
  },
};
