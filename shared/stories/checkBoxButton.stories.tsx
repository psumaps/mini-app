import { CheckBox } from "../components/common/checkBoxButton";
import React from "react";
import { StoryFn as Story, Meta } from "@storybook/react";

export default {
  title: "Components/CheckBox",
  component: CheckBox,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Template: Story = (args) => <CheckBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "checkbox",
};
const Templatee: Story = (args) => (
  <div>
    <CheckBox {...args} />
    <CheckBox {...args} />
  </div>
);

export const Pair = Templatee.bind({});
Pair.args = {
  name: "checkbox",
};
