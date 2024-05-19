import {
  CheckBox,
  CheckBoxProps,
} from "../components/common/checkBox";
import React from "react";
import { StoryFn as Story, Meta } from "@storybook/react";

export default {
  title: "Common/Checkbox",
  component: CheckBox,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Template: Story<CheckBoxProps> = (args) => (
  <CheckBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
  name: "checkbox",
};
const Templatee: Story<CheckBoxProps> = (args) => (
  <div>
    <CheckBox {...args} />
    <CheckBox {...args} />
  </div>
);

export const Pair = Templatee.bind({});
Pair.args = {
  name: "checkbox",
};
