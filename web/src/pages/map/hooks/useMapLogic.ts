import { useCallback, useEffect, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  calculateControlsMargin,
  handleLocationHash,
} from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { removeProtocol } from 'maplibre-gl';
import { useIcalToken } from 'psumaps-shared/src/contexts/IcalTokenContext';
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
  const { token, isValid, setToken } = useIcalToken();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isValid) {
      setPopupState('closed');
    }
    registerProtocol(queryClient, token ?? undefined);
    return () => removeProtocol('martin');
  }, [token, isValid, queryClient]);

  useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin('search-pop-up');
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = useCallback((poi: Poi) => {
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
  }, []);

  // Функция для безопасного вызова handleLocationHash
  const safeHandleLocationHash = useCallback(
    (hash: string, searchByNameFn: () => void) => {
      void handleLocationHash(
        hash,
        handleSelect,
        searchByNameFn,
        token ?? undefined,
        setToken,
        showNotification,
      ).catch((err) => {
        console.error('Error handling location hash:', err);
        showNotification('Ошибка при обработке параметров URL', 'error');
      });
    },
    [token, setToken, showNotification, handleSelect],
  );

  useEffect(() => {
    if (mapRef.current?.areTilesLoaded) {
      safeHandleLocationHash(routerLocation.hash, () => {});
    }
  }, [routerLocation.hash, safeHandleLocationHash]);

  const handleLoad = () => {
    if (mapRef.current) {
      safeHandleLocationHash(routerLocation.hash, () => {});
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
  };
};

export default useMapLogic;
