import React from 'react';
import ReactDOM from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';
import App from './app/App';
import { VK_BRIDGE_STATUS_KEY } from './app/storage';

bridge.send('VKWebAppInit', {}).then(
  ({ result }) => {
    if (result) localStorage.setItem(VK_BRIDGE_STATUS_KEY, 'true');
    else localStorage.setItem(VK_BRIDGE_STATUS_KEY, 'false');
  },
  () => {
    localStorage.setItem(VK_BRIDGE_STATUS_KEY, 'false');
  },
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
