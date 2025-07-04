import Poi from '../../../network/models/mapi/poi';
import { node } from '../../../utils/selector';
import { PopUpState } from './search/searchUtils';

// Типы и интерфейсы
export interface PopUpBodyRef {
  search: (value: string) => void;
  current: HTMLInputElement | null;
}

export interface SearchPopUpRef {
  search: (query: string) => void;
}

// Константы
export const popUpBodyPoiContainerId = 'pop-up-body-poi-container';
export const popUpSearchInputId = 'pop-up-search-input';
export const controlsSelector = '.maplibregl-ctrl-bottom-right';

/**
 * Рассчитывает высоту всплывающего окна в зависимости от состояния
 */
export const calculatePopUpHeight = (
  id: string,
  state: PopUpState,
  selectedPoi: Poi | null,
): void => {
  const popUp = document.getElementById(id);
  if (!popUp) return;

  let height: string;

  switch (state) {
    case 'unauthorized':
      height = '5rem';
      break;
    case 'opened':
      height = '100%';
      break;
    case 'closed':
      height = selectedPoi ? '5.5rem' : '3.5rem';
      break;
    case 'middle': {
      if (!selectedPoi) {
        const searchInput = document.getElementById(popUpSearchInputId);
        if (!searchInput) return;
        height = `calc(${searchInput.clientHeight}px + 3.5rem)`;
      } else {
        const poiContainer = document.getElementById(popUpBodyPoiContainerId);
        const containerHeight = poiContainer?.clientHeight ?? 0;
        height = `calc(${containerHeight}px + 3rem)`;
      }
      break;
    }
    default:
      return;
  }

  // Применяем изменения только если высота изменилась
  if (popUp.style.height !== height) {
    popUp.style.height = height;
  }
};

/**
 * Рассчитывает отступ для элементов управления карты
 */
export const calculateControlsMargin = (popUpId: string): void => {
  const popUp = document.getElementById(popUpId);
  if (!popUp) return;
  const controls = node(controlsSelector) as HTMLElement;
  if (!controls) return;
  // Не меняем отступ, если высота попапа слишком большая
  if (popUp.clientHeight >= 300) return;
  const marginBottom = `calc(${popUp.clientHeight}px + 1rem)`;
  // Используем requestAnimationFrame для оптимизации анимации
  requestAnimationFrame(() => {
    controls.animate({ marginBottom }, { duration: 200, fill: 'forwards' });
  });
};
