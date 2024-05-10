import type { Meta, StoryObj } from "@storybook/react";
import { ButtonIcon } from "../components/ButtonIcon/buttonIcon";

const meta = {
  title: "Components/ButtonIcon",
  component: ButtonIcon,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonSearch: Story = {
  args: {
    typeIcon: "Search",
  },
};
export const ButtonFilter: Story = {
  args: {
    typeIcon: "Filter",
  },
};
export const ButtonCalendar: Story = {
  args: {
    typeIcon: "Calendar",
  },
};
export const ButtonQR: Story = {
  args: {
    typeIcon: "QR",
  },
};
