import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual.ts';
import 'maplibre-gl/dist/maplibre-gl.css';

export default class LevelControl {
  private indoorequal: IndoorEqual;

  public _cbRefresh: () => void;

  readonly container: HTMLDivElement;

  constructor(indoorequal: IndoorEqual) {
    this.indoorequal = indoorequal;
    this._cbRefresh = () => this.refresh();
    this.indoorequal.on('levelschange', this._cbRefresh);
    this.indoorequal.on('levelchange', this._cbRefresh);
    this.container = document.createElement('div');
    this.container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
  }

  destroy() {
    this.container.parentNode?.removeChild(this.container);
    this.indoorequal.off('levelschange', this._cbRefresh);
    this.indoorequal.off('levelchange', this._cbRefresh);
  }

  refresh() {
    this.container.innerHTML = '';
    this.indoorequal.levels.forEach((level) => {
      const button = document.createElement('button');
      button.name = level;
      button.appendChild(document.createTextNode(level));
      button.value = level;
      button.title = level;
      button.addEventListener('click', () => {
        this.indoorequal.setLevel(level);
      });
      button.classList.add('maplibregl-ctrl-icon');
      this.container.appendChild(button);
    });
  }
}
