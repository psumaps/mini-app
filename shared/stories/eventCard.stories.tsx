import type { Meta, StoryObj } from "@storybook/react";
import eventCard from "../components/event/eventCard";


const meta: Meta<typeof eventCard> = {
  title: "Event-description/Event card",
  component: eventCard,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  argTypes: {
    organizer: {
      type: "string",
      description: "Организатор мероприятия",
    },

    title: {
      type: "string",
      description: "Название мероприятия",
    },

    registration_close_datetime: {
      type: "string",
      description: "Время закрытия регистрации",
    },

    registration_link: {
      type: "string",
      description: "Ссылка на регистрацию",
    },
    map_link: {
      type: "string",
      description: "Ссылка на карту",
    },

    cover_image: {
      type: "string",
      description: "Обложка мероприятия",
    },

    description: {
      type: "string",
      description: "Описание мероприятия",
    },

    id: {
      type: "number",
      description: "ID мероприятия",
    },

    tag: {
      type: "string",
      description: "Тег мероприятия",
    },

    event_date: {
      type: Date,
      description: "Дата и время начала мероприятия",
    },

    location: {
      type: "string",
      description: "Место проведения мероприятия",
    },

    number_on_site: {
      type: "string",
      description: "Номер на сайте",
    },

    event_images: {
      type: "string",
      description: "Изображения мероприятия 2",
    },


  },
};

export default meta;
type Story = StoryObj<typeof meta>;



export const Default: Story = {
  args: {
    organizer: "PSU-TOOLS TEAM",
    title: "Малая весна ПГНИУ",
    registration_close_datetime: undefined,
    registration_link: "https://github.com/PSUMaps",
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
};
