import { MapGeoJSONFeature, MapMouseEvent, removeProtocol } from 'maplibre-gl';
import 'psumaps-shared/src/assets/maplibre-gl.css';
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
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  AttributionControl,
  MapRef,
  Marker,
  NavigationControl,
} from 'react-map-gl/maplibre';
import { useLocation } from 'react-router-dom';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import { BridgeType, StorageContext } from 'psumaps-shared/src/models/storage';
import { useQueryClient } from '@tanstack/react-query';
import useDeterminateBridge from 'psumaps-shared/src/hooks/useDeterminateBridge';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import { initialView, mapConfig } from '~/mapEngine/mapConfig';
import NavigationBar from '~/widgets/navigationBar';
import TestingBanner from '~/components/TestingBanner';
import QrScannerControl from '~/mapEngine/QrScannerControl';
import IndoorControl from '~/mapEngine/IndoorControl';
import registerProtocol from './mapUtils';

const popUpId = 'search-pop-up';

const MapPageContent = () => {
  const { data: animEnabled } = useAnimEnabled();
  const isKeyboardOpen = useDetectKeyboardOpen();
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState(initialView);
  const [markerCoords, setMarkerCoords] = useState<{
    lt: number;
    lg: number;
    level: number;
  } | null>(null);
  const [popupState, setPopupState] = useState<PopUpState>('unauthorized');
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [indoorLevel, setIndoorLevel] = useState('1');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const routerLocation = useLocation();
  const searchPopUpRef = useRef<SearchPopUpRef>(null);
  const icalTokenQuery = useIcalToken();
  const storage = useContext(StorageContext);
  const queryClient = useQueryClient();
  const mapProps = useMemo(() => mapConfig, []);
  const bridgeType = useDeterminateBridge();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (icalTokenQuery.data) {
      setPopupState('closed');
    }
    registerProtocol(queryClient, icalTokenQuery.data);
    return () => removeProtocol('martin');
  }, [icalTokenQuery.data, queryClient]);

  useEffect(() => {
    if (selectedPoi === null) setMarkerCoords(null);
  }, [selectedPoi]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateControlsMargin(popUpId);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const searchByName = (name: string) => searchPopUpRef.current?.search(name);

  const handleSelect = (poi: Poi) => {
    const [lg, lt] = poi.properties.point.coordinates;
    setMarkerCoords({
      lt,
      lg,
      level: parseInt(poi.properties.tags.level ?? '1'),
    });
    setSelectedPoi(poi);
    setIndoorLevel(poi.properties.tags.level ?? '1');

    if (mapRef.current) mapRef.current.flyTo({ center: [lg, lt], zoom: 18 });
    setPopupState('middle');
  };

  const resetToken = (new_token: string) => {
    if (storage) {
      void storage.set('ical_token', new_token);
      window.location.hash = window.location.hash.replace(/&?ical=\w+&?/, '');
      window.location.reload();
    }
  };

  useEffect(() => {
    if (mapRef.current?.areTilesLoaded)
      void handleLocationHash(
        routerLocation.hash,
        handleSelect,
        searchByName,
        icalTokenQuery.data,
        resetToken,
        showNotification,
      );
  }, [icalTokenQuery.data, routerLocation.hash, showNotification]);

  const handlePoiClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[] | undefined;
    },
  ) => {
    if (!(e.features![0].properties.class === 'entrance')) {
      try {
        const data = await httpClient.mapi.getIndoorById(
          String(e.features![0].id!).slice(0, -1),
          icalTokenQuery.data!,
        );

        if (data) {
          setSelectedPoi(data);
          setPopupState('middle');
          const [lg, lt] = data.properties.point.coordinates;
          setMarkerCoords({
            lt,
            lg,
            level: parseInt(data.properties.tags.level ?? '1'),
          });
        } else {
          showNotification('Точка интереса не найдена', 'error');
        }
      } catch (error) {
        showNotification('Ошибка при получении точки интереса', 'error');
      }
    }
  };

  const handleLoad = () => {
    if (mapRef.current) {
      void handleLocationHash(
        routerLocation.hash,
        handleSelect,
        searchByName,
        icalTokenQuery.data,
        resetToken,
        showNotification,
      );
      if (icalTokenQuery.data) {
        mapRef.current.on('click', 'indoor-poi-rank1', handlePoiClick);
        mapRef.current.on('click', 'indoor-poi-rank2', handlePoiClick);
      }
    }
  };

  return (
    <div className="relative h-[100dvh] w-[100dvw] flex flex-col">
      {icalTokenQuery.isLoading ? (
        <div className="relative flex-[0_0_92%]">Загрузка...</div>
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
          >
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
                    icalTokenQuery.data,
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
            <IndoorControl onLevelChange={setIndoorLevel} />
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
                    ${markerCoords.level === parseInt(indoorLevel) ? 'opacity-100 scale-100' : 'opacity-40 scale-75'}`}
                />
              </Marker>
            )}
          </Map>
          <TestingBanner onVisibilityChange={setIsBannerVisible} />
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

const MapPage = () => {
  return <MapPageContent />;
};

export default MapPage;
