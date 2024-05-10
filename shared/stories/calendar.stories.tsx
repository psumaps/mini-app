import type { Meta, StoryObj } from "@storybook/react";
import Calendar from "../components/timetable/calendar";

const meta: Meta<typeof Calendar> = {
  title: "Timetable/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-60"
  }
};
