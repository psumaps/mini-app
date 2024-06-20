import React from 'react';
import { StoryFn, Meta, StoryObj } from '@storybook/react';
import Checkable, {
  CheckableProps,
  Radio,
  Checkbox,
} from '../components/common/checkable';
import StorageDecorator from './decorators/storage';

const meta = {
  title: 'Common/Checkable',
  component: Checkable,
  // @ts-expect-error subcomonents are supported badly
  subcomponents: { Radio, Checkbox },
  parameters: {
    layout: 'centered',
  },
  decorators: [StorageDecorator],
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['radio', 'checkbox'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Checkable>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonArgs: CheckableProps = {
  name: 'Checkable',
  label: 'Радио ',
  type: 'radio',
};

export const DefaultRadio: Story = {
  render: (args) => <Radio {...args} />,
  args: {
    type: 'radio',
  },
};

export const DefaultCheckbox: Story = {
  render: (args) => <Checkbox {...args} />,
  args: {
    type: 'checkbox',
  },
};

const PairTemplate: StoryFn<CheckableProps> = (args) => (
  <div className="flex flex-col gap-4">
    <Checkable {...args} />
    <Checkable {...args} />
  </div>
);

export const Pair = PairTemplate.bind({});
Pair.args = commonArgs;

const TwoPairsTemplate: StoryFn<CheckableProps> = (args) => {
  const { name, label, ...rest } = args;
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6">
      <Checkable {...rest} name={`${name}_1`} label={`${label} 1`} />
      <Checkable {...rest} name={`${name}_1`} label={`${label} 1`} />
      <Checkable {...rest} name={`${name}_2`} label={`${label} 2`} />
      <Checkable {...rest} name={`${name}_2`} label={`${label} 2`} />
    </div>
  );
};

export const TwoPairs = TwoPairsTemplate.bind({});
TwoPairs.args = commonArgs;
