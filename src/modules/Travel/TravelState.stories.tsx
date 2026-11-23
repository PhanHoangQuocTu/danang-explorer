import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { TravelState } from './TravelState';

const meta = { title: 'Travel/Data states', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => {
    const { t } = useTranslations('travel');
    return <TravelState t={t} state='loading' />;
  },
};

export const EmptyDataset: Story = {
  render: () => {
    const { t } = useTranslations('travel');
    return <TravelState t={t} state='empty' />;
  },
};
