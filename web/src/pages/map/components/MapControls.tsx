import React from 'react';
import { AttributionControl, NavigationControl } from 'react-map-gl/maplibre';
import { BridgeType } from 'psumaps-shared/src/models/storage';
import { handleRedirect } from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import useDeterminateBridge from 'psumaps-shared/src/hooks/useDeterminateBridge';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import IndoorControl from '~/mapEngine/IndoorControl';
import QrScannerControl from '~/mapEngine/QrScannerControl';

interface MapControlsProps {
  isBannerVisible: boolean;
  onLevelChange: (level: string) => void;
  handleSelect: (poi: Poi) => void;
  searchByName: (name: string) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
                                                   isBannerVisible,
                                                   onLevelChange,
                                                   handleSelect,
                                                   searchByName,
                                                 }) => {
  const icalTokenQuery = useIcalToken();
  const bridgeType = useDeterminateBridge();
  const { showNotification } = useNotification();
  const icalToken = icalTokenQuery.data;

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
            void handleRedirect(
              code,
              handleSelect,
              searchByName,
              icalToken,
              undefined,
            ).then((result) => {
              if (!result.success && result.message) {
                showNotification(result.message, 'error');
              }
            })
          }
          bridgeType={bridgeType}
        />
      )}
      <NavigationControl position="bottom-right" />
      <IndoorControl onLevelChange={onLevelChange} />
    </>
  );
};

export default MapControls;
