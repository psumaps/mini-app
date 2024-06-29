import { Point, Polygon } from 'geojson';
import { centerOfMass } from '@turf/center-of-mass';

export const defaultNearCoeff = 0.0001;

export const parseCoordinatesFromGeometry = (geometry: Polygon | Point) => {
  let lt;
  let lg;

  if (geometry.type === 'Point') {
    [lg, lt] = geometry.coordinates;
  } else {
    [lg, lt] = centerOfMass(geometry).geometry.coordinates;
  }

  return { lt, lg };
};
