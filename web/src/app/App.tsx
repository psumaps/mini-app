import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import { StorageContext } from 'psumaps-shared/src/models/storage';
import { NavigatorContext } from 'psumaps-shared/src/models/navigator';
import bridge from '@vkontakte/vk-bridge';
import Storage, { VK_BRIDGE_STATUS_KEY } from './storage';
import Navigator from './navigator';

import router from './router';
import '~/tw.css';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    bridge.send('VKWebAppInit', {}).then(
      ({ result }) => {
        if (result) localStorage.setItem(VK_BRIDGE_STATUS_KEY, 'true');
        else if (!localStorage.getItem(VK_BRIDGE_STATUS_KEY))
          localStorage.setItem(VK_BRIDGE_STATUS_KEY, 'false');

        void queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes('storage'),
        });
      },
      () => {
        localStorage.setItem(VK_BRIDGE_STATUS_KEY, 'false');
      },
    );
  }, []);

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
