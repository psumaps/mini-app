import React from 'react';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import SearchPopUp from 'psumaps-shared/src/components/map/searchPopUp';
import TestingBanner from '~/components/TestingBanner';
import MapContainer from './MapContainer';

const popUpId = 'search-pop-up';

const MapView: React.FC = () => {
  const isKeyboardOpen = useDetectKeyboardOpen();

  return (
    <div
      className={`relative ${isKeyboardOpen ? 'h-full' : 'flex-[0_0_92%]'} w-full`}
    >
      {/* Основной контейнер карты */}
      <MapContainer />

      {/* Баннер тестирования */}
      <TestingBanner />

      {/* Контейнер для поиска */}
      <SearchPopUp id={popUpId} />
    </div>
  );
};

export default MapView;
