import { Polygon, Position } from 'geojson';

export default interface Poi {
  geometry: Polygon | Position;
  properties: {
    class?: unknown;
    id: string;
    indoor?: number;
    level?: string;
    name: string;
    ref?: unknown;
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
