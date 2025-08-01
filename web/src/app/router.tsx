import React, {Suspense} from 'react';

import { createBrowserRouter } from 'react-router-dom';
import PageBase from '~/pages/pageBase';

const SettingsPage = React.lazy(() => import('../pages/settings'));
const MapPage = React.lazy(() => import('~/pages/map'));
const TimetablePage = React.lazy(() => import('~/pages/timetable'));
const EventDescription = React.lazy(
    () => import('~/pages/timetable/eventDescription'),
);

// Suspense fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full w-full">
        <div className="animate-pulse">Loading...</div>
    </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageBase>
          <Suspense fallback={<LoadingFallback/>}>
              <MapPage/>
          </Suspense>
      </PageBase>
    ),
  },
  {
    path: '/settings',
    element: (
      <PageBase>
          <Suspense fallback={<LoadingFallback/>}>
              <SettingsPage/>
          </Suspense>
      </PageBase>
    ),
  },
  {
    path: '/timetable',
    element: (
      <PageBase>
          <Suspense fallback={<LoadingFallback/>}>
              <TimetablePage/>
          </Suspense>
      </PageBase>
    ),
  },
  {
    path: '/event/:eventId',
    element: (
      <PageBase>
          <Suspense fallback={<LoadingFallback/>}>
              <EventDescription/>
          </Suspense>
      </PageBase>
    ),
  },
]);

export default router;
