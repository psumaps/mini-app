import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import { PopUpState } from '../components/map/searchPopUp/search/searchUtils';
import Poi from '../network/models/mapi/poi';
import { useIcalToken } from './IcalTokenContext';
import { useNotification } from '../components/common/notification';

interface Coordinates {
  lt: number;
  lg: number;
  level: number;
}

interface SharedMapContextType {
  popupState: PopUpState;
  setPopupState: React.Dispatch<React.SetStateAction<PopUpState>>;
  selectedPoi: Poi | null;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  markerCoords: Coordinates | null;
  setMarkerCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>;
  indoorLevel: string;
  setIndoorLevel: React.Dispatch<React.SetStateAction<string>>;
  handlePoiSelect: (poi: Poi) => void;
  handleAuthError: () => void;
  handleSuccessAfterFallback: () => void;
}

const SharedMapContext = createContext<SharedMapContextType | null>(null);

export const useSharedMapContext = () => {
  const context = useContext(SharedMapContext);
  if (!context) {
    throw new Error(
      'useSharedMapContext должен использоваться внутри SharedMapProvider',
    );
  }
  return context;
};

interface SharedMapProviderProps {
  children: ReactNode;
  onPoiSelect?: (poi: Poi) => void;
}

export const SharedMapProvider: React.FC<SharedMapProviderProps> = ({
  children,
  onPoiSelect,
}) => {
  const [popupState, setPopupState] = useState<PopUpState>('unauthorized');
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [search, setSearch] = useState('');
  const [markerCoords, setMarkerCoords] = useState<Coordinates | null>(null);
  const [indoorLevel, setIndoorLevel] = useState('1');

  const { isValid } = useIcalToken();
  const { showNotification } = useNotification();

  const handlePoiSelect = useCallback(
    (poi: Poi) => {
      if (poi) {
        const [lg, lt] = poi.properties.point.coordinates;
        setMarkerCoords({
          lt,
          lg,
          level: parseInt(poi.properties.tags.level ?? '1'),
        });
        setSelectedPoi(poi);
        setIndoorLevel(poi.properties.tags.level ?? '1');
        setPopupState('middle');
      } else {
        setSelectedPoi(null);
        setMarkerCoords(null);
      }
      onPoiSelect?.(poi);
    },
    [onPoiSelect],
  );

  const handleAuthError = useCallback(() => {
    showNotification('Проблемы с сервером авторизации...', 'warning', 5000);
  }, [showNotification]);

  const handleSuccessAfterFallback = useCallback(() => {
    showNotification('Авторизация восстановлена!', 'success', 5000);
  }, [showNotification]);

  useEffect(() => {
    if (isValid) {
      setPopupState('closed');
    }
  }, [isValid]);

  const value = useMemo(
    () => ({
      popupState,
      setPopupState,
      selectedPoi,
      setSelectedPoi,
      search,
      setSearch,
      markerCoords,
      setMarkerCoords,
      indoorLevel,
      setIndoorLevel,
      handlePoiSelect,
      handleAuthError,
      handleSuccessAfterFallback,
    }),
    [
      popupState,
      selectedPoi,
      search,
      markerCoords,
      indoorLevel,
      handlePoiSelect,
      handleAuthError,
      handleSuccessAfterFallback,
    ],
  );

  return (
    <SharedMapContext.Provider value={value}>
      {children}
    </SharedMapContext.Provider>
  );
};
