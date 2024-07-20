import { node } from '../../../utils/selector';
import { PopUpState } from './search/searchUtils';

export const popUpBodyPoiContainerId = 'pop-up-body-poi-container';
export const controlsSelector = '.maplibregl-ctrl-bottom-right';

export const calculatePopUpHeight = (id: string, state: PopUpState) => {
  const popUp = document.getElementById(id);
  if (!popUp) return;
  switch (state) {
    case 'opened':
      popUp.style.height = '100%';
      break;
    case 'closed':
      popUp.style.height = '3.5rem'; // h-14
      break;
    case 'middle': {
      const poiContainer = document.getElementById(popUpBodyPoiContainerId);
      const height = poiContainer?.clientHeight ?? 0;
      popUp.style.height = `calc(${height}px + 2.5rem)`;
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
