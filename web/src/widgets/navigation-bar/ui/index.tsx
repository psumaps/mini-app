/// <reference types="vite-plugin-svgr/client" />

import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useTheme } from '@mui/material';
import MapIcon from '~/shared/assets/map.svg?react';
import TimetableIcon from '~/shared/assets/timetable.svg?react';
import AccountIcon from '~/shared/assets/account.svg?react';
import { useLocation } from 'react-router-dom';

function NavigationBar() {
  const theme = useTheme();
  const location = useLocation();

  // Определяем цвет иконки на основе текущего пути
  const getIconColor = (path: string) => {
    if (location.pathname === path) {
      return theme.palette.primary.contrastText;
    }
    return theme.palette.primary.main;
  };

  return (
    <BottomNavigation
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '8vh',
      }}
    >
      <BottomNavigationAction href="/" icon={<MapIcon fill={getIconColor('/')} />} />
      <BottomNavigationAction
        href="/profile"
        icon={<AccountIcon fill={getIconColor('/profile')} />}
      />
      <BottomNavigationAction
        href="/timetable"
        icon={<TimetableIcon fill={getIconColor('/timetable')} />}
      />
    </BottomNavigation>
  );
}

export default NavigationBar;
