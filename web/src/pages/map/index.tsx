import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';
import SearchPopUp from 'psumaps-shared/src/components/map/searchPopUp';
import { calculateControlsMargin } from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';
import httpClient from 'psumaps-shared/src/network/httpClient';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import { parseCoordinatesFromGeometry } from 'psumaps-shared/src/utils/coordinates';
import React, { MutableRefObject, forwardRef } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual';
import NavigationBar from '~/widgets/navigationBar';

const mapStyleUrl = `${import.meta.env.VITE_URL_MAPTILER_STYLE}?key=${import.meta.env.VITE_MAPTILES_STYLE_KEY}`;
const popUpId = 'search-pop-up';

const IndoorControl = forwardRef<IndoorEqual>(function IndoorControl(_, ref) {
  // eslint-disable-next-line no-param-reassign
  (ref! as MutableRefObject<IndoorEqual | null>).current = useControl(
    (context: MapContextValue) => {
      // @ts-expect-error no types for this
      const indoorEqual = new IndoorEqual(context.map.getMap(), {
        url: import.meta.env.VITE_URL_IJO42_TILES,
      });
      void indoorEqual.loadSprite({ update: true });
      return indoorEqual;
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin(popUpId);
    }, 33);
    return () => clearInterval(interval);
  }, []);

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const data = await httpClient.mapi.getPoiById(e.features![0].properties.id);
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
          mapStyle={mapStyleUrl}
          attributionControl={false}
        >
          <GeolocateControl position="bottom-right" />
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
        </Map>
        <SearchPopUp
          id={popUpId}
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
