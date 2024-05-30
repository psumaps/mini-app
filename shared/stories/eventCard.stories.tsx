import type { Meta, StoryObj } from "@storybook/react";
import eventCard from "../components/timetable/eventCard";
//import {reactRouterParameters, withRouter} from "storybook-addon-remix-react-router";


const meta: Meta<typeof eventCard> = {
  title: "Event-description/Event card",
  component: eventCard,
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
    event: {
      organizer: "Описание",
      title: "Малая весна ПГНИУ",
      registration_close_datetime: undefined,
      registration_link: "https://github.com/PSUMaps",
      map_link: "https://github.com/PSUMaps",
      cover_image:
      "https://cdn.culture.ru/images/b2a75295-f894-5d0c-8d3c-22ee5448220e",
      description:
          "Присоединяйтесь к нам и прославите яркую энергию весны на нашем ежегодном университетском концерте «Малая весна». Целью этого мероприятия",
      id: 106,
      tag: "Концерт",
      event_date: new Date("2023-09-14T16:00:00"),
      location: "Большой зал СДК ПГНИУ, 7 корп.",
      number_on_site: undefined,
      event_images: undefined,
    }
  }
};
export const Default2: Story = {
  args: {
    event: {
      organizer: "PSU-TOOLS TEAM",
      title: "Малая весна ПГНИУ",
      registration_close_datetime: undefined,
      registration_link: undefined,
      map_link: "https://github.com/PSUMaps",
      cover_image:
          "https://res.cloudinary.com/practicaldev/image/fetch/s--xG1gcsyJ--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/h68x0up43hmknl5tjcww.jpg",
      description:
          "Присоединяйтесь к нам и прославите яркую энергию весны на нашем ежегодном университетском концерте «Малая весна». Целью этого мероприятия",
      id: 106,
      tag: "Технологии и инновации",
      event_date: new Date("2024-05-15T00:01:00"),
      location: "Большой зал СДК ПГНИУ, 7 корп.",
      number_on_site: undefined,
      event_images: undefined,
    }
  }
};
