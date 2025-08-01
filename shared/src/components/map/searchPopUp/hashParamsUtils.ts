import Poi from '../../../network/models/mapi/poi';
import httpClient from '../../../network/httpClient';

export interface RedirectResult {
  success: boolean;
  message?: string;
}

/**
 * Модуль для работы с хэш-параметрами
 */
export const HashParamsModule = {
  /**
   * Парсит хэш-параметры из строки
   */
  parseHashParams: (redirectHash: string): Map<string, string> => {
    return redirectHash.split('&').reduce((accumulator, singleQueryParam) => {
      const [key, value] = singleQueryParam.split('=');
      if (key && value) {
        accumulator.set(key, decodeURIComponent(value));
      }
      return accumulator;
    }, new Map<string, string>());
  },

  /**
   * Обрабатывает параметр iCal
   */
  handleICalParam: (
    ical_token: string,
    setToken: ((token: string) => Promise<void>) | undefined,
  ): void => {
    if (setToken) {
      void setToken(ical_token);
    } else {
      console.log('ICal param not applicable');
    }
  },
};

/**
 * Модуль для работы с POI
 */
export const PoiHandlerModule = {
  /**
   * Обрабатывает поиск indoor-poi по имени
   */
  handleIndoorByName: async (
    query: string,
    token: string | undefined,
    isValid: boolean,
    handleSelect: (poi: Poi) => void,
    handleSearch: (query: string) => void,
  ): Promise<RedirectResult> => {
    // Проверяем валидность токена, а не только его наличие
    if (!token || !isValid) {
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
    } catch (_error) {
      return {
        success: false,
        message: 'Ошибка при поиске точки интереса',
      };
    }
  },

  /**
   * Обрабатывает поиск indoor-poi по id
   */
  handleIndoorById: async (
    id: string,
    token: string | undefined,
    isValid: boolean,
    handleSelect: (poi: Poi) => void,
  ): Promise<RedirectResult> => {
    try {
      // Используем токен только если он валидный
      const poi = await (token && isValid
        ? httpClient.mapi.getIndoorById(id, token)
        : httpClient.mapi.getPublicIndoorById(id));
      if (poi) {
        handleSelect(poi);
        return { success: true };
      }
      return {
        success: false,
        message: `Точка интереса с ID ${id} не найдена`,
      };
    } catch (_error) {
      return {
        success: false,
        message: 'Ошибка при получении точки интереса',
      };
    }
  },

  /**
   * Обрабатывает переход к событию по id
   */
  handleEventById: (eventId: string): RedirectResult => {
    try {
      history.pushState({}, '', `/event/${eventId}`);
      history.go();
      return { success: true };
    } catch (_error) {
      return {
        success: false,
        message: `Ошибка при переходе к событию ${eventId}`,
      };
    }
  },
};
