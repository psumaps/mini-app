import debounce from 'debounce';
import arrayEqual from 'array-equal';
import type { Map } from 'maplibre-gl';
import { IControl } from 'react-map-gl/src/types/lib.ts';
import { LayerSpecification } from 'maplibre-gl';
import findAllLevels from './levels';
import LevelControl from './levelControl';
import VectorTileSource from './vectorTileSource';

export interface IndoorEqualsProps {
  url: string;
  apiKey?: string;
  layers?: LayerSpecification[];
}

/**
 * Load the indoor= source and layers in your map.
 * @param {object} map the mapbox-gl/maplibre-gl instance of the map
 * @param {object} options
 * @param {string} [options.url] Override the default tiles URL (https://tiles.indoorequal.org/).
 * @param {object} [options.geojson] GeoJSON data with with key as layer name and value with geojson features
 * @param {string} [options.apiKey] The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
 * @param {array} [options.layers] The layers to be used to style indoor= tiles. Take a look a the [layers.js file](https://github.com/indoorequal/mapbox-gl-indoorequal/blob/master/src/layers.js) file and the [vector schema](https://indoorequal.com/schema)
 * @param {boolean} [options.heatmap] Should the heatmap layer be visible at start (true : visible, false : hidden). Defaults to true/visible.
 * @property {string} level The current level displayed
 * @property {array} levels  The levels that can be displayed in the current view
 * @fires IndoorEqual#levelschange
 * @fires IndoorEqual#levelchange
 * @return {IndoorEqual} `this`
 */
export default class IndoorEqual implements IControl<Map> {
  private source: VectorTileSource;

  private map: Map;

  levels: string[];

  level: string;

  private events: { [x: string]: (() => void)[] };

  private _control?: LevelControl;

  private _updateLevelsDebounce:
    | debounce.DebouncedFunction<() => void>
    | undefined;

  constructor(map: Map, options: IndoorEqualsProps) {
    const SourceKlass = VectorTileSource;
    const defaultOpts = { heatmap: true };
    const opts = { ...defaultOpts, ...options };
    this.source = new SourceKlass(map, options);
    this.map = map;
    this.levels = [];
    this.level = '1';
    this.events = {};

    if (this.map.isStyleLoaded()) {
      this._init();
      this.setHeatmapVisible(opts.heatmap);
    } else {
      void this.map.once('load', () => {
        this._init();
        this.setHeatmapVisible(opts.heatmap);
      });
    }
  }

  /**
   * Remove any layers, source and listeners and controls
   */
  remove() {
    this.source.remove();
    if (this._updateLevelsDebounce === undefined)
      throw new Error('updateLevelsDebounce is undefined');
    this._updateLevelsDebounce.clear();
    this.map.off('load', this._updateLevelsDebounce);
    this.map.off('data', this._updateLevelsDebounce);
    this.map.off('move', this._updateLevelsDebounce);
    if (this._control) {
      this.onRemove();
    }
  }

  /**
   * Add an event listener
   * @param {string} name the name of the event
   * @param {function} fn the function to be called when the event is emitted
   */
  on(name: string, fn: () => void) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(fn);
  }

  /**
   * Remove an event listener.
   * @param {string} name the name of the event
   * @param {function} fn the same function when on() was called
   */
  off(name: string, fn: () => void) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name] = this.events[name].filter((cb) => cb !== fn);
  }

  /**
   * Add the level control to the map
   * Used when adding the control via the map instance: map.addControl(indoorEqual)
   */
  onAdd() {
    if (!this._control) this._control = new LevelControl(this);
    return this._control.container;
  }

  /**
   * Remove the level control
   * Used when removing the control via the map instance: map.removeControl(indoorEqual)
   */
  onRemove() {
    this._control?.destroy();
    this._control = undefined;
  }

  /**
   * Set the displayed level.
   * @param {string} level the level to be displayed
   * @fires IndoorEqual#levelchange
   */
  setLevel(level: string) {
    this.level = level;
    this._updateFilters();
    this._emitLevelChange();
  }

  /**
   * Set the displayed level.
   * @deprecated Use setLevel instead
   * @param {string} level the level to be displayed
   * @fires IndoorEqual#levelchange
   */
  updateLevel(level: string) {
    console.log(
      'The updateLevel method is deprecated. Please use setLevel instead.',
    );
    this.setLevel(level);
  }

  /**
   * Change the heatmap layer visibility
   * @param {boolean} visible True to make it visible, false to hide it
   */
  setHeatmapVisible(visible: boolean) {
    if (this.map.getLayer('indoor-heat')) {
      this.map.setLayoutProperty(
        'indoor-heat',
        'visibility',
        visible ? 'visible' : 'none',
      );
    }
  }

  _init() {
    this.source.addSource();
    this.source.addLayers();
    this._updateFilters();
    this._updateLevelsDebounce = debounce(this._updateLevels.bind(this), 300);

    this.map.on('load', this._updateLevelsDebounce);
    this.map.on('data', this._updateLevelsDebounce);
    this.map.on('move', this._updateLevelsDebounce);
    this.map.on('remove', () => {
      this.remove();
    });
  }

  _updateFilters() {
    this.source.layers
      .filter((layer) => layer.type !== 'heatmap')
      .forEach((layer) => {
        this.map.setFilter(layer.id, [
          ...(layer.filter || ['all']),
          ['==', 'level', this.level],
        ]);
      });
  }

  _refreshAfterLevelsUpdate() {
    if (!this.levels.includes(this.level)) {
      this.setLevel('1');
    }
  }

  _updateLevels() {
    if (this.map.getSource(this.source.sourceId)) {
      const features = this.map.querySourceFeatures(this.source.sourceId, {
        sourceLayer: 'area',
      });
      const levels = findAllLevels(features);
      if (!arrayEqual(levels, this.levels)) {
        this.levels = levels;
        this._emitLevelsChange();
        this._refreshAfterLevelsUpdate();
        this._control?.refresh();
      }
    }
  }

  _emitLevelsChange() {
    this._emitEvent('levelschange', this.levels);
  }

  _emitLevelChange() {
    this._emitEvent('levelchange', this.level);
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  _emitEvent(eventName: string, ...args: any[]) {
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-argument
    (this.events[eventName] || []).forEach((fn) => fn(...args));
  }
}
