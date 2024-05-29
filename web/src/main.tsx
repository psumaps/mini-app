import React from 'react';
import ReactDOM from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';
import App from './app/App.tsx';

bridge.send('VKWebAppInit', {}).then(
  ({ result }) => {
    if (!result) {
      // eslint-disable-next-line no-console
      console.log('VKWebAppInit failed');
    }
  },
  (reason) => {
    // eslint-disable-next-line no-console
    console.log(`VKWebAppInit failed: ${reason}`);
  },
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
