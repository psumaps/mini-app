import Poi from '../../../network/models/mapi/poi';
import { node } from '../../../utils/selector';
import { PopUpState } from './search/searchUtils';
import httpClient from '../../../network/httpClient';

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
export const handleRedirect = async (
  redirectHash: string,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
) => {
  const hashParams = redirectHash.split('=');
  if (hashParams.length === 2 && hashParams[0].length === 1) {
    let data: Poi[];
    const query = hashParams[1];
    // eslint-disable-next-line default-case
    switch (redirectHash[0]) {
      case 'q': // indoor by name
        data = await httpClient.mapi.search(query);
        if (data.length === 0) {
          console.error('POI not found');
        } else if (data.length === 1) {
          handleSelect(data[0]);
        } else {
          handleSearch(query);
        }
        break;
      case 'i': // indoor by id
        data = [await httpClient.mapi.getIndoorById(query)];
        if (data?.[0]) {
          handleSelect(data[0]);
        } else {
          console.error('POI not found');
        }
        break;
      case 'e': // event by id
        history.pushState({}, '', `/event/${query}`);
        history.go();
        break;
    }
  }
};
export const handleLocationHash = (
  hash: string,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
) => {
  const redirectHash = hash.slice(1); // hash includes #
  if (redirectHash) {
    void handleRedirect(redirectHash, handleSelect, handleSearch);
  }
};
