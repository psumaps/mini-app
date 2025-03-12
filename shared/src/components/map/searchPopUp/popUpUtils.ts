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

export interface RedirectResult {
  success: boolean;
  message?: string;
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
): Promise<RedirectResult> => {
  // лишь поиск по имени не возможен без авторизации
  if (!token) {
    return {
      success: false,
      message: 'Поиск по имени недоступен без авторизации',
    };
  }

  try {
    const data = await httpClient.mapi.search(query, token);
    if (data.length === 0) {
      return {
        success: false,
        message: `Точка интереса "${query}" не найдена`,
      };
    }
    if (data.length === 1) {
      handleSelect(data[0]);
      return { success: true };
    }
    handleSearch(query);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Ошибка при поиске точки интереса' };
  }
};

// обработка indoor-poi по id
const handleIndoorById = async (
  id: string,
  token: string | null | undefined,
  handleSelect: (poi: Poi) => void,
): Promise<RedirectResult> => {
  try {
    const poi = await (token
      ? httpClient.mapi.getIndoorById(id, token)
      : httpClient.mapi.getPublicIndoorById(id));
    if (poi) {
      handleSelect(poi);
      return { success: true };
    }
    return { success: false, message: `Точка интереса с ID ${id} не найдена` };
  } catch (error) {
    return { success: false, message: 'Ошибка при получении точки интереса' };
  }
};

// переход к вкладке с событием `eventId`
const handleEventById = (eventId: string): RedirectResult => {
  try {
    history.pushState({}, '', `/event/${eventId}`);
    history.go();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Ошибка при переходе к событию ${eventId}`,
    };
  }
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
): Promise<RedirectResult> => {
  const hashParams = parseHashParams(redirectHash);
  let result: RedirectResult = { success: true };

  // Обработка ical параметра
  if (hashParams.has('ical')) {
    handleICalParam(hashParams.get('ical')!, resetToken);
  }

  // Обработка параметров поиска
  if (hashParams.has('q')) {
    result = await handleIndoorByName(
      hashParams.get('q')!,
      token,
      handleSelect,
      handleSearch,
    );
  } else if (hashParams.has('i')) {
    result = await handleIndoorById(hashParams.get('i')!, token, handleSelect);
  } else if (hashParams.has('e')) {
    result = handleEventById(hashParams.get('e')!);
  } else if (!hashParams.has('ical')) {
    // Если нет ни одного из известных параметров
    result = {
      success: false,
      message: 'Неверный формат ссылки.',
    };
  }

  return result;
};

export const handleLocationHash = async (
  hash: string,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
  token: string | undefined,
  resetToken: (s: string) => void,
  showNotification?: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
  ) => void,
): Promise<void> => {
  const redirectHash = hash.slice(1); // hash includes #
  if (!redirectHash) return; // Если хэш пустой, ничего не делаем

  try {
    const result = await handleRedirect(
      redirectHash,
      handleSelect,
      handleSearch,
      token,
      resetToken,
    );

    // Если есть функция показа уведомлений и результат неуспешный, показываем ошибку
    if (!result.success && result.message && showNotification) {
      showNotification(result.message, 'error');
    } else if (result.success && result.message && showNotification) {
      // Если операция успешна и есть сообщение, показываем успешное уведомление
      showNotification(result.message, 'success');
    }
  } catch (error) {
    if (showNotification) {
      showNotification('Произошла ошибка при обработке QR-кода', 'error');
    }
  }
};
