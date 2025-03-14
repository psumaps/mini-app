import 'psumaps-shared/src/assets/maplibre-gl.css';
import React, { useRef } from 'react';
import useIcalToken from 'psumaps-shared/src/hooks/useIcalToken';
import useAnimEnabled from 'psumaps-shared/src/hooks/useAnimEnabled';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import NavigationBar from '~/widgets/navigationBar';
import MapLoader from './components/MapLoader';
import MapView from './components/MapView';
import { SearchPopUpContainerRef } from './components/SearchPopUpContainer';

const MapPage = () => {
  const searchPopUpRef = useRef<SearchPopUpContainerRef>(null);
  const { isLoading: isTokenLoading } = useIcalToken();
  const { data: animEnabled = false } = useAnimEnabled();
  const isKeyboardOpen = useDetectKeyboardOpen();

  const searchByName = (name: string) => searchPopUpRef.current?.search(name);

  return (
    <div className="relative h-[100dvh] w-[100dvw] flex flex-col">
      {isTokenLoading ? <MapLoader /> : <MapView searchByName={searchByName} />}
      <NavigationBar
        className={`${animEnabled && 'transition-all duration-200 ease-in-out'} origin-bottom flex-[0_0_8%] 
            ${isKeyboardOpen ? 'scale-y-0 min-h-[0_!important] flex-[0_0_0%]' : 'scale-y-100'}`}
      />
    </div>
  );
};

export default MapPage;
