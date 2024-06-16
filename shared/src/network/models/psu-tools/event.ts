export default interface Event {
  organizer?: string;
  title: string;
  registration_close_datetime?: string;
  registration_link?: string;
  map_link?: string;
  cover_image?: string;
  description: string;
  id: number;
  tag?: string;
  event_date: string;
  location: string;
  number_on_site?: string;
  event_images?: string;
}
