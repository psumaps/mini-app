import type { Meta, StoryObj } from '@storybook/react';
import TimetableCard from '../components/timetable/timetableCard';

const meta: Meta<typeof TimetableCard> = {
  title: 'Timetable/Timetable Card ',
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
      classNumber: '341/1',
      discipline: 'Электричество и магнетизм',
      type: '(лек)',
      place: '1 корпус, 3 этаж',
      teacher: 'Бабушкин И.А.',
    },
    classDate: {
      date: '2023-09-14T08:00:00',
      dayOfWeek: '',
      classes: [],
    },
  },
};
export const LongDiscipline: Story = {
  args: {
    classData: {
      classNumber: '341/1',
      discipline: 'Численные методы моделирования радиоэлектронных схем',
      type: '(практика)',
      place: '1 корпус, 3 этаж',
      teacher: 'Бабушкин И.А.',
    },
    classDate: {
      date: '2023-09-14T19:30:00',
      dayOfWeek: '',
      classes: [],
    },
  },
};
const now = new Date();
export const ClassStarted: Story = {
  args: {
    classData: {
      classNumber: '341/1',
      discipline: 'Численные методы моделирования радиоэлектронных схем',
      type: '(практика)',
      place: '1 корпус, 3 этаж',
      teacher: 'Бабушкин И.А.',
    },
    classDate: {
      date: now.toISOString(),
      dayOfWeek: '',
      classes: [],
    },
  },
};
