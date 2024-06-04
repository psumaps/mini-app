import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import SettingsPage from '../pages/settings';
import MapPage from '~/pages/map';
import TimetablePage from '~/pages/timetable';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MapPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/timetable',
    element: <TimetablePage />,
  },
]);

export default router;
