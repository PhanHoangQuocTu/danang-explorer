import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { InsightsChart } from './InsightsChart';

const meta = { title: 'Travel/Insights Chart', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const NarrowAreaChart: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const rows = [
      { id: 'ngu-hanh-son', label: 'Ngũ Hành Sơn', count: 9 },
      { id: 'near-da-nang', label: 'Gần Đà Nẵng', count: 4 },
      { id: 'unknown', label: t('insights.unknownArea'), count: 1 },
    ];
    return (
      <div className='w-full max-w-80'>
        <InsightsChart rows={rows} layout='vertical' countLabel={t('insights.count')} locale={locale} />
      </div>
    );
  },
};

export const RatingHistogram: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const rows = (['underThree', 'underFour', 'underFourFive', 'fourFiveToFive'] as const).map((id, index) => ({
      id,
      label: t(`insights.buckets.${id}`),
      count: [0, 2, 14, 8][index],
    }));
    return (
      <div className='w-full max-w-96'>
        <InsightsChart rows={rows} layout='horizontal' countLabel={t('insights.count')} locale={locale} />
      </div>
    );
  },
};
