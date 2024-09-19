import {
  MapGeoJSONFeature,
  MapMouseEvent,
  VectorSourceSpecification,
} from 'maplibre-gl';
import 'psumaps-shared/src/assets/maplibre-gl.css';
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
import React, { forwardRef, MutableRefObject, useEffect } from 'react';
import type { MapContextValue } from 'react-map-gl/dist/esm/components/map';
import Map, {
  AttributionControl,
  MapRef,
  Marker,
  NavigationControl,
  useControl,
} from 'react-map-gl/maplibre';
import mapiClient from 'psumaps-shared/src/network/httpClient/mapiClient';
import IndoorEqual from '~/mapEngine/indoorEqual';
import { initialView, mapConfig, MapConfigProps } from '~/mapEngine/mapConfig';

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

const MapPage = () => {
  const { data: animEnabled } = useAnimEnabled();
  const mapRef = React.useRef<MapRef | null>(null);
  const indoorControlRef = React.useRef<IndoorEqual | null>(null);
  const [viewState, setViewState] = React.useState(initialView);
  const [markerCoords, setMarkerCoords] = React.useState<{
    lt: number;
    lg: number;
    level: number;
  } | null>(null);
  const [popupState, setPopupState] = React.useState<PopUpState>('closed');
  const [selectedPoi, setSelectedPoi] = React.useState<Poi | null>(null);
  const [indoorLevel, setIndoorLevel] = React.useState(1);
  const searchPopUpRef = React.useRef<SearchPopUpRef>(null);
  const mapProps = React.useMemo<MapConfigProps>(() => {
    const config = mapConfig;
    if (popupState === 'unauthorized') {
      (config.mapStyle.sources.indoorequal as VectorSourceSpecification).tiles =
        [`${import.meta.env.VITE_URL_IJO42_TILES}pubtiles/{z}/{x}/{y}`];
    } else
      (config.mapStyle.sources.indoorequal as VectorSourceSpecification).tiles =
        [`${import.meta.env.VITE_URL_IJO42_TILES}tiles/{z}/{x}/{y}`];
    return config;
  }, [popupState]);

  React.useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  useEffect(() => {
    const checkAccess = async () => {
      const response = await mapiClient.validateIcal('');
      if (!response.result) {
        setPopupState('unauthorized');
      }
    };
    void checkAccess();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin(popUpId);
    }, 33);
    return () => clearInterval(interval);
  }, []);

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

  const handlePoiClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    if (!(e.features![0].properties.class === 'entrance')) {
      const data = await httpClient.mapi.getIndoorById(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        String(e.features![0].id!).slice(0, -1), // в поле id приходит значение c лишней "1" справа (ノ^_^)ノ┻━┻ ┬─┬
        '',
      );

      setSelectedPoi(data);
      setPopupState('middle');
      const [lg, lt] = data.properties.point.coordinates;
      setMarkerCoords({
        lt,
        lg,
        level: parseInt(data.properties.tags.level ?? '1'),
      });
    }
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
    <>
      {/* eslint-disable-next-line no-nested-ternary */}
      <>
        <Map
          key={popupState === 'unauthorized' ? 'private' : 'public'}
          ref={mapRef}
          onLoad={handleLoad}
          {...viewState}
          {...mapProps}
          onMove={(e) => setViewState(e.viewState)}
        >
          <AttributionControl
            position="top-right"
            compact
            customAttribution='<a href="http://gis.psu.ru/" target="_blank">&copy; Кафедра ГИС ПГНИУ</a> | <a href="https://indoorequal.org/" target="_blank">&copy; indoor=</a>'
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
      </>
    </>
  );
};

export default MapPage;
