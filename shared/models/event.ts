export type Event = {
  organizer?: string;
  title: string;
  registration_close_datetime?: string;
  registration_link?: string;
  map_link?: string;
  cover_image?: string;
  description: string;
  id: number;
  tag?: string;
  event_date: Date;
  location: string;
  number_on_site?: string;
  event_images?: string;
};
