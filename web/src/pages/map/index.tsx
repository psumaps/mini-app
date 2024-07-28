import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';
import SearchPopUp from 'psumaps-shared/src/components/map/searchPopUp';
import {
  calculateControlsMargin,
  SearchPopUpRef,
} from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';
import httpClient from 'psumaps-shared/src/network/httpClient';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import React, { forwardRef, MutableRefObject } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import { Location, useLocation } from 'react-router-dom';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import IndoorEqual from '~/mapEngine/indoorEqual';
import { initialView, mapConfig, MapConfigProps } from '~/mapEngine/mapConfig';
import QrScanner from '~/mapEngine/qrScanner';
import NavigationBar from '~/widgets/navigationBar';

const popUpId = 'search-pop-up';

const IndoorControl = forwardRef<IndoorEqual>(function IndoorControl(_, ref) {
  // eslint-disable-next-line no-param-reassign
  (ref! as MutableRefObject<IndoorEqual | null>).current = useControl(
    (context: MapContextValue) => {
      // @ts-expect-error no types for this
      return new IndoorEqual(context.map.getMap(), {});
    },
    { position: 'bottom-right' },
  );
  return null;
});

async function handleRedirect(
  redirectHash: string,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
) {
  const hashParams = redirectHash.split('=');
  if (hashParams.length === 2 && hashParams[0].length === 1) {
    let data: Poi[];
    const query = hashParams[1];
    // eslint-disable-next-line default-case
    switch (redirectHash[0]) {
      case 'q': // indoor by name
        data = await httpClient.mapi.search(query);
        if (data.length === 0) {
          console.error('POI not found');
        } else if (data.length === 1) {
          handleSelect(data[0]);
        } else {
          handleSearch(query);
        }
        break;
      case 'i': // indoor by id
        data = [await httpClient.mapi.getIndoorById(query)];
        if (data?.[0]) {
          handleSelect(data[0]);
        } else {
          console.error('POI not found');
        }
        break;
      case 'e': // event by id
        history.pushState({}, '', `/event/${query}`);
        history.go();
        break;
    }
  }
}
const QrControl = ({
  handleSelect,
  handleSearch,
}: {
  handleSelect: (poi: Poi) => void;
  handleSearch: (query: string) => void;
}) => {
  useControl(
    () =>
      new QrScanner(
        (code) => void handleRedirect(code, handleSelect, handleSearch),
      ),
    { position: 'bottom-right' },
  );
  return null;
};

function handleLocationHash(
  location: Location,
  handleSelect: (poi: Poi) => void,
  handleSearch: (query: string) => void,
) {
  const redirectHash = location.hash?.slice(1);
  if (redirectHash) {
    void handleRedirect(redirectHash, handleSelect, handleSearch);
  }
}

const MapPage = () => {
  const { data: animEnabled } = useAnimEnabled();
  const isKeyboardOpen = useDetectKeyboardOpen();
  const mapRef = React.useRef<MapRef | null>(null);
  const indoorControlRef = React.useRef<IndoorEqual | null>(null);
  const [viewState, setViewState] = React.useState(initialView);
  const mapProps = React.useMemo<MapConfigProps>(() => mapConfig, []);
  const [markerCoords, setMarkerCoords] = React.useState<{
    lt: number;
    lg: number;
    level: number;
  } | null>(null);
  const [popupState, setPopupState] = React.useState<PopUpState>('closed');
  const [selectedPoi, setSelectedPoi] = React.useState<Poi | null>(null);
  const [indoorLevel, setIndoorLevel] = React.useState(1);
  const routerLocation = useLocation();
  const searchPopUpRef = React.useRef<SearchPopUpRef>(null);

  React.useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin(popUpId);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const searchByName = (name: string) => searchPopUpRef.current?.search(name);

  const handleSelect = (poi: Poi) => {
    const [lg, lt] = poi.properties.point.coordinates;

    setMarkerCoords({ lt, lg, level: parseInt(poi.properties.level ?? '1') });
    setSelectedPoi(poi);
    setIndoorLevel(parseInt(poi.properties.level ?? '1'));

    if (mapRef.current) mapRef.current.flyTo({ center: [lg, lt], zoom: 18 });
    if (poi.properties.level)
      indoorControlRef?.current?.setLevel(poi.properties.level);
    setPopupState('middle');
  };

  React.useEffect(
    () => void handleLocationHash(routerLocation, handleSelect, searchByName),
    [routerLocation],
  );

  const handlePoiClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    const data = await httpClient.mapi.getIndoorById(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      String(e.features![0].id!).slice(0, -1), // в поле id приходит значение c лишней "1" справа (ノ^_^)ノ┻━┻ ┬─┬
    );
    setSelectedPoi(data);
    setPopupState('middle');
    const [lg, lt] = data.properties.point.coordinates;
    setMarkerCoords({
      lt,
      lg,
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
          {...mapProps}
          onMove={(e) => setViewState(e.viewState)}
        >
          <GeolocateControl position="bottom-right" />
          <NavigationControl position="bottom-right" />
          <IndoorControl ref={indoorControlRef} />
          <QrControl handleSelect={handleSelect} handleSearch={searchByName} />
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
          ref={searchPopUpRef}
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
