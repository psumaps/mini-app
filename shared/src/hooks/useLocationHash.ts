import { useCallback } from 'react';
import useIcalToken from './useIcalToken';
import { useNotification } from '../components/common/notification';
import {
  HashParamsModule,
  PoiHandlerModule,
  RedirectResult,
} from '../components/map/searchPopUp/hashParamsUtils';
import { useMapContext } from '~/pages/map/contexts/MapContext';
import { useSharedMapContext } from '../contexts/SharedMapContext';

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
  const { handlePoiSelect } = useMapContext();
  const { setSearch } = useSharedMapContext();

  /**
   * Обрабатывает редирект по хэш-параметрам
   */
  const handleRedirect = useCallback(
    async (redirectHash: string): Promise<RedirectResult> => {
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
          handlePoiSelect,
          setSearch,
        );
      } else if (hashParams.has('i')) {
        result = await PoiHandlerModule.handleIndoorById(
          hashParams.get('i') as string,
          token ?? undefined,
          isValid,
          handlePoiSelect,
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
    [setToken, token, isValid, handlePoiSelect, setSearch],
  );

  /**
   * Обрабатывает хэш локации и выполняет соответствующие действия
   */
  const handleLocationHash = useCallback(
    async (hash: string): Promise<void> => {
      const redirectHash = hash.slice(1); // hash includes #
      if (!redirectHash || redirectHash.startsWith('tgWebAppData')) return; // Если хэш пустой, ничего не делаем

      try {
        const result = await handleRedirect(redirectHash);

        // Показываем уведомление, если есть сообщение
        if (result.message) {
          showNotification(
            result.message,
            result.success ? 'success' : 'error',
          );
        }
      } catch (_error) {
        showNotification('Произошла ошибка при обработке QR-кода', 'error');
      }
    },
    [handleRedirect, showNotification],
  );

  /**
   * Безопасно обрабатывает хэш локации с обработкой ошибок
   */
  const safeHandleLocationHash = useCallback(
    (hash: string) => {
      void handleLocationHash(hash).catch((err) => {
        console.error('Error handling location hash:', err);
        showNotification('Ошибка при обработке параметров URL', 'error');
      });
    },
    [handleLocationHash, showNotification],
  );

  return {
    safeHandleLocationHash,
  };
};

export default useLocationHash;
