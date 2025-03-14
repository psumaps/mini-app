import React, { useMemo, useRef } from 'react';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import TestingBanner from '~/components/TestingBanner';
import MapContainer from './MapContainer';
import PoiHandler from './PoiHandler';
import SearchPopUpContainer, {
  SearchPopUpContainerRef,
} from './SearchPopUpContainer';
import useMapLogic from '../hooks/useMapLogic';
import { mapConfig } from '~/mapEngine/mapConfig';

interface MapViewProps {
  searchByName: (name: string) => void;
}

const popUpId = 'search-pop-up';

const MapView: React.FC<MapViewProps> = ({ searchByName }) => {
  const {
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
  } = useMapLogic();

  const searchPopUpRef = useRef<SearchPopUpContainerRef>(null);
  const isKeyboardOpen = useDetectKeyboardOpen();
  const mapProps = useMemo(() => mapConfig, []);

  return (
    <div
      className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
    >
      {/* Компонент для обработки POI */}
      <PoiHandler
        mapRef={mapRef}
        setSelectedPoi={setSelectedPoi}
        setPopupState={setPopupState}
        setMarkerCoords={setMarkerCoords}
      />

      {/* Основной контейнер карты */}
      <MapContainer
        mapRef={mapRef}
        viewState={viewState}
        mapProps={mapProps}
        onMove={(e) => setViewState(e.viewState)}
        onLoad={handleLoad}
        markerCoords={markerCoords}
        setMarkerCoords={setMarkerCoords}
        indoorLevel={indoorLevel}
        setIndoorLevel={setIndoorLevel}
        isBannerVisible={isBannerVisible}
        handleSelect={handleSelect}
        searchByName={searchByName}
      />

      {/* Баннер тестирования */}
      <TestingBanner onVisibilityChange={setIsBannerVisible} />

      {/* Контейнер для поиска */}
      <SearchPopUpContainer
        ref={searchPopUpRef}
        id={popUpId}
        state={popupState}
        setState={setPopupState}
        onSelect={handleSelect}
        selectedPoi={selectedPoi}
        setSelectedPoi={setSelectedPoi}
      />
    </div>
  );
};

export default MapView;
