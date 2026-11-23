import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { listing, travelFixture } from '../Travel/__tests__/fixture';
import { PlaceDetailView } from './PlaceDetailView';

const meta = { title: 'Travel/Place Detail', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithNotes: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const place = {
      ...travelFixture.listings[0],
      notesText: 'Lưu ý giờ tham quan.\n\nĐi theo lối vào phía đường Bạch Đằng.',
    };
    return <PlaceDetailView t={t} locale={locale} listing={place} />;
  },
};

export const Sparse: Story = {
  render: () => {
    const { t, locale } = useTranslations('travel');
    const place = listing('sparse', { rating: null, mapsUrl: null, notesText: null, visitProfile: null });
    return <PlaceDetailView t={t} locale={locale} listing={place} />;
  },
};
