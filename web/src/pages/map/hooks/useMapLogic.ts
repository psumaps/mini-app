import { useContext, useEffect, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { StorageContext } from 'psumaps-shared/src/models/storage';
import {
  calculateControlsMargin,
  handleLocationHash,
} from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { removeProtocol } from 'maplibre-gl';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import registerProtocol from '../mapUtils';
import { initialView } from '~/mapEngine/mapConfig';

const useMapLogic = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState(initialView);
  const [markerCoords, setMarkerCoords] = useState<{
    lt: number;
    lg: number;
    level: number;
  } | null>(null);
  const [popupState, setPopupState] = useState<PopUpState>('unauthorized');
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [indoorLevel, setIndoorLevel] = useState('1');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const routerLocation = useLocation();
  const icalTokenQuery = useIcalToken();
  const storage = useContext(StorageContext);
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (icalTokenQuery.data) {
      setPopupState('closed');
    }
    registerProtocol(queryClient, icalTokenQuery.data);
    return () => removeProtocol('martin');
  }, [icalTokenQuery.data, queryClient]);

  useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin('search-pop-up');
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (poi: Poi) => {
    const [lg, lt] = poi.properties.point.coordinates;
    setMarkerCoords({
      lt,
      lg,
      level: parseInt(poi.properties.tags.level ?? '1'),
    });
    setSelectedPoi(poi);
    setIndoorLevel(poi.properties.tags.level ?? '1');

    if (mapRef.current) mapRef.current.flyTo({ center: [lg, lt], zoom: 18 });
    setPopupState('middle');
  };

  const resetToken = (new_token: string) => {
    if (storage) {
      void storage.set('ical_token', new_token);
      window.location.hash = window.location.hash.replace(/&?ical=\w+&?/, '');
      window.location.reload();
    }
  };

  useEffect(() => {
    if (mapRef.current?.areTilesLoaded)
      void handleLocationHash(
        routerLocation.hash,
        handleSelect,
        () => {
        }, // Заглушка для searchByName, реальная реализация будет в компоненте
        icalTokenQuery.data,
        resetToken,
        showNotification,
      );
  }, [icalTokenQuery.data, routerLocation.hash, showNotification]);

  const handleLoad = () => {
    if (mapRef.current) {
      void handleLocationHash(
        routerLocation.hash,
        handleSelect,
        () => {
        }, // Заглушка для searchByName, реальная реализация будет в компоненте
        icalTokenQuery.data,
        resetToken,
        showNotification,
      );
    }
  };

  return {
    mapRef,
    viewState,
    setViewState,
    markerCoords,
    setMarkerCoords,
    popupState,
    setPopupState,
    selectedPoi,
    setSelectedPoi,
    indoorLevel,
    setIndoorLevel,
    isBannerVisible,
    setIsBannerVisible,
    handleSelect,
    handleLoad,
    showNotification,
    resetToken,
  };
};
export default useMapLogic;
