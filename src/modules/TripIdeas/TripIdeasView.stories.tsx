import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useTranslations } from '@/hooks';

import { phaseSixFixture } from '../Travel/__tests__/phase-six-fixture';
import { TripIdeasView } from './TripIdeasView';

const meta = { title: 'Travel/Trip Ideas', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Hub: Story = {
  render: () => {
    const { t } = useTranslations('travel');
    return <TripIdeasView t={t} editorial={phaseSixFixture.editorial} />;
  },
};

export const SourceUnavailable: Story = {
  render: () => {
    const { t } = useTranslations('travel');
    return <TripIdeasView t={t} editorial={null} />;
  },
};
