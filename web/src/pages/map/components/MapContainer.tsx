import React from 'react';
import Map, {
  MapRef,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';

import MapControls from './MapControls';
import MapMarker from './MapMarker';
import { MapConfigProps } from '~/mapEngine/mapConfig';

interface MapContainerProps {
  mapRef: React.RefObject<MapRef>;
  viewState: ViewState;
  mapProps: MapConfigProps;
  onMove: (e: ViewStateChangeEvent) => void;
  onLoad: () => void;
  markerCoords: { lt: number; lg: number; level: number } | null;
  setMarkerCoords: React.Dispatch<
    React.SetStateAction<{ lt: number; lg: number; level: number } | null>
  >;
  indoorLevel: string;
  setIndoorLevel: React.Dispatch<React.SetStateAction<string>>;
  isBannerVisible: boolean;
  handleSelect: (poi: Poi) => void;
  searchByName: (name: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
                                                     mapRef,
                                                     viewState,
                                                     mapProps,
                                                     onMove,
                                                     onLoad,
                                                     markerCoords,
                                                     setMarkerCoords,
                                                     indoorLevel,
                                                     setIndoorLevel,
                                                     isBannerVisible,
                                                     handleSelect,
                                                     searchByName,
                                                   }) => {
  const { data: animEnabled = false } = useAnimEnabled();

  return (
    <Map
      ref={mapRef}
      onLoad={onLoad}
      {...viewState}
      {...mapProps}
      onMove={onMove}
    >
      <MapControls
        isBannerVisible={isBannerVisible}
        onLevelChange={setIndoorLevel}
        handleSelect={handleSelect}
        searchByName={searchByName}
      />

      {markerCoords && (
        <MapMarker
          latitude={markerCoords.lt}
          longitude={markerCoords.lg}
          level={markerCoords.level}
          currentLevel={indoorLevel}
          animEnabled={animEnabled}
          onMarkerClick={() => setMarkerCoords(null)}
        />
      )}
    </Map>
  );
};

export default MapContainer;
