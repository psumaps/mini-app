import type { Meta, StoryObj } from '@storybook/react';
import PoiInfoDetails from '../components/map/searchPopUp/poiInfoDetails';
import StorageDecorator from './decorators/storage';
import { poiWithHours } from './data/poi';

const meta: Meta<typeof PoiInfoDetails> = {
  title: 'Map/Poi info details',
  component: PoiInfoDetails,
  tags: ['autodocs'],
  decorators: [StorageDecorator],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // @ts-expect-error stupid ts
    item: poiWithHours,
    onClick: () => {},
    className: 'w-72',
  },
};

export const MultipleIntervals: Story = {
  args: {
    item: {
      ...poiWithHours,
      // @ts-expect-error stupid ts
      properties: {
        ...poiWithHours.properties,
        tags: {
          ...poiWithHours.properties.tags,
          opening_hours: 'Mo-Fr 08:00-12:00, Sa 09:00-12:00, Su 10:00-12:00',
        },
      },
    },
    onClick: () => {},
    className: 'w-72',
  },
};
