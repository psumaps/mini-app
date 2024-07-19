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
  organizers?: [
    {
      id: number;
      name: string;
      description: string;
      photo: { id: number; name: string; url: string };
    },
  ];
  startDatetime: string;
  endDatetime?: string;
  registrationUrl?: string;
  registrationCloseDatetime?: string;
  tags: string[];
  cover: string;
  photos: [];
}
