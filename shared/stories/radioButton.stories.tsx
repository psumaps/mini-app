import {
  RadioButton,
  RadioButtonProps,
} from "../components/button/radioButton";
import React from "react";
import { StoryFn as Story, Meta } from "@storybook/react";

export default {
  title: "Components/RadioButton",
  component: RadioButton,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Template: Story<RadioButtonProps> = (args) => <RadioButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "radio",
};
const Templatee: Story<RadioButtonProps> = (args) => (
  <div>
    <RadioButton {...args} />
    <RadioButton {...args} />
  </div>
);

export const Pair = Templatee.bind({});
Pair.args = {
  name: "radio",
};
