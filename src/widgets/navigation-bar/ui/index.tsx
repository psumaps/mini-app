/// <reference types="vite-plugin-svgr/client" />

import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import { useTheme } from '@mui/material';
import NotificationIcon from '~/shared/assets/notification.svg?react';
import MapIcon from '~/shared/assets/map.svg?react';
import TimetableIcon from '~/shared/assets/timetable.svg?react';
import AccountIcon from '~/shared/assets/account.svg?react';

function NavigationBar() {
  const theme = useTheme();
  return (
    <BottomNavigation
      sx={{
        background: theme.palette.primary.main,
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <BottomNavigationAction icon={<NotificationIcon />} />
      <BottomNavigationAction icon={<MapIcon />} />
      <BottomNavigationAction icon={<TimetableIcon />} />
      <BottomNavigationAction icon={<AccountIcon />} />
    </BottomNavigation>
  );
}

export default NavigationBar;
