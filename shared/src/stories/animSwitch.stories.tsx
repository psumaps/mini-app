import type { Meta, StoryObj } from '@storybook/react';
// eslint-disable-next-line import/no-relative-packages
import Storage from '../../../web/src/app/storage';
import AnimSwitch from '../components/settings/animSwitch';
import StorageDecorator from './decorators/storage';

const meta: Meta<typeof AnimSwitch> = {
  title: 'Settings/Animation switch',
  component: AnimSwitch,
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
    storage: new Storage(),
  },
};
