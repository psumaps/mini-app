import IndoorEqual from "~/mapbox-gl-indoorequal/indoorEqual.ts";
import 'maplibre-gl/dist/maplibre-gl.css';

export default class LevelControl {
  private indoorequal: IndoorEqual;
  public _cbRefresh: () => void;
  readonly container: HTMLDivElement;
  constructor(indoorequal: IndoorEqual) {
    this.indoorequal = indoorequal;
    this._cbRefresh = () => this._refresh();
    this.indoorequal.on('levelschange', this._cbRefresh);
    this.indoorequal.on('levelchange', this._cbRefresh);
    this.container = document.createElement('div');
    this.container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');

    ["1", "2", "3", "4", "5"].forEach(
        (s) => {
          const button = document.createElement('button')
          button.name = s;
          const t = document.createTextNode(s);
          button.appendChild(t);
          button.title  = button.value = s;
          button.addEventListener('click', () => {
            indoorequal.setLevel(s)
          });
          button.classList.add('maplibregl-ctrl-icon');
          this.container.appendChild(
              button
          )
        }
    )
  }

  destroy() {
    this.container.parentNode?.removeChild(this.container);
    this.indoorequal.off('levelschange', this._cbRefresh);
    this.indoorequal.off('levelchange', this._cbRefresh);
  }

  _refresh() {
    // this.container.innerHTML = '';
    this.indoorequal.levels.forEach((level) => {
      const button = document.createElement('button')
      button.name = level;
      button.title  = button.value = level;
      button.addEventListener('click', () => {
        this.indoorequal.setLevel(level);
      });
      button.classList.add('maplibregl-ctrl-icon');
      this.container.appendChild(
          button
      )
    });
  }
}
