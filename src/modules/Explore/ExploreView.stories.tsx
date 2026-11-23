import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { travelFixture } from '../Travel/__tests__/fixture';
import { ExploreView } from './ExploreView';

const meta = { title: 'Travel/Explore', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return <ExploreView t={t} locale={locale} query={new URLSearchParams()} dataset={travelFixture} />;
  },
};

export const FilteredTable: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return (
      <ExploreView
        t={t}
        locale={locale}
        query={new URLSearchParams({ view: 'table', q: 'quan do' })}
        dataset={travelFixture}
      />
    );
  },
};

export const EmptySearch: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    return (
      <ExploreView t={t} locale={locale} query={new URLSearchParams({ q: 'no matches' })} dataset={travelFixture} />
    );
  },
};
