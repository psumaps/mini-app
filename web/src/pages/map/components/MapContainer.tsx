import React, { useMemo } from 'react';
import Map, { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import { useSharedMapContext } from 'psumaps-shared/src/contexts/SharedMapContext';
import { useMapContext } from '../contexts/MapContext';

import MapControls from './MapControls';
import MapMarker from './MapMarker';
import { mapConfig } from '~/mapEngine/mapConfig';

const MapContainer: React.FC = () => {
  const { markerCoords } = useSharedMapContext();
  const { mapRef, viewState, setViewState, handleLoad } = useMapContext();
  const mapProps = useMemo(() => mapConfig, []);

  return (
    <Map
      ref={mapRef}
      onLoad={handleLoad}
      {...viewState}
      {...mapProps}
      onMove={(e: ViewStateChangeEvent) => setViewState(e.viewState)}
    >
      <MapControls />
      {markerCoords && <MapMarker />}
    </Map>
  );
};

export default MapContainer;
