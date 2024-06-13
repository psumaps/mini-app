import type { Meta, StoryObj } from '@storybook/react';
import userCard from '../components/profile/userCard';

const meta: Meta<typeof userCard> = {
  title: 'Profile/User card',
  component: userCard,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
