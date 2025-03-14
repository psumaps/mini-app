import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';

interface MapMarkerProps {
  latitude: number;
  longitude: number;
  level: number;
  currentLevel: string;
  animEnabled?: boolean;
  onMarkerClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({
                                               latitude,
                                               longitude,
                                               level,
                                               currentLevel,
                                               animEnabled = false,
                                               onMarkerClick,
                                             }) => {
  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onMarkerClick();
      }}
    >
      <MarkerIcon
        className={`${animEnabled && 'transition-all duration-200 ease-in-out'} 
          ${level === parseInt(currentLevel) ? 'opacity-100 scale-100' : 'opacity-40 scale-75'}`}
      />
    </Marker>
  );
};

export default MapMarker;
