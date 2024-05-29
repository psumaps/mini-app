import type { Meta, StoryObj } from '@storybook/react';
import Calendar from '../components/timetable/calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Timetable/Calendar',
  component: Calendar,
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
    className: 'w-72 mx-auto',
  },
};

export const Mobile: Story = {
  args: {
    className: 'max-w-[19rem] mx-auto absolute top-0 left-0 right-0 mt-1',
  },
};
