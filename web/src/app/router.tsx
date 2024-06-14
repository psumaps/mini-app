import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import httpClient from 'psumaps-shared/src/network/httpClient';
import ProfilePage from '~/pages/profile';
import MapPage from '~/pages/map';
import TimetablePage from '~/pages/timetable';
import EventDescription from '~/pages/timetable/eventDescription';

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
  {
    path: '/event/:eventId',
    element: <EventDescription />,
    loader: (request) =>
      useQuery({
        queryKey: ['event', Number(request.params.eventId)],
        queryFn: httpClient.psuTools.events.getEvent,
      }),
  },
]);

export default router;
