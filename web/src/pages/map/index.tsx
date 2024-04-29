import React from 'react';
import Map, {
  GeolocateControl,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';

import NavigationBar from '~/widgets/navigationBar';
import 'maplibre-gl/dist/maplibre-gl.css';
import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual.ts';

const IndoorControl = () => {
  useControl(
    (context: MapContextValue) => {
      // @ts-ignore
      const indoorEqual = new IndoorEqual(context.map.getMap(), { url: 'https://tiles.ijo42.ru/' });
      indoorEqual.loadSprite({ update: true });
      return indoorEqual;
    },
    { position: 'bottom-right' },
  );
  return null;
};
function MapPage() {
  return (
    <>
      <Map
        initialViewState={{
          latitude: 58.007469,
          longitude: 56.187188,
          zoom: 16,
        }}
        style={{ width: '100%', height: '92vh' }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=1XfSivF5uaaJV0EiuRS1"
        attributionControl={false}
      >
        <GeolocateControl position="bottom-right" />
        <NavigationControl position="bottom-right" />
        <IndoorControl />
      </Map>
      <NavigationBar />
    </>
  );
}

export default MapPage;
