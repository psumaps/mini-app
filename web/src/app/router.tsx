import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import ProfilePage from '~/pages/profile';
import MapPage from '~/pages/map';
import TimetablePage from '~/pages/timetable';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MapPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/timetable',
    element: <TimetablePage />,
  },
]);

export default router;
