import type { Meta, StoryObj } from '@storybook/react';
import userCard from '../components/settings/userCard';
import StorageDecorator from './decorators/storage';

const meta: Meta<typeof userCard> = {
  title: 'Settings/User card ',
  component: userCard,
  tags: ['autodocs'],
  decorators: [StorageDecorator],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
