import React, { useCallback, useEffect } from 'react';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import httpClient from 'psumaps-shared/src/network/httpClient';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import { useMapContext } from '~/pages/map/contexts/MapContext';

const PoiHandler: React.FC = () => {
  const { token } = useIcalToken();
  const { showNotification } = useNotification();
  const { handlePoiSelect, mapRef, isMapLoaded } = useMapContext();

  const handlePoiClick = useCallback(
    (
      e: MapMouseEvent & {
        features?: MapGeoJSONFeature[] | undefined;
      },
    ) => {
      if (!(e.features![0].properties.class === 'entrance')) {
        httpClient.mapi
          .getIndoorById(String(e.features![0].id!).slice(0, -1), token!)
          .then((data) => {
            if (data) {
              handlePoiSelect(data);
            } else {
              showNotification('Точка интереса не найдена', 'error');
            }
          })
          .catch(() => {
            showNotification('Ошибка при получении точки интереса', 'error');
          });
      }
    },
    [token, handlePoiSelect, showNotification],
  );

  // Регистрируем обработчики событий после загрузки карты
  useEffect(() => {
    if (!isMapLoaded || !token) return undefined;

    const map = mapRef.current;
    if (!map) return undefined;

    // Проверяем наличие слоев перед регистрацией обработчиков
    const hasLayer1 = map.getLayer('indoor-poi-rank1');
    const hasLayer2 = map.getLayer('indoor-poi-rank2');

    if (hasLayer1) {
      map.on('click', 'indoor-poi-rank1', handlePoiClick);
    }

    if (hasLayer2) {
      map.on('click', 'indoor-poi-rank2', handlePoiClick);
    }

    // Функция очистки
    return () => {
      if (hasLayer1) {
        map.off('click', 'indoor-poi-rank1', handlePoiClick);
      }
      if (hasLayer2) {
        map.off('click', 'indoor-poi-rank2', handlePoiClick);
      }
    };
  }, [isMapLoaded, mapRef, token, handlePoiClick]);

  return null; // Этот компонент не рендерит UI, только добавляет обработчики событий
};

export default PoiHandler;
