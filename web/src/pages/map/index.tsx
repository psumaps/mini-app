import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkerIcon from 'psumaps-shared/src/assets/marker.svg?react';
import SearchPopUp from 'psumaps-shared/src/components/map/searchPopUp';
import {
  calculateControlsMargin,
  handleLocationHash,
  handleRedirect,
  SearchPopUpRef,
} from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';
import httpClient from 'psumaps-shared/src/network/httpClient';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';
import React, { forwardRef, MutableRefObject } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  MapRef,
  Marker,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import { useLocation } from 'react-router-dom';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
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

const QrControl = ({
  handleSelect,
  handleSearch,
  icalToken,
}: {
  handleSelect: (poi: Poi) => void;
  handleSearch: (query: string) => void;
  icalToken: string;
}) => {
  useControl(
    () =>
      new QrScanner(
        (code) =>
          void handleRedirect(code, handleSelect, handleSearch, icalToken),
      ),
    { position: 'bottom-right' },
  );
  return null;
};

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
  const icalTokenQuery = useIcalToken();

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

  React.useEffect(() => {
    if (mapRef.current?.areTilesLoaded)
      void handleLocationHash(
        routerLocation.hash,
        handleSelect,
        searchByName,
        icalTokenQuery.data!,
      );
  }, [icalTokenQuery.data, routerLocation]);

  const handlePoiClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    const data = await httpClient.mapi.getIndoorById(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      String(e.features![0].id!).slice(0, -1), // в поле id приходит значение c лишней "1" справа (ノ^_^)ノ┻━┻ ┬─┬
      icalTokenQuery.data!,
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
      void handleLocationHash(routerLocation.hash, handleSelect, searchByName);
    }
    if (indoorControlRef.current) {
      indoorControlRef.current.on('levelchange', () =>
        setIndoorLevel(parseInt(indoorControlRef?.current?.level ?? '')),
      );
    }
  };

  return (
    <div className="relative h-[100dvh] w-[100dvw] flex flex-col">
      {/* eslint-disable-next-line no-nested-ternary */}
      {icalTokenQuery.isLoading ? (
        <div className="relative flex-[0_0_92%]">Загрузка...</div>
      ) : /* eslint-disable-next-line no-nested-ternary */
      icalTokenQuery.isError ? (
        <div className="relative flex-[0_0_92%]">
          {icalTokenQuery.error.message}
        </div>
      ) : !icalTokenQuery.data ? (
        <div className="relative flex flex-[0_0_92%] justify-center items-center">
          <h1>Ошибка...</h1>
        </div>
      ) : (
        <div
          className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
        >
          <Map
            ref={mapRef}
            onLoad={handleLoad}
            {...viewState}
            {...mapProps}
            onMove={(e) => setViewState(e.viewState)}
            transformRequest={(url) => ({
              url,
              headers: { Authorization: `Bearer ${icalTokenQuery.data}` },
            })}
          >
            <QrControl
              handleSelect={handleSelect}
              handleSearch={searchByName}
              icalToken={icalTokenQuery.data}
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
      )}
      <NavigationBar
        className={`${animEnabled && 'transition-all duration-200 ease-in-out'} origin-bottom flex-[0_0_8%] 
            ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
      />
    </div>
  );
};

export default MapPage;
