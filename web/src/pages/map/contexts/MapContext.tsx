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
import { useQueryClient } from '@tanstack/react-query';
import { calculateControlsMargin } from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { useIcalToken } from 'psumaps-shared/src/contexts/IcalTokenContext';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import {
  SharedMapProvider,
  useSharedMapContext,
} from 'psumaps-shared/src/contexts/SharedMapContext';
import { initialView } from '~/mapEngine/mapConfig';
import registerProtocol from '../mapUtils';

interface MapContextType {
  mapRef: React.RefObject<MapRef>;
  viewState: typeof initialView;
  setViewState: React.Dispatch<React.SetStateAction<typeof initialView>>;
  isBannerVisible: boolean;
  setIsBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handlePoiSelect: (poi: Poi | null) => void;
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

const MapProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(initialView);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { token } = useIcalToken();
  const queryClient = useQueryClient();

  const {
    _handlePoiSelect: handleSharedPoiSelect,
    handleAuthError,
    handleSuccessAfterFallback,
  } = useSharedMapContext();

  const handlePoiSelect = useCallback(
    (poi: Poi | null) => {
      setTimeout(() => {
        if (poi && mapRef.current) {
          const [lg, lt] = poi.properties.point.coordinates;
          mapRef.current.flyTo({ center: [lg, lt], zoom: 18 });
        }
      }, 600);

      handleSharedPoiSelect(poi);
    },
    [handleSharedPoiSelect],
  );

  useEffect(() => {
    registerProtocol({
      queryClient,
      token: token ?? undefined,
      onAuthError: handleAuthError,
      onSuccessAfterFallback: handleSuccessAfterFallback,
    });
    return () => removeProtocol('martin');
  }, [token, queryClient, handleAuthError, handleSuccessAfterFallback]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin('search-pop-up');
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({
      mapRef,
      viewState,
      setViewState,
      handlePoiSelect,
      isBannerVisible,
      setIsBannerVisible,
    }),
    [viewState, handlePoiSelect, isBannerVisible],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  return (
    <SharedMapProvider>
      <MapProviderInner>{children}</MapProviderInner>
    </SharedMapProvider>
  );
};
