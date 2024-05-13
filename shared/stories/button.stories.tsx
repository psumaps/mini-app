import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button/button";
import React from "react";
import { Icon } from "../components/Icon/icon";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {
  args: {
    children: "Оффлайн",
    className: "text-b w-28 h-8 rounded-fifty",
  },
};
export const Search: Story = {
  args: {
    children: "Поиск",
    className: "h-10 w-56 p rounded-fifty",
  },
};
export const ButtonQR: Story = {
  args: {
    children: <Icon type="QR" />,
    className: "h-10 w-10 rounded-forty",
  },
};
export const ButtonSearch: Story = {
  args: {
    children: <Icon type="Search" />,
    className: "h-10 w-10 rounded-forty",
  },
};
export const ButtonFilter: Story = {
  args: {
    children: <Icon type="Filter" />,
    className: "h-10 w-10 rounded-forty",
  },
};
export const ButtonCalendar: Story = {
  args: {
    children: <Icon type="Calendar" />,
    className: "h-10 w-10 rounded-forty",
  },
};
