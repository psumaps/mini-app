import React, { useRef } from 'react';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import TestingBanner from '~/components/TestingBanner';
import MapContainer from './MapContainer';
import PoiHandler from './PoiHandler';
import SearchPopUpContainer, {
  SearchPopUpContainerRef,
} from './SearchPopUpContainer';

const popUpId = 'search-pop-up';

const MapView: React.FC = () => {
  const searchPopUpRef = useRef<SearchPopUpContainerRef>(null);
  const isKeyboardOpen = useDetectKeyboardOpen();

  return (
    <div
      className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
    >
      {/* Компонент для обработки POI */}
      <PoiHandler />

      {/* Основной контейнер карты */}
      <MapContainer />

      {/* Баннер тестирования */}
      <TestingBanner />

      {/* Контейнер для поиска */}
      <SearchPopUpContainer ref={searchPopUpRef} id={popUpId} />
    </div>
  );
};

export default MapView;
