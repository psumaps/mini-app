import type { Map } from 'maplibre-gl';
import { IControl } from 'react-map-gl/src/types/lib';
import bridge from '@vkontakte/vk-bridge';
import svg from 'psumaps-shared/src/assets/qr.svg';
import { BridgeType } from 'psumaps-shared/src/models/storage';
import { qrScanner } from '@telegram-apps/sdk-react';

export default class QrScanner implements IControl<Map> {
  private _container?: HTMLElement;

  private _geolocateButton?: HTMLButtonElement;

  private readonly callback: (code: string) => void;

  private readonly bridgeType: BridgeType;

  constructor(cb: (code: string) => void, bridgeType: BridgeType) {
    this.callback = cb;
    this.bridgeType = bridgeType;
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
    this._geolocateButton.addEventListener('click', () => {
      if (this.bridgeType === BridgeType.tgconnect) {
        void qrScanner.open({
          text: 'Scan the QR code',
          capture: (code_data: string) => {
            if (code_data) {
              const processedCode = this.processQrCode(code_data);
              this.callback(processedCode);
              qrScanner.close();
              return true;
            }
            return false;
          },
        });
      } else if (this.bridgeType === BridgeType.vkbridge) {
        void bridge.send('VKWebAppOpenCodeReader').then((data) => {
          if (data?.code_data) {
            const processedCode = this.processQrCode(data.code_data); // https://vk.com/apps...#q=512/2
            this.callback(processedCode);
          }
        });
      }
    });

    return this._container;
  }

  /**
   * Process QR code data to extract the relevant part
   * @param code_data Raw QR code data
   * @returns Processed QR code data
   */
  private processQrCode(code_data: string): string {
    if (!code_data) return '';

    try {
      // Проверяем, является ли код URL
      let url: URL;
      try {
        url = new URL(code_data);
      } catch {
        // Если это не URL, возвращаем как есть
        return code_data;
      }

      // Если есть хэш, возвращаем его без #
      if (url.hash && url.hash.length > 1) {
        return url.hash.substring(1);
      }

      // Если есть параметры запроса, возвращаем их без ?
      if (url.search && url.search.length > 1) {
        return url.search.substring(1);
      }

      // Если нет ни хэша, ни параметров, возвращаем весь код
      return code_data;
    } catch (error) {
      return code_data;
    }
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container);
  }
}
