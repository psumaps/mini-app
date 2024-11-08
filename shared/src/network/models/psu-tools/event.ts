export default interface Event {
  id: number;
  name: string;
  description: string;
  place: Place;
  organizers: Organizer[];
  startDatetime: string;
  endDatetime?: string;
  aboutUrl?: string;
  registrationUrl?: string;
  registrationCloseDatetime?: string;
  tags: string[];
  cover: string;
  photos: [];
}

export interface Cover {
  id: number;
  name: string;
  url: string;
}

export interface Place {
  id: number;
  mapsId: number;
  name: string;
  description: string;
  cover: Cover;
  photos: [];
}

export interface Organizer {
  id: number;
  name: string;
  description: string;
  photo?: Cover;
}
