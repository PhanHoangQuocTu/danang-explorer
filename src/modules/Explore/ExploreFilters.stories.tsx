import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { travelFixture } from '../Travel/__tests__/fixture';
import { getExploreOptions, parseExploreState } from './discovery';
import { ExploreFilters, ExploreSort } from './ExploreFilters';

const meta = { title: 'Travel/Explore controls/Applied choices', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveFilters: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const query = new URLSearchParams({ q: 'Đỗ', area: 'hai-chau', view: 'list' });
    const options = getExploreOptions(travelFixture.listings);
    const state = parseExploreState(query, options);
    return (
      <div className='space-y-4'>
        <ExploreFilters
          {...{ t, locale, query, state, options }}
          areas={travelFixture.areas}
          clearHref='/explore?view=list'
        />
        <ExploreSort {...{ t, locale, query, state }} />
      </div>
    );
  },
};
