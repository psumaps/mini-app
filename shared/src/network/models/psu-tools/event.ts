export default interface Event {
  id: number;
  name: string;
  description: string;
  place: {
    id: number;
    name: string;
    description: string;
    cover: { id: number; name: string; url: string };
    photos: [];
  };
  organizers: Organizer[];
  startDatetime: string;
  endDatetime?: string;
  registrationUrl?: string;
  registrationCloseDatetime?: string;
  tags: string[];
  cover: string;
  photos: [];
}

export interface Organizer {
  id: number;
  name: string;
  description: string;
  photo?: { id: number; name: string; url: string };
}
