import {
  MapGeoJSONFeature,
  MapMouseEvent,
  StyleSpecification,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';
import SearchPopUp from 'psumaps-shared/src/components/map/search';
import { PopUpState } from 'psumaps-shared/src/components/map/search/searchUtils';
import httpClient from 'psumaps-shared/src/network/httpClient';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { parseCoordinatesFromGeometry } from 'psumaps-shared/src/utils/coordinates';
import React, { forwardRef, MutableRefObject, useMemo } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';
import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual';
import NavigationBar from '~/widgets/navigationBar';

const IndoorControl = forwardRef<IndoorEqual>(function IndoorControl(_, ref) {
  // eslint-disable-next-line no-param-reassign
  (ref! as MutableRefObject<IndoorEqual | null>).current = useControl(
    (context: MapContextValue) => {
      // @ts-expect-error no types for this
      return new IndoorEqual(context.map.getMap(), {
        url: import.meta.env.VITE_URL_IJO42_TILES,
      });
    },
    { position: 'bottom-right' },
  );
  return null;
});

const MapPage = () => {
  const { data: animEnabled } = useAnimEnabled();
  const isKeyboardOpen = useDetectKeyboardOpen();
  const mapRef = React.useRef<MapRef | null>(null);
  const indoorControlRef = React.useRef<IndoorEqual | null>(null);
  const [viewState, setViewState] = React.useState({
    longitude: 56.187188,
    latitude: 58.007469,
    zoom: 16,
    pitch: 20,
    bearing: 20,
  });
  const [markerCoords, setMarkerCoords] = React.useState<{
    lt: number;
    lg: number;
    level: number;
  } | null>(null);
  const [popupState, setPopupState] = React.useState<PopUpState>('closed');
  const [selectedPoi, setSelectedPoi] = React.useState<Poi | null>(null);
  const [indoorLevel, setIndoorLevel] = React.useState(1);

  React.useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  const handleSelect = (poi: Poi) => {
    const { lt, lg } = parseCoordinatesFromGeometry(poi.geometry);

    setMarkerCoords({ lt, lg, level: parseInt(poi.properties.level ?? '1') });
    setSelectedPoi(poi);

    if (mapRef.current) mapRef.current.flyTo({ center: [lg, lt], zoom: 18 });
    if (poi.properties.level)
      indoorControlRef?.current?.setLevel(poi.properties.level);
    setPopupState('middle');
  };

  const handlePoiClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    const data = await httpClient.mapi.getIndoorById(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Math.floor(e.features![0].id/10), // (ノ^_^)ノ┻━┻ ┬─┬
    );
    setSelectedPoi(data);
    setMarkerCoords({
      ...parseCoordinatesFromGeometry(data.geometry),
      level: parseInt(data.properties.level ?? '1'),
    });
  };

  const handleLoad = () => {
    if (mapRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      mapRef.current.on('click', 'indoor-poi-rank1', handlePoiClick);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      mapRef.current.on('click', 'indoor-poi-rank2', handlePoiClick);
    }
    if (indoorControlRef.current) {
      indoorControlRef.current.on('levelchange', () =>
        setIndoorLevel(parseInt(indoorControlRef?.current?.level ?? '')),
      );
    }
  };

  const style: StyleSpecification = useMemo(
    () => ({
      version: 8,
      name: 'basemap',
      sources: {
        topo: {
          tiles: ['https://tile-a.opentopomap.cz/{z}/{x}/{y}.png'],
          type: 'raster',
          maxzoom: 17,
          // minzoom: 17,
          volatile: true,
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'Background',
          type: 'background',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'background-color': {
              type: 'interval',
              stops: [
                [6, 'hsl(47,79%,94%)'],
                [14, 'hsl(42,49%,93%)'],
              ],
            },
          },
        },
        // {
        //   id: 'basemap',
        //   type: 'raster',
        //   layout: {
        //     visibility: 'visible',
        //   },
        //   source: 'topo',
        // },
      ],
      sprite: 'https://tiles.ijo42.ru/assets/sprite/indoorequal',
      glyphs: 'https://tiles.ijo42.ru/assets/font/{fontstack}/{range}',
    }),
    [],
  );

  return (
    <div className="relative h-[100dvh] w-[100dvw] flex flex-col">
      <div
        className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
      >
        <Map
          ref={mapRef}
          onLoad={handleLoad}
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          style={{ width: '100%', height: '100%' }}
          // minZoom={16}
          // maxBounds={[56.172495, 58.003141, 56.202192, 58.01219]}
          mapStyle={style}
          clickTolerance={10}
          refreshExpiredTiles={false}
          validateStyle={false}
          attributionControl={false}
        >
          <GeolocateControl
            position="bottom-right"
            style={{
              marginBottom: `${popupState === 'middle' ? '7rem' : 'calc(4rem + 2dvh)'}`,
              transition: `${animEnabled && 'all 500ms ease-in-out'}`,
            }}
          />
          <NavigationControl position="bottom-right" />
          <IndoorControl ref={indoorControlRef} />
          {markerCoords && (
            <Marker
              latitude={markerCoords.lt}
              longitude={markerCoords.lg}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setMarkerCoords(null);
              }}
            >
              <MarkerIcon
                className={`${animEnabled && 'transition-all duration-200 ease-in-out'} 
                    ${markerCoords.level === indoorLevel ? 'opacity-100 scale-100' : 'opacity-40 scale-75'}`}
              />
            </Marker>
          )}
          {[
            [56.188402185,58.008710502],
                [56.188545164,58.008176979],
          ].map((arr) => (
            <Marker
              key={arr[0]}
              longitude={arr[0]}
              latitude={arr[1]}
              anchor="bottom"
            >
              <MarkerIcon
                className={`${animEnabled && 'transition-all duration-200 ease-in-out'} 
                    ${0 ? 'opacity-100 scale-100' : 'opacity-70 scale-75'}`}
              />
            </Marker>
          ))}
        </Map>
        <SearchPopUp
          state={popupState}
          setState={setPopupState}
          onSelect={handleSelect}
          selectedPoi={selectedPoi}
          setSelectedPoi={setSelectedPoi}
        />
      </div>
      <NavigationBar
        className={`${animEnabled && 'transition-all duration-200 ease-in-out'} origin-bottom flex-[0_0_8%] 
            ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
      />
    </div>
  );
};

export default MapPage;
