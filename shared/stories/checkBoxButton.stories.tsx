import {
  CheckBoxButton,
  CheckBoxButtonProps,
} from "../components/button/checkBoxButton";
import React from "react";
import { StoryFn as Story, Meta } from "@storybook/react";

export default {
  title: "Components/CheckBoxButton",
  component: CheckBoxButton,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Template: Story<CheckBoxButtonProps> = (args) => (
  <CheckBoxButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  name: "checkbox",
};
const Templatee: Story<CheckBoxButtonProps> = (args) => (
  <div>
    <CheckBoxButton {...args} />
    <CheckBoxButton {...args} />
  </div>
);

export const Pair = Templatee.bind({});
Pair.args = {
  name: "checkbox",
};
