import { Polygon, Position } from 'geojson';

export default interface Poi {
  geometry: Polygon | Position;
  properties: {
    class?: string; // should be room|corridor|area
    id: string;
    indoor?: number;
    level?: string;
    name: string;
    ref?: string; // room number
    subclass?: string;
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
