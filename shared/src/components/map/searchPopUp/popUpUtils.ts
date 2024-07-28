import Poi from '../../../network/models/mapi/poi';
import { node } from '../../../utils/selector';
import { PopUpState } from './search/searchUtils';

export interface PopUpBodyRef {
  search: (value: string) => void;
  current: HTMLInputElement | null;
}

export interface SearchPopUpRef {
  search: (query: string) => void;
}

export const popUpBodyPoiContainerId = 'pop-up-body-poi-container';
export const popUpSearchInputId = 'pop-up-search-input';
export const controlsSelector = '.maplibregl-ctrl-bottom-right';

export const calculatePopUpHeight = (
  id: string,
  state: PopUpState,
  selectedPoi: Poi | null,
) => {
  const popUp = document.getElementById(id);
  if (!popUp) return;
  switch (state) {
    case 'opened':
      popUp.style.height = '100%';
      break;
    case 'closed':
      if (!selectedPoi)
        popUp.style.height = '3.5rem'; // h-14
      else popUp.style.height = '5.5rem';
      break;
    case 'middle': {
      if (!selectedPoi) {
        const searchInput = document.getElementById(popUpSearchInputId);
        if (!searchInput) return;
        const height = searchInput.clientHeight;
        popUp.style.height = `calc(${height}px + 3.5rem)`;
        break;
      }
      const poiContainer = document.getElementById(popUpBodyPoiContainerId);
      const height = poiContainer?.clientHeight ?? 0;
      popUp.style.height = `calc(${height}px + 3rem)`;
      break;
    }
    default:
  }
};

export const calculateControlsMargin = (popUpId: string) => {
  const popUp = document.getElementById(popUpId);
  if (!popUp) return;
  const controls = node(controlsSelector) as HTMLElement;
  if (!controls) return;
  if (popUp.clientHeight >= 300) return;
  controls.animate(
    {
      marginBottom: `calc(${popUp.clientHeight}px + 1rem)`,
    },
    { duration: 200, fill: 'forwards' },
  );
};
