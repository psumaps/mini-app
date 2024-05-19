import CheckableButton, {
  CheckableButtonProps,
} from "../components/common/checkableButton";
import React from "react";
import { StoryFn as Story, Meta } from "@storybook/react";

export default {
  title: "Common/Checkable button",
  component: CheckableButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["radio", "checkbox"],
      control: { type: "radio" },
    },
  },
} as Meta;

const args: CheckableButtonProps = {
  name: "Checkable",
  label: "Радио ",
  type: "radio",
};

const Template: Story<CheckableButtonProps> = (args) => (
  <CheckableButton {...args} />
);

export const Default = Template.bind({});
Default.args = args;

const PairTemplate: Story<CheckableButtonProps> = (args) => (
  <div className="flex flex-col gap-4">
    <CheckableButton {...args} />
    <CheckableButton {...args} />
  </div>
);

export const Pair = PairTemplate.bind({});
Pair.args = args;

const TwoPairsTemplate: Story<CheckableButtonProps> = (args) => {
  const { name, label, ...rest } = args;
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6">
      <CheckableButton {...rest} name={`${name}_1`} label={`${label} 1`} />
      <CheckableButton {...rest} name={`${name}_1`} label={`${label} 1`} />
      <CheckableButton {...rest} name={`${name}_2`} label={`${label} 2`} />
      <CheckableButton {...rest} name={`${name}_2`} label={`${label} 2`} />
    </div>
  );
};

export const TwoPairs = TwoPairsTemplate.bind({});
TwoPairs.args = args;
