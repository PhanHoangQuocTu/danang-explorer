import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { phaseSixFixture } from '../Travel/__tests__/phase-six-fixture';
import { InsightsView } from './InsightsView';
import { getInsightsMetrics } from './metrics';

const meta = { title: 'Travel/Insights', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return (
      <InsightsView
        t={t}
        locale={locale}
        metrics={getInsightsMetrics(phaseSixFixture.listings, phaseSixFixture.areas)}
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <InsightsView t={t} locale={locale} metrics={getInsightsMetrics([], [])} />;
  },
};

export const NoRatings: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const listings = phaseSixFixture.listings.map((listing) => ({ ...listing, rating: null }));
    return <InsightsView t={t} locale={locale} metrics={getInsightsMetrics(listings, phaseSixFixture.areas)} />;
  },
};

export const SourceUnavailable: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <InsightsView t={t} locale={locale} metrics={null} />;
  },
};
