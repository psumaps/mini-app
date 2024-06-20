import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import { StorageContext } from 'psumaps-shared/src/models/storage';
import router from '~/app/router';
import Storage from '~/app/storage';
import '~/tw.css';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StorageContext.Provider value={useMemo(() => new Storage(), [])}>
        <RouterProvider router={router} />
      </StorageContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
