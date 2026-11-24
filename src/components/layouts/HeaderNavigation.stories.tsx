import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeaderNavigation } from './HeaderNavigation';

const meta = {
  title: 'Layouts/Header Navigation',
  component: HeaderNavigation,
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: '/areas/son-tra' } }, layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className='flex items-center justify-between bg-background p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderNavigation>;
export default meta;
export const Default: StoryObj<typeof meta> = { args: { showTravelRefresh: true } };
