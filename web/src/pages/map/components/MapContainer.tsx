import React, { useCallback, useEffect, useMemo } from 'react';
import Map, { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import { useSharedMapContext } from 'psumaps-shared/src/contexts/SharedMapContext';
import useLocationHash from 'psumaps-shared/src/hooks/useLocationHash';
import { useLocation } from 'react-router-dom';
import { useMapContext } from '../contexts/MapContext';

import MapControls from './MapControls';
import MapMarker from './MapMarker';
import { mapConfig } from '~/mapEngine/mapConfig';

const MapContainer: React.FC = () => {
  const { markerCoords } = useSharedMapContext();
  const { mapRef, viewState, setViewState } = useMapContext();
  const mapProps = useMemo(() => mapConfig, []);

  const routerLocation = useLocation();
  const { safeHandleLocationHash } = useLocationHash();

  // Обработка хэша URL при изменении
  useEffect(() => {
    if (mapRef.current?.areTilesLoaded) {
      safeHandleLocationHash(routerLocation.hash);
    }
  }, [mapRef, routerLocation.hash, safeHandleLocationHash]);

  // Обработка хэша URL при загрузке карты
  const handleLoad = useCallback(() => {
    if (mapRef.current) {
      safeHandleLocationHash(routerLocation.hash);
    }
  }, [mapRef, routerLocation.hash, safeHandleLocationHash]);

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
