import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { phaseSixFixture } from '../Travel/__tests__/phase-six-fixture';
import { AreasView } from './AreasView';

const meta = { title: 'Travel/Areas', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Index: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <AreasView t={t} locale={locale} mode='index' dataset={phaseSixFixture} />;
  },
};

export const Detail: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const area = phaseSixFixture.areas[0];
    const listings = phaseSixFixture.listings.filter(({ areaId }) => areaId === area.areaId);
    return <AreasView t={t} locale={locale} mode='detail' area={area} listings={listings} />;
  },
};

export const EmptyArea: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <AreasView t={t} locale={locale} mode='detail' area={phaseSixFixture.areas[7]} listings={[]} />;
  },
};
