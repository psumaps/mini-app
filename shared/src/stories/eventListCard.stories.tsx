import type { Meta, StoryObj } from '@storybook/react';
import event from '../components/timetable/eventListCard';
import { eventDefault, eventLongTitle } from './data/event';

const meta: Meta<typeof event> = {
  title: 'Timetable/Event card',
  component: event,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    event: eventDefault,
  },
};
export const LongTitle: Story = {
  args: {
    event: eventLongTitle,
  },
};
