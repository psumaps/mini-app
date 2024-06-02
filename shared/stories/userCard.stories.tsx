import type { Meta, StoryObj } from '@storybook/react';
import settingsCard from '../components/profile/settingsCard';

const meta: Meta<typeof settingsCard> = {
  title: 'Profile/User card',
  component: settingsCard,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
