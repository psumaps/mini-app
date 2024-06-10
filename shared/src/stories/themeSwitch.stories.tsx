import type { Meta, StoryObj } from '@storybook/react';
import Storage from '../../../web/src/app/storage';
import ThemeSwitch from '../components/common/themeSwitch';

const meta: Meta<typeof ThemeSwitch> = {
  title: 'Common/Theme switch',
  component: ThemeSwitch,
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
    storage: new Storage(),
  },
};
