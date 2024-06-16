import 'maplibre-gl/dist/maplibre-gl.css';
import SearchPopUp from 'psumaps-shared/src/components/map/search';
import { PopUpState } from 'psumaps-shared/src/components/map/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import React, { MutableRefObject, forwardRef, useMemo } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { StorageContext } from 'psumaps-shared/src/models/storage';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import httpClient from 'psumaps-shared/src/network/httpClient';
import { parseCoordinatesFromGeometry } from 'psumaps-shared/src/utils/coordinates';
import Storage from '~/app/storage';
import IndoorEqual from '~/mapbox-gl-indoorequal/indoorEqual';
import NavigationBar from '~/widgets/navigationBar';

const IndoorControl = forwardRef<IndoorEqual>(function IndoorControl(_, ref) {
  // eslint-disable-next-line no-param-reassign
  (ref! as MutableRefObject<IndoorEqual | null>).current = useControl(
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
});

const MapPage = () => {
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
  } | null>(null);
  const [popupState, setPopupState] = React.useState<PopUpState>('closed');
  const [selectedPoi, setSelectedPoi] = React.useState<Poi | null>(null);

  React.useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  const handleSelect = (poi: Poi) => {
    const { lt, lg } = parseCoordinatesFromGeometry(poi.geometry);

    setMarkerCoords({ lt, lg });
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
    setMarkerCoords(parseCoordinatesFromGeometry(data.geometry));
  };

  const handleLoad = () => {
    if (mapRef.current)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      mapRef.current.on('click', 'indoor-poi-rank1', handlePoiClick);
  };

  return (
    <StorageContext.Provider value={useMemo(() => new Storage(), [])}>
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
                <MarkerIcon />
              </Marker>
            )}
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
          className={`transition-all duration-200 ease-in-out origin-bottom flex-[0_0_8%] ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
        />
      </div>
    </StorageContext.Provider>
  );
};

export default MapPage;
