import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import SettingsPage from '../pages/settings';
import MapPage from '~/pages/map';
import PageBase from '~/pages/pageBase';
import TimetablePage from '~/pages/timetable';
import EventDescription from '~/pages/timetable/eventDescription';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageBase>
        <MapPage />
      </PageBase>
    ),
  },
  {
    path: '/settings',
    element: (
      <PageBase>
        <SettingsPage />
      </PageBase>
    ),
  },
  {
    path: '/timetable',
    element: (
      <PageBase>
        <TimetablePage />
      </PageBase>
    ),
  },
  {
    path: '/event/:eventId',
    element: (
      <PageBase>
        <EventDescription />
      </PageBase>
    ),
  },
]);

export default router;
