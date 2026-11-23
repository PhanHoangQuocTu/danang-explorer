import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TravelRefreshButton } from './TravelRefreshButton';

const meta = {
  title: 'Layouts/Travel Refresh',
  component: TravelRefreshButton,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TravelRefreshButton>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
