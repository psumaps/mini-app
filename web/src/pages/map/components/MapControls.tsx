import React from 'react';
import { AttributionControl, NavigationControl } from 'react-map-gl/maplibre';
import { BridgeType } from 'psumaps-shared/src/models/storage';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import useDeterminateBridge from 'psumaps-shared/src/hooks/useDeterminateBridge';
import useLocationHash from 'psumaps-shared/src/hooks/useLocationHash';
import IndoorControl from '~/mapEngine/IndoorControl';
import QrScannerControl from '~/mapEngine/QrScannerControl';

interface MapControlsProps {
  isBannerVisible: boolean;
  onLevelChange: (level: string) => void;
  handleSelect: (poi: Poi) => void;
  searchByName: (name: string) => void;
  indoorLevel?: string;
}

const MapControls: React.FC<MapControlsProps> = ({
  isBannerVisible,
  onLevelChange,
  handleSelect,
  searchByName,
                                                   indoorLevel,
}) => {
  const bridgeType = useDeterminateBridge();
  const { safeHandleLocationHash } = useLocationHash();

  return (
    <>
      {!isBannerVisible && (
        <AttributionControl
          position="top-right"
          compact
          customAttribution='<a href="http://gis.psu.ru/" target="_blank">&copy; Кафедра ГИС ПГНИУ</a> | <a href="https://indoorequal.org/" target="_blank">&copy; indoor=</a>'
        />
      )}
      {bridgeType !== BridgeType.local && (
        <QrScannerControl
          onScan={(code) =>
            safeHandleLocationHash(code, handleSelect, searchByName)
          }
          bridgeType={bridgeType}
        />
      )}
      <NavigationControl position="bottom-right" />
      <IndoorControl onLevelChange={onLevelChange} indoorLevel={indoorLevel} />
    </>
  );
};

export default MapControls;
