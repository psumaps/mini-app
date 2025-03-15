import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { removeProtocol } from 'maplibre-gl';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { calculateControlsMargin } from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { useIcalToken } from 'psumaps-shared/src/contexts/IcalTokenContext';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import useLocationHash from 'psumaps-shared/src/hooks/useLocationHash';
import { initialView } from '~/mapEngine/mapConfig';
import registerProtocol from '../mapUtils';

interface MapContextType {
  mapRef: React.RefObject<MapRef>;
  viewState: typeof initialView;
  setViewState: React.Dispatch<React.SetStateAction<typeof initialView>>;
  markerCoords: { lt: number; lg: number; level: number } | null;
  setMarkerCoords: React.Dispatch<
    React.SetStateAction<{ lt: number; lg: number; level: number } | null>
  >;
  popupState: PopUpState;
  setPopupState: React.Dispatch<React.SetStateAction<PopUpState>>;
  selectedPoi: Poi | null;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
  indoorLevel: string;
  setIndoorLevel: React.Dispatch<React.SetStateAction<string>>;
  handleSelect: (poi: Poi) => void;
  isBannerVisible: boolean;
  setIsBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoad: () => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const MapContext = createContext<MapContextType | null>(null);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext должен использоваться внутри MapProvider');
  }
  return context;
};

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(initialView);
  const [markerCoords, setMarkerCoords] = useState<{
    lt: number;
    lg: number;
    level: number;
  } | null>(null);
  const [popupState, setPopupState] = useState<PopUpState>('unauthorized');
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [indoorLevel, setIndoorLevel] = useState('1');
  const [search, setSearch] = useState('');
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const routerLocation = useLocation();
  const { token, isValid } = useIcalToken();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { safeHandleLocationHash } = useLocationHash();

  const handleSelect = useCallback((poi: Poi) => {
    if (poi) {
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
    } else {
      setSelectedPoi(null);
    }
  }, []);

  // Обработчик ошибки авторизации
  const handleAuthError = useCallback(() => {
    showNotification('Проблемы с сервером авторизации...', 'warning', 5000);
  }, [showNotification]);

  // Обработчик успешной загрузки приватных тайлов после fallback
  const handleSuccessAfterFallback = useCallback(() => {
    showNotification('Авторизация восстановлена!', 'success', 5000);
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
    setPopupState,
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

  const value = useMemo(
    () => ({
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
      handleSelect,
      isBannerVisible,
      setIsBannerVisible,
      handleLoad,
      search,
      setSearch,
    }),
    [
      viewState,
      markerCoords,
      popupState,
      selectedPoi,
      indoorLevel,
      handleSelect,
      isBannerVisible,
      handleLoad,
      search,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
