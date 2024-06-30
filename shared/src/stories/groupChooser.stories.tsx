/// <reference types="vite-plugin-svgr/client" />
import type { Meta, StoryObj } from '@storybook/react';
// eslint-disable-next-line import/no-relative-packages
import Storage from '../../../web/src/app/storage';
import GroupChooser from '../components/settings/groupChooser';
import StorageDecorator from './decorators/storage';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const meta = {
  title: 'Settings/GroupChooser',
  component: GroupChooser,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [StorageDecorator],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof GroupChooser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    storage: new Storage(),
  },
};

export const Mobile: Story = {
  args: {
    storage: new Storage(),
    className: 'max-w-[19rem] mx-auto absolute top-0 left-0 right-0 mt-1',
  },
};
