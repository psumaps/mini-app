import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';
import { useSharedMapContext } from 'psumaps-shared/src/contexts/SharedMapContext';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';

const MapMarker: React.FC = () => {
  const { data: animEnabled } = useAnimEnabled();
  const {
    indoorLevel: currentLevel,
    handlePoiSelect,
    markerCoords,
  } = useSharedMapContext();

  if (!markerCoords) return null;

  return (
    <Marker
      latitude={markerCoords.lt}
      longitude={markerCoords.lg}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        handlePoiSelect(markerCoords.poi);
      }}
    >
      <MarkerIcon
        className={`${animEnabled && 'transition-all duration-200 ease-in-out'} 
          ${markerCoords.level === parseInt(currentLevel) ? 'opacity-100 scale-100' : 'opacity-40 scale-75'}`}
      />
    </Marker>
  );
};

export default MapMarker;
