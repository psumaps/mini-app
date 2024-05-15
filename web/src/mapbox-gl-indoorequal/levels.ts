import { MapGeoJSONFeature } from 'maplibre-gl';

export default function findAllLevels(features: MapGeoJSONFeature[]): string[] {
  return [
    ...new Set(
      features
        .filter((f) => f.properties.class !== 'level')
        .map((s) => s.properties.level as string)
        .sort(),
    ),
  ];
}
