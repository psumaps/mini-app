/// <reference types="vite-plugin-svgr/client" />
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from '../components/common/button';
import SearchIcon from '../assets/search.svg?react';
import StorageDecorator from './decorators/storage';

const meta = {
  title: 'Common/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [StorageDecorator],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {
  args: {
    children: 'Оффлайн',
    className: 'w-28 h-8 rounded-fifty',
  },
};
export const Search: Story = {
  args: {
    children: 'Поиск',
    className: 'h-10 w-56 rounded-fifty',
  },
};
export const Icon: Story = {
  args: {
    children: <SearchIcon />,
    className: 'h-10 w-10 rounded-forty',
  },
};
