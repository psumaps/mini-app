import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import SettingsPage from '../pages/settings';
import MapPage from '~/pages/map';
import TimetablePage from '~/pages/timetable';
import EventDescription from '~/pages/timetable/eventDescription';

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
  {
    path: '/event/:eventId',
    element: <EventDescription />,
  },
]);

export default router;
