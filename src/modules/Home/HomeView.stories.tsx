import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { travelFixture } from '../Travel/__tests__/fixture';
import { HomeView } from './HomeView';

const meta = { title: 'Travel/Home', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <HomeView t={t} locale={locale} dataset={travelFixture} />;
  },
};

export const SourceUnavailable: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <HomeView t={t} locale={locale} dataset={null} />;
  },
};
