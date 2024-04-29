/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect } from 'react';
import MapIcon from '~/../../shared/assets/map.svg?react';
import TimetableIcon from '~/../../shared/assets/timetable.svg?react';
import AccountIcon from '~/../../shared/assets/account.svg?react';
import { useLocation } from 'react-router-dom';
import getStoredTheme from '../../../shared/utils/readTheme';
import Storage from '~/app/storage';

function NavigationBar() {
  const location = useLocation();

  useEffect(() => {
    const theme = getStoredTheme(new Storage());
    theme.then((theme) => {
      if (theme) document.documentElement.classList.add('dark');
    })
  }, []);
  

  // Определяем цвет иконки на основе текущего пути
  const fill = (path: string) => {
    if (location.pathname === path) {
      return 'fill-c_main dark:fill-cd_main';
    }
    return 'fill-c_secondary dark:fill-cd_secondary';
  };

  return (
    <div className="bg-c_bg dark:bg-cd_bg fixed bottom-0 flex flex-row w-full min-h-14 h-[8vh] border-t p-4 justify-evenly border-c_inactive">
      <a href="/">
        <MapIcon className={fill('/')} />
      </a>
      <a href="/profile">
        <AccountIcon className={fill('/profile')} />
      </a>
      <a href="/timetable">
        <TimetableIcon className={fill('/timetable')} />
      </a>
    </div>
  );
}

export default NavigationBar;
