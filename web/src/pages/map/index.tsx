import React from 'react';
import Map, {
  GeolocateControl,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import SearchPopUp from 'psumaps-shared/src/components/map/search';
import NavigationBar from '~/widgets/navigationBar';
import 'maplibre-gl/dist/maplibre-gl.css';
import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual';

const IndoorControl = () => {
  useControl(
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
  return null;
};
const MapPage = () => {
  const isKeyboardOpen = useDetectKeyboardOpen();
  const [popupState, setPopupState] = React.useState<
    'closed' | 'middle' | 'opened'
  >('closed');

  return (
    <div className="relative h-[100dvh] w-[100dvw] flex flex-col">
      <div
        className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
      >
        <Map
          initialViewState={{
            latitude: 58.007469,
            longitude: 56.187188,
            zoom: 16,
          }}
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
          <IndoorControl />
        </Map>
        <SearchPopUp state={popupState} setState={setPopupState} />
      </div>
      <NavigationBar
        className={`transition-all duration-200 ease-in-out origin-bottom flex-[0_0_8%] ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
      />
    </div>
  );
};

export default MapPage;
