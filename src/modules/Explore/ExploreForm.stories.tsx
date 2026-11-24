import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks';
import { getPathname } from '@/i18n/navigation';

import { ExploreForm, MobileFilterSheet } from './ExploreForm';

const meta = { title: 'Travel/Explore controls/Mobile filters', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const FilterDialog: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => {
    const { locale, t } = useTranslations('travel');
    return (
      <MobileFilterSheet label={t('explore.filters')} closeLabel={t('explore.closeFilters')} count={1}>
        <ExploreForm
          action={getPathname({ locale, href: '/explore' })}
          label={t('explore.filters')}
          className='space-y-4 pt-4'
        >
          <label className='flex min-h-11 items-center gap-2'>
            <input type='checkbox' name='category' value='food-dining' defaultChecked />
            {t('categories.food-dining')}
          </label>
          <Button type='submit'>{t('explore.apply')}</Button>
        </ExploreForm>
      </MobileFilterSheet>
    );
  },
};
