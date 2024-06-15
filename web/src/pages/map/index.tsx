import 'maplibre-gl/dist/maplibre-gl.css';
import SearchPopUp from 'psumaps-shared/src/components/map/search';
import { PopUpState } from 'psumaps-shared/src/components/map/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import React, { useMemo } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  GeolocateControl,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { StorageContext } from 'psumaps-shared/src/models/storage';
import Storage from '~/app/storage';
import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual';
import NavigationBar from '~/widgets/navigationBar';

const IndoorControl = ({
  setIndoorControlInstance,
}: {
  setIndoorControlInstance: (instance: IndoorEqual | null) => void;
}) => {
  const instance = useControl(
    (context: MapContextValue) => {
      // @ts-expect-error no types for this
      const indoorEqual = new IndoorEqual(context.map.getMap(), {
        url: 'https://tiles.ijo42.ru/',
      });
      void indoorEqual.loadSprite({ update: true });
      return indoorEqual;
    },
    { position: 'bottom-right' },
  );
  setIndoorControlInstance(instance);
  return null;
};

const MapPage = () => {
  const isKeyboardOpen = useDetectKeyboardOpen();
  const [viewState, setViewState] = React.useState({
    longitude: 56.187188,
    latitude: 58.007469,
    zoom: 16,
  });
  const [popupState, setPopupState] = React.useState<PopUpState>('closed');
  const [indoorControlInstance, setIndoorControlInstance] =
    React.useState<IndoorEqual | null>(null);

  const handleSelect = (poi: Poi) => {
    let lt;
    let lg;

    if (!('coordinates' in poi.geometry)) {
      [lg, lt] = poi.geometry;
    } else {
      const lgSum = poi.geometry.coordinates[0].reduce((a, b) => a + b[0], 0);
      const ltSum = poi.geometry.coordinates[0].reduce((a, b) => a + b[1], 0);
      lt = ltSum / poi.geometry.coordinates[0].length;
      lg = lgSum / poi.geometry.coordinates[0].length;
    }

    setViewState({
      zoom: 18,
      latitude: lt,
      longitude: lg,
    });
    if (poi.properties.level)
      indoorControlInstance?.setLevel(poi.properties.level);
    setPopupState('middle');
  };

  return (
    <StorageContext.Provider value={useMemo(() => new Storage(), [])}>
      <div className="relative h-[100dvh] w-[100dvw] flex flex-col">
        <div
          className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
        >
          <Map
            {...viewState}
            onMove={(e) => setViewState(e.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=1XfSivF5uaaJV0EiuRS1"
            attributionControl={false}
          >
            <GeolocateControl
              position="bottom-right"
              style={{
                marginBottom: `${popupState === 'middle' ? '7rem' : 'calc(4rem + 2dvh)'}`,
                transition: 'all 500ms ease-in-out',
              }}
            />
            <NavigationControl position="bottom-right" />
            <IndoorControl
              setIndoorControlInstance={setIndoorControlInstance}
            />
          </Map>
          <SearchPopUp
            state={popupState}
            setState={setPopupState}
            onSelect={handleSelect}
          />
        </div>
        <NavigationBar
          className={`transition-all duration-200 ease-in-out origin-bottom flex-[0_0_8%] ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
        />
      </div>
    </StorageContext.Provider>
  );
};

export default MapPage;
