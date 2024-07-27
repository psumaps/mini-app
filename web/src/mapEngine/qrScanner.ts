import type { Map } from 'maplibre-gl';
import { IControl } from 'react-map-gl/src/types/lib';
import bridge from '@vkontakte/vk-bridge';
import svg from 'psumaps-shared/src/assets/qr.svg';

export default class QrScanner implements IControl<Map> {
  private _container?: HTMLElement;

  private _geolocateButton?: HTMLButtonElement;

  private readonly callback: (code: string) => void;

  constructor(cb: (code: string) => void) {
    this.callback = cb;
  }

  public create<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    className?: string,
    container?: HTMLElement,
  ): HTMLElementTagNameMap[K] {
    const el = window.document.createElement(tagName);
    if (className !== undefined) el.className = className;
    if (container) container.appendChild(el);
    return el;
  }

  onAdd() {
    this._container = document.createElement('div');
    this._container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
    this._geolocateButton = this.create('button', undefined, this._container);
    const img = this.create('img', undefined, this._geolocateButton);
    img.style.margin = '0 auto';
    img.src = svg;
    this._geolocateButton.type = 'button';
    this._geolocateButton.title = 'QR Scanner';
    this._geolocateButton.setAttribute('aria-label', 'QR Scanner');
    this._geolocateButton.addEventListener(
      'click',
      () =>
        void bridge.send('VKWebAppOpenCodeReader').then((data) => {
          if (data?.code_data) {
            this.callback(
              data.code_data.slice(data.code_data.lastIndexOf('#') + 1), // https://vk.com/apps...#q=512/2
            );
          }
        }),
    );
    return this._container;
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container);
  }
}
