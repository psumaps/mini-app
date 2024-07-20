import { Point, Polygon } from 'geojson';

export default interface Poi {
  geometry: Polygon | Point;
  properties: {
    class?: string; // should be room|corridor|area
    id: string;
    indoor?: number;
    level?: string;
    name?: string;
    ref?: string; // room number
    subclass?: string;
    similarity?: number;
    tags: {
      corpus?: string;
      building?: string;
      amenity?: string;
      indoor?: string;
      level?: string;
      name?: string;
      opening_hours?: string;
      wheelchair?: 'yes';
    };
    type: string;
  };
}

export const detectPoiName = (poi: Poi | null) => {
  if (!poi) return '';
  return poi.properties.name ?? poi.properties.ref ?? 'Без названия';
};

const translations: { [key: string]: string } = {
  Mo: 'Пн',
  Tu: 'Вт',
  We: 'Ср',
  Th: 'Чт',
  Fr: 'Пт',
  Sa: 'Сб',
  Su: 'Вс',
};
const weekdayRegex = /\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/g;

export const translateOpeningHours = (hours: string) => {
  return hours.replace(weekdayRegex, (match) => translations[match]);
};
