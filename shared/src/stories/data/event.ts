import type Event from '../../network/models/psu-tools/event';

export const eventDefault: Event = {
  id: 2,
  name: 'Малая весна ПГНИУ',
  description:
    'Присоединяйтесь к нам и прославите яркую энергию весны на нашем ежегодном университетском концерте «Малая весна». Целью этого мероприятия',
  place: {
    id: 1,
    name: 'Большой зал СДК ПГНИУ, 7 корп.',
    description:
      'Кампус Пермского Государственного Национального Исследовательского Университета',
    cover: {
      id: 3,
      name: 'Default place cover',
      url: 'https://psu-tools.ru/gallery/default-place-cover.png',
    },
    photos: [],
  },
  organizers: [],
  startDatetime: '2023-09-14T16:00:00',
  endDatetime: undefined,
  registrationUrl: 'https://psu-tools.ru',
  registrationCloseDatetime: undefined,
  tags: ['Технологии и инновации'],
  cover: 'https://cdn.culture.ru/images/b2a75295-f894-5d0c-8d3c-22ee5448220e',
  photos: [],
};

export const eventLongTitle: Event = {
  id: 1,
  name: 'XVI Всероссийская студенческая научно-практическая конференция «Социальное благополучие человека в условиях новой общественной реальности',
  description:
    'Присоединяйтесь к нам и прославите яркую энергию весны на нашем ежегодном университетском концерте «Малая весна». Целью этого мероприятия',
  place: {
    id: 1,
    name: 'Большой зал СДК ПГНИУ, 7 корп.',
    description:
      'Кампус Пермского Государственного Национального Исследовательского Университета',
    cover: {
      id: 3,
      name: 'Default place cover',
      url: 'https://psu-tools.ru/gallery/default-place-cover.png',
    },
    photos: [],
  },
  organizers: [
    {
      id: 1,
      name: 'PSU-TOOLS TEAM',
      description: 'А здесь описание организатора. Пупупу',
      photo: {
        id: 2,
        name: 'Default organizer photo',
        url: 'http://www.psu.ru/files/images/podrazdeleniya/licey/licej.png',
      },
    },
  ],
  startDatetime: '2024-05-15T00:01:00',
  endDatetime: undefined,
  registrationUrl: 'https://psu-tools.ru',
  registrationCloseDatetime: undefined,
  tags: ['Технологии и инновации'],
  cover:
    'https://cdn.culture.ru/images/17dfa1ca-7963-550e-9a62-cd5b95124b95/c_fill,g_center/01-png',
  photos: [],
};
export const eventOrganizers: Event = {
  id: 3,
  name: 'День открытых дверей в Лицее',
  description: 'День открытых дверей в Лицее ПГНИУ',
  place: {
    id: 1,
    name: 'ПГНИУ',
    description:
      'Кампус Пермского Государственного Национального Исследовательского Университета',
    cover: {
      id: 3,
      name: 'Default place cover',
      url: 'https://psu-tools.ru/gallery/default-place-cover.png',
    },
    photos: [],
  },
  organizers: [
    {
      id: 1,
      name: 'Лицей ПГНИУ',
      description: 'А здесь описание организатора. Пупупу',
      photo: {
        id: 2,
        name: 'Default organizer photo',
        url: 'http://www.psu.ru/files/images/podrazdeleniya/licey/licej.png',
      },
    },
    {
      id: 2,
      name: 'Лицей ПГНИУ',
      description: 'А здесь описание организатора. Пупупу',
      photo: undefined,
    },
  ],
  startDatetime: '2024-09-01T00:00:00',
  endDatetime: undefined,
  registrationUrl: 'https://psu-tools.ru',
  registrationCloseDatetime: undefined,
  tags: ['Лицей', 'Образование', 'Технологии и инновации', 'Наука'],
  cover: 'https://cdn.culture.ru/images/b2a75295-f894-5d0c-8d3c-22ee5448220e',
  photos: [],
};
