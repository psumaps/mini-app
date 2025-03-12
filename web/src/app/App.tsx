import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import { StorageContext } from 'psumaps-shared/src/models/storage';
import bridge from '@vkontakte/vk-bridge';
import showOnboarding from 'psumaps-shared/src/utils/onboarding';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { init, isTMA } from '@telegram-apps/sdk-react';
import { NotificationProvider } from 'psumaps-shared/src/components/common/notification';
import Storage, { BRIDGE_STATUS_KEY } from './storage';

import router from './router';
import '~/tw.css';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    localStorage.setItem(BRIDGE_STATUS_KEY, 'local');

    if (isTMA()) {
      init();
      localStorage.setItem(BRIDGE_STATUS_KEY, 'tg');
    } else {
      void bridge.send('VKWebAppInit', {}).then(({ result }) => {
        if (result) {
          localStorage.setItem(BRIDGE_STATUS_KEY, 'vk');
          void showOnboarding();
        }
        void queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes('storage'),
        });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StorageContext.Provider value={useMemo(() => new Storage(), [])}>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </StorageContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
