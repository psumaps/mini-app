import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import ProfilePage from '~/pages/profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProfilePage />,
  },
]);

export default router;
