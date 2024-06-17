import { Point, Polygon } from 'geojson';

export const defaultNearCoeff = 0.0001;

export const parseCoordinatesFromGeometry = (geometry: Polygon | Point) => {
  let lt;
  let lg;

  if (geometry.type === 'Point') {
    [lg, lt] = geometry.coordinates;
  } else {
    const lgSum = geometry.coordinates[0].reduce((a, b) => a + b[0], 0);
    const ltSum = geometry.coordinates[0].reduce((a, b) => a + b[1], 0);
    lt = ltSum / geometry.coordinates[0].length;
    lg = lgSum / geometry.coordinates[0].length;
  }

  return { lt, lg };
};
