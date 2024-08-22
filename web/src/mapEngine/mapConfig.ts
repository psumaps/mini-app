import { StyleSpecification } from 'maplibre-gl';
import { ViewState } from 'react-map-gl';
import mapLayers from '~/mapEngine/layers';

const mapStyle: StyleSpecification = {
  version: 8,
  name: 'map',
  sources: {
    indoorequal: {
      tiles: [`${import.meta.env.VITE_URL_IJO42_TILES}pubtiles/{z}/{x}/{y}`],
      maxzoom: 20,
      minzoom: 10,
      bounds: [56.174769, 58.00363, 56.20024, 58.011303],
      type: 'vector',
      volatile: true,
    },
  },
  layers: [
    {
      id: 'Background',
      type: 'background',
      layout: {
        visibility: 'visible',
      },
      paint: {
        'background-color': {
          type: 'interval',
          stops: [
            [6, 'hsl(47,79%,94%)'],
            [14, 'hsl(42,49%,93%)'],
          ],
        },
      },
    },
    ...mapLayers,
  ],
  sprite: `${import.meta.env.VITE_URL_MAP_ASSETS}assets/sprite/indoorequal`,
  glyphs: `${import.meta.env.VITE_URL_MAP_ASSETS}assets/font/{fontstack}/{range}`,
};

export const initialView: ViewState = {
  padding: { top: 0, left: 0, right: 0, bottom: 0 },
  longitude: 56.187188,
  latitude: 58.007469,
  zoom: 16,
  pitch: 20,
  bearing: 20,
};

export type MapConfigProps = {
  clickTolerance: number;
  attributionControl: boolean;
  mapStyle: StyleSpecification;
  minZoom: number;
  style: { width: string; height: string };
  maxBounds: [number, number, number, number];
  validateStyle: boolean;
  refreshExpiredTiles: boolean;
};

export const mapConfig: MapConfigProps = {
  style: { width: '100%', height: '100%' },
  minZoom: 15.5,
  maxBounds: [56.172495, 58.003141, 56.202192, 58.01219],
  mapStyle,
  clickTolerance: 10,
  refreshExpiredTiles: false,
  validateStyle: false,
  attributionControl: false,
};
