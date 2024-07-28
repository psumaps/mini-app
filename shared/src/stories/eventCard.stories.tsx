import type { Meta, StoryObj } from '@storybook/react';
import eventCard from '../components/timetable/eventCard';
import { eventDefault, eventLongTitle, eventOrganizers } from './data/event';
import StorageDecorator from './decorators/storage';

const meta: Meta<typeof eventCard> = {
  title: 'Timetable/Event desc',
  component: eventCard,
  tags: ['autodocs'],
  decorators: [StorageDecorator],
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
export const LongTag: Story = {
  args: {
    event: eventLongTitle,
  },
};
export const Organizers: Story = {
  args: {
    event: eventOrganizers,
  },
};
