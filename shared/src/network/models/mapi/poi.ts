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
      amenity?: string;
      indoor?: string;
      level?: string;
      name?: string;
      wheelchair?: 'yes';
    };
    type: string;
  };
}

export const detectPoiName = (poi: Poi | null) => {
  if (!poi) return '';
  return poi.properties.name ?? poi.properties.ref ?? 'Без названия';
};
