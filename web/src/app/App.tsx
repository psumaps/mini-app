import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import { StorageContext } from 'psumaps-shared/src/models/storage';
import { NavigatorContext } from 'psumaps-shared/src/models/navigator';
import Storage from './storage';
import Navigator from './navigator';

import router from './router';
import '~/tw.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StorageContext.Provider value={useMemo(() => new Storage(), [])}>
        <NavigatorContext.Provider value={useMemo(() => new Navigator(), [])}>
          <RouterProvider router={router} />
        </NavigatorContext.Provider>
      </StorageContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
