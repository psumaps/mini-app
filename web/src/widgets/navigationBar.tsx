/// <reference types="vite-plugin-svgr/client" />

import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import getStoredTheme from 'psumaps-shared/src/utils/readTheme';
import MapIcon from 'psumaps-shared/src/assets/map.svg?react';
import TimetableIcon from 'psumaps-shared/src/assets/timetable.svg?react';
import SettingsIcon from 'psumaps-shared/src/assets/settings.svg?react';
import { StorageContext } from 'psumaps-shared/src/models/storage';
import { NavigatorContext } from 'psumaps-shared/src/models/navigator';

const NavigationBar = ({ className }: { className?: string }) => {
  const location = useLocation();
  const navigator = useContext(NavigatorContext);
  const storage = useContext(StorageContext);

  useEffect(() => {
    void getStoredTheme(storage!).then((theme) => {
      if (theme) document.documentElement.classList.toggle('dark', theme);
    });
  }, [storage]);

  // Определяем цвет иконки на основе текущего пути
  const fill = (path: string) => {
    if (location.pathname === path) {
      return 'fill-c_main dark:fill-cd_main';
    }
    return 'fill-c_secondary dark:fill-cd_secondary';
  };

  return (
    <div
      className={`bg-c_bg-block dark:bg-cd_bg-block fixed bottom-0 flex flex-row w-full min-h-14 h-[8dvh] gap-12 z-50 border-t p-4 justify-evenly items-center border-c_inactive ${className}`}
    >
      <button
        type="button"
        onClick={() => navigator?.navigate('/')}
        aria-label="Карта"
      >
        <MapIcon className={fill('/')} />
      </button>
      <button
        type="button"
        onClick={() => navigator?.navigate('/settings')}
        aria-label="Настройки"
      >
        <SettingsIcon className={fill('/settings')} />
      </button>
      <button
        type="button"
        onClick={() => navigator?.navigate('/timetable')}
        aria-label="Расписание"
      >
        <TimetableIcon className={fill('/timetable')} />
      </button>
    </div>
  );
};

export default NavigationBar;
