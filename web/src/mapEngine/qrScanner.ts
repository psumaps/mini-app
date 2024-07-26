import type { Map } from 'maplibre-gl';
import { IControl } from 'react-map-gl/src/types/lib';
import bridge from '@vkontakte/vk-bridge';

export default class QrScanner implements IControl<Map> {
  private container: HTMLElement | undefined;

  private readonly callback: (code: string) => void;

  constructor(cb: (code: string) => void) {
    this.callback = cb;
  }

  onAdd() {
    this.container = document.createElement('div');
    this.container.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');

    const button: HTMLButtonElement = document.createElement('button');
    button.appendChild(document.createTextNode('qr'));
    button.value = 'qr';
    button.title = 'qr';
    button.addEventListener('click', () => {
      void bridge.send('VKWebAppOpenCodeReader').then((data) => {
        if (data?.code_data) {
          this.callback(
            data.code_data.slice(data.code_data.lastIndexOf('#') + 1), // https://vk.com/apps...#q=512/2
          );
        }
      });
    });
    button.classList.add('maplibregl-ctrl-icon');
    this.container.appendChild(button);
    return this.container;
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
  }
}
