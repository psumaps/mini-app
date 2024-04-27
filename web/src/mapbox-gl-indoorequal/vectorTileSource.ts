import { layers, LayerType } from './layers';
import { MapInstance } from 'react-map-gl/dist/esm/types';
import { IndoorEqualsProps } from '~/mapbox-gl-indoorequal/indoorEqual.ts';

export class VectorTileSource {
  private map: MapInstance;
  private readonly url: string;
  private readonly apiKey?: string;
  sourceId: string;
  layers: LayerType[];

  constructor(map: MapInstance, options: IndoorEqualsProps = {}) {
    const defaultOpts = { url: 'https://tiles.indoorequal.org/', layers };
    const opts = { ...defaultOpts, ...options };
    this.map = map;
    this.url = opts.url;
    this.apiKey = opts.apiKey;
    this.layers = layers;
    this.sourceId = 'indoorequal';
  }

  addSource() {
    const queryParams = this.apiKey ? `?key=${this.apiKey}` : '';
    this.map.addSource(this.sourceId, {
      type: 'vector',
      url: `${this.url}${queryParams}`,
    });
  }

  addLayers() {
    this.layers.forEach((layer) => {
      this.map.addLayer({
        source: this.sourceId,
        ...layer,
      });
    });
  }

  remove() {
    this.layers.forEach((layer) => {
      this.map?.removeLayer(layer.id);
    });
    this.map?.removeSource(this.sourceId);
  }
}
