import React, { useEffect, useCallback } from 'react';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import httpClient from 'psumaps-shared/src/network/httpClient';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import { useMapContext } from '~/pages/map/contexts/MapContext';

const PoiHandler: React.FC = () => {
  const { token } = useIcalToken();
  const { showNotification } = useNotification();

  const { handlePoiSelect } = useMapContext();
  const { mapRef } = useMapContext();

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

  useEffect(() => {
    if (mapRef.current && token) {
      mapRef.current.on('click', 'indoor-poi-rank1', handlePoiClick);
      mapRef.current.on('click', 'indoor-poi-rank2', handlePoiClick);
    }

    return () => {
      const { current } = mapRef;
      if (current) {
        current.off('click', 'indoor-poi-rank1', handlePoiClick);
        current.off('click', 'indoor-poi-rank2', handlePoiClick);
      }
    };
  }, [mapRef, token, handlePoiClick]);

  return null; // Этот компонент не рендерит UI, только добавляет обработчики событий
};

export default PoiHandler;
