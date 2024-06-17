/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import getStoredTheme from 'psumaps-shared/src/utils/readTheme';
import MapIcon from 'psumaps-shared/src/assets/map.svg?react';
import TimetableIcon from 'psumaps-shared/src/assets/timetable.svg?react';
import SettingsIcon from 'psumaps-shared/src/assets/settings.svg?react';
import Storage from '~/app/storage';

const NavigationBar = ({ className }: { className?: string }) => {
  const location = useLocation();

  useEffect(() => {
    const loadTheme = async () => {
      const theme = await getStoredTheme(new Storage());
      if (theme) document.documentElement.classList.add('dark');
    };
    void loadTheme();
  }, []);

  // Определяем цвет иконки на основе текущего пути
  const fill = (path: string) => {
    if (location.pathname === path) {
      return 'fill-c_main dark:fill-cd_main';
    }
    return 'fill-c_secondary dark:fill-cd_secondary';
  };

  return (
    <div
      className={`bg-c_bg dark:bg-cd_bg fixed bottom-0 flex flex-row w-full min-h-14 h-[8dvh] z-50 border-t p-4 justify-evenly items-center border-c_inactive ${className}`}
    >
      <a href="/" aria-label="Карта">
        <MapIcon className={fill('/')} />
      </a>
      <a href="/settings" aria-label="Настройки">
        <SettingsIcon className={fill('/settings')} />
      </a>
      <a href="/timetable" aria-label="Расписание">
        <TimetableIcon className={fill('/timetable')} />
      </a>
    </div>
  );
};

export default NavigationBar;
