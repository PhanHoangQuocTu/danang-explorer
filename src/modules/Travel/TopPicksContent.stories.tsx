import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TopPicksContent } from './TopPicksContent';

const meta = {
  title: 'Travel/Top Picks Content',
  component: TopPicksContent,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div lang='vi' className='max-w-xl'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopPicksContent>;
export default meta;

type Story = StoryObj<typeof meta>;

export const SourceList: Story = {
  args: {
    content: 'Dạo biển buổi sáng (miễn phí)  •  Ghé quán cà phê (chưa xác minh giá)  •  Đi dạo ven sông lúc hoàng hôn',
  },
};

export const PlainParagraph: Story = {
  args: { content: 'Dành buổi sáng tham quan, rồi đi dạo ven sông khi trời mát.' },
};
