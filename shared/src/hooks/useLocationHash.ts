import { useCallback } from 'react';
import useIcalToken from './useIcalToken';
import { useNotification } from '../components/common/notification';
import Poi from '../network/models/mapi/poi';
import {
  HashParamsModule,
  PoiHandlerModule,
  RedirectResult,
} from '../components/map/searchPopUp/hashParamsUtils';

/**
 * Хук для обработки хэш-параметров URL
 * Поддерживает следующие параметры:
 * - `ical=(\w+)` - устанавливает текущий токен ical
 * - `q=([\wА-Яа-яёЁ\s]+)` - ищет indoor-poi по имени
 * - `i=(\d+)` - ищет indoor-poi по id
 * - `e=(\d+)` - переходит к событию с id
 */
const useLocationHash = () => {
  const { token, isValid, setToken } = useIcalToken();
  const { showNotification } = useNotification();

  /**
   * Обрабатывает редирект по хэш-параметрам
   */
  const handleRedirect = useCallback(
    async (
      redirectHash: string,
      handleSelect: (poi: Poi) => void,
      handleSearch: (query: string) => void,
    ): Promise<RedirectResult> => {
      const hashParams = HashParamsModule.parseHashParams(redirectHash);
      let result: RedirectResult = { success: true };

      // Обработка ical параметра
      if (hashParams.has('ical')) {
        HashParamsModule.handleICalParam(
          hashParams.get('ical') as string,
          setToken,
        );
      }

      // Обработка параметров поиска
      if (hashParams.has('q')) {
        result = await PoiHandlerModule.handleIndoorByName(
          hashParams.get('q') as string,
          token ?? undefined,
          isValid,
          handleSelect,
          handleSearch,
        );
      } else if (hashParams.has('i')) {
        result = await PoiHandlerModule.handleIndoorById(
          hashParams.get('i') as string,
          token ?? undefined,
          isValid,
          handleSelect,
        );
      } else if (hashParams.has('e')) {
        result = PoiHandlerModule.handleEventById(
          hashParams.get('e') as string,
        );
      } else if (!hashParams.has('ical')) {
        // Если нет ни одного из известных параметров
        result = {
          success: false,
          message: 'Неверный формат ссылки.',
        };
      }

      return result;
    },
    [token, isValid, setToken],
  );

  /**
   * Обрабатывает хэш локации и выполняет соответствующие действия
   */
  const handleLocationHash = useCallback(
    async (
      hash: string,
      handleSelect: (poi: Poi) => void,
      handleSearch: (query: string) => void,
    ): Promise<void> => {
      const redirectHash = hash.slice(1); // hash includes #
      if (!redirectHash) return; // Если хэш пустой, ничего не делаем

      try {
        const result = await handleRedirect(
          redirectHash,
          handleSelect,
          handleSearch,
        );

        // Показываем уведомление, если есть сообщение
        if (result.message) {
          showNotification(
            result.message,
            result.success ? 'success' : 'error',
          );
        }
      } catch (error) {
        showNotification('Произошла ошибка при обработке QR-кода', 'error');
      }
    },
    [handleRedirect, showNotification],
  );

  /**
   * Безопасно обрабатывает хэш локации с обработкой ошибок
   */
  const safeHandleLocationHash = useCallback(
    (
      hash: string,
      handleSelect: (poi: Poi) => void,
      handleSearch: (query: string) => void,
    ) => {
      void handleLocationHash(hash, handleSelect, handleSearch).catch((err) => {
        console.error('Error handling location hash:', err);
        showNotification('Ошибка при обработке параметров URL', 'error');
      });
    },
    [handleLocationHash, showNotification],
  );

  return {
    handleLocationHash,
    safeHandleLocationHash,
  };
};

export default useLocationHash;
