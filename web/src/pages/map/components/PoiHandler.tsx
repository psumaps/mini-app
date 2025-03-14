import React, { useEffect } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import httpClient from 'psumaps-shared/src/network/httpClient';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import { useNotification } from 'psumaps-shared/src/components/common/notification';

interface PoiHandlerProps {
  mapRef: React.RefObject<MapRef>;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
  setPopupState: React.Dispatch<React.SetStateAction<PopUpState>>;
  setMarkerCoords: React.Dispatch<
    React.SetStateAction<{ lt: number; lg: number; level: number } | null>
  >;
}

const PoiHandler: React.FC<PoiHandlerProps> = ({
                                                 mapRef,
                                                 setSelectedPoi,
                                                 setPopupState,
                                                 setMarkerCoords,
                                               }) => {
  const { token } = useIcalToken();
  const { showNotification } = useNotification();

  const handlePoiClick = (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    if (!(e.features![0].properties.class === 'entrance')) {
      httpClient.mapi
        .getIndoorById(String(e.features![0].id!).slice(0, -1), token!)
        .then((data) => {
          if (data) {
            setSelectedPoi(data);
            setPopupState('middle');
            const [lg, lt] = data.properties.point.coordinates;
            setMarkerCoords({
              lt,
              lg,
              level: parseInt(data.properties.tags.level ?? '1'),
            });
          } else {
            showNotification('Точка интереса не найдена', 'error');
          }
        })
        .catch(() => {
          showNotification('Ошибка при получении точки интереса', 'error');
        });
    }
  };

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
  }, [mapRef.current, token]);

  return null; // Этот компонент не рендерит UI, только добавляет обработчики событий
};

export default PoiHandler;
