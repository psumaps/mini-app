import { useCallback, useEffect, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { calculateControlsMargin } from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { removeProtocol } from 'maplibre-gl';
import { useIcalToken } from 'psumaps-shared/src/contexts/IcalTokenContext';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import useLocationHash from 'psumaps-shared/src/hooks/useLocationHash';
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
  const { token, isValid } = useIcalToken();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { safeHandleLocationHash } = useLocationHash();

  // Обработчик ошибки авторизации
  const handleAuthError = useCallback(() => {
    showNotification('Проблемы с сервером авторизации...', 'warning', 5000);
  }, [showNotification]);

  // Обработчик успешной загрузки приватных тайлов после fallback
  const handleSuccessAfterFallback = useCallback(() => {
    showNotification('Авторизация восстановлена!', 'success', 5000);
    // Перезагрузка карты
    if (mapRef.current) {
      mapRef.current.getMap().triggerRepaint();
    }
  }, [showNotification]);

  useEffect(() => {
    if (isValid) {
      setPopupState('closed');
    }
    registerProtocol({
      queryClient,
      token: token ?? undefined,
      onAuthError: handleAuthError,
      onSuccessAfterFallback: handleSuccessAfterFallback,
    });
    return () => removeProtocol('martin');
  }, [
    token,
    isValid,
    queryClient,
    handleAuthError,
    handleSuccessAfterFallback,
  ]);

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

  // Обработка хэша URL при изменении
  useEffect(() => {
    if (mapRef.current?.areTilesLoaded) {
      safeHandleLocationHash(routerLocation.hash, handleSelect, () => {});
    }
  }, [routerLocation.hash, safeHandleLocationHash, handleSelect]);

  // Обработка хэша URL при загрузке карты
  const handleLoad = useCallback(() => {
    if (mapRef.current) {
      safeHandleLocationHash(routerLocation.hash, handleSelect, () => {});
    }
  }, [routerLocation.hash, safeHandleLocationHash, handleSelect]);

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
