import React from 'react';
import { AttributionControl, NavigationControl } from 'react-map-gl/maplibre';
import { BridgeType } from 'psumaps-shared/src/models/storage';
import useDeterminateBridge from 'psumaps-shared/src/hooks/useDeterminateBridge';
import IndoorControl from '~/mapEngine/IndoorControl';
import QrScannerControl from '~/mapEngine/QrScannerControl';
import { useMapContext } from '~/pages/map/contexts/MapContext';

const MapControls: React.FC = () => {
  const bridgeType = useDeterminateBridge();
  const { isBannerVisible } = useMapContext();

  return (
    <>
      {!isBannerVisible && (
        <AttributionControl
          position="top-right"
          compact
          customAttribution='<a href="http://gis.psu.ru/" target="_blank">&copy; Кафедра ГИС ПГНИУ</a> | <a href="https://indoorequal.org/" target="_blank">&copy; indoor=</a>'
        />
      )}
      {bridgeType !== BridgeType.local && <QrScannerControl />}
      <NavigationControl position="bottom-right" />
      <IndoorControl />
    </>
  );
};

export default MapControls;
