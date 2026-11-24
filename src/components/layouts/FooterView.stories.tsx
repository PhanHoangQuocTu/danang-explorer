import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';
import { FooterView } from './FooterView';

const meta = {
  title: 'Layouts/Footer',
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
} satisfies Meta;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const { t } = useTranslations('common');
    const { t: travel } = useTranslations('travel');
    return <FooterView t={t} travel={travel} />;
  },
};
