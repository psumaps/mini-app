import type { Meta, StoryObj } from '@storybook/react';
import TimetableCard from '../components/timetable/timetableCard';

const meta: Meta<typeof TimetableCard> = {
  title: 'Timetable/Timetable card ',
  component: TimetableCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    classData: {
      classId: '1',
      discipline: 'Электричество и магнетизм',
      type: '(лек)',
      place: '1 корпус, 3 этаж, 341/1 ауд.',
      teacher: 'Бабушкин И.А.',
      time: '8:00',
      date: '2023-09-14T08:00:00',
    },
  },
};
export const LongDiscipline: Story = {
  args: {
    classData: {
      classId: '2',
      discipline: 'Численные методы моделирования радиоэлектронных схем',
      type: '(практика)',
      place: '1 корпус, 3 этаж, 341/1 ауд.',
      teacher: 'Бабушкин И.А.',
      time: '19:30',
      date: '2023-09-14T19:30:00',
    },
  },
};
const now = new Date();
export const ClassStarted: Story = {
  args: {
    classData: {
      classId: '341/1',
      discipline: 'Численные методы моделирования радиоэлектронных схем',
      type: '(практика)',
      place: '1 корпус, 3 этаж, 341/1 ауд.',
      teacher: 'Бабушкин И.А.',
      time: now.toLocaleTimeString('ru', {
        hour: 'numeric',
        minute: 'numeric',
      }),
      date: now.toISOString(),
    },
  },
};
export const Error: Story = {
  args: {
    classData: {
      classId: '5',
      discipline: 'Численные методы моделирования радиоэлектронных схем',
      type: '(практика)',
      place: '1 корпус, 3 этаж, 341/1 ауд.',
      teacher: 'Бабушкин И.А.',
      time: '19:30',
      date: '2023-09-14T19:30:00',
    },
  },
};
