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
    case 'unauthorized':
      popUp.style.height = '5rem'; // h-14
      break;
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

const parseHashParams = (redirectHash: string): Map<string, string> => {
  return redirectHash.split('&').reduce((accumulator, singleQueryParam) => {
    const [key, value] = singleQueryParam.split('=');
    accumulator.set(key, decodeURIComponent(value));
    return accumulator;
  }, new Map<string, string>());
};

const handleICalParam = (
  ical_token: string,
  resetToken: ((s: string) => void) | undefined,
) => {
  if (resetToken) {
    resetToken(ical_token);
  } else console.log('ICal param not applicable');
};

// обработка выбора indoor-poi по имени
const handleIndoorByName = async (
  query: string,
  token: string | undefined,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
) => {
  // лишь поиск по имени не возможен без авторизации
  if (!token) {
    console.log('unauthorized'); // todo: make toast
    return;
  }

  const data = await httpClient.mapi.search(query, token);
  if (data.length === 0) {
    console.error('POI not found');
  } else if (data.length === 1) {
    handleSelect(data[0]);
  } else {
    handleSearch(query);
  }
};

// обработка indoor-poi по id
const handleIndoorById = async (
  id: string,
  token: string | null | undefined,
  handleSelect: (poi: Poi) => void,
) => {
  const poi = await (token
    ? httpClient.mapi.getIndoorById(id, token)
    : httpClient.mapi.getPublicIndoorById(id));
  if (poi) {
    handleSelect(poi);
  } else {
    console.error('POI not found'); // todo: make toast on nil token
  }
};

// переход к вкладке с событием `eventId`
const handleEventById = (eventId: string) => {
  history.pushState({}, '', `/event/${eventId}`);
  history.go();
};

/*
обрабатываются deep-link в hash-params (vk-miniapp compatibility)
одновременно могут быть использованы лишь `ical` и любой из `q`, `i`, `e`, либо один любой

- `ical=(\w+)` - устанавливает текущий токен ical в $1. Вызывает перезагрузку страницы
- `q=([\wА-Яа-яёЁ\s]+)` - ищет indoor-poi по имени $1
- `i=(\d+)` - ищет indoor-poi по id $1
- `e=(\d+)` - переходит к событию с id $1
*/
export const handleRedirect = async (
  redirectHash: string,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
  token: string | undefined,
  resetToken: ((s: string) => void) | undefined,
) => {
  const hashParams = parseHashParams(redirectHash);

  if (hashParams.has('ical')) {
    handleICalParam(hashParams.get('ical')!, resetToken);
  }

  if (hashParams.has('q')) {
    await handleIndoorByName(
      hashParams.get('q')!,
      token,
      handleSelect,
      handleSearch,
    );
  } else if (hashParams.has('i')) {
    await handleIndoorById(hashParams.get('i')!, token, handleSelect);
  } else if (hashParams.has('e')) {
    handleEventById(hashParams.get('e')!);
  }
};
export const handleLocationHash = (
  hash: string,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
  token: string | undefined,
  resetToken: (s: string) => void,
) => {
  const redirectHash = hash.slice(1); // hash includes #
  if (redirectHash) {
    void handleRedirect(
      redirectHash,
      handleSelect,
      handleSearch,
      token,
      resetToken,
    );
  }
};
