import IStorage, { StorageType } from 'psumaps-shared/src/models/storage';
import bridge from '@vkontakte/vk-bridge';

/* eslint-disable @typescript-eslint/require-await */

export const VK_BRIDGE_STATUS_KEY = 'vkWebAppInitStatus';

class Storage implements IStorage {
  async isDarkPreferred(): Promise<boolean> {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  async getStorageType() {
    const vkBridgeStatus = localStorage.getItem(VK_BRIDGE_STATUS_KEY);
    return vkBridgeStatus === 'true' ? StorageType.vkbridge : StorageType.local;
  }

  async get(key: string): Promise<string | null> {
    const vkBridgeStatus = localStorage.getItem(VK_BRIDGE_STATUS_KEY);
    const localValue = localStorage.getItem(key)?.trim();
    const queryBridge = () =>
      bridge
        .send('VKWebAppStorageGet', {
          keys: [key],
        })
        .then((data) => {
          if (data.keys[0].value.trim().length === 0) return null;
          if (data.keys) return data.keys[0].value;
          return null;
        })
        .catch(() => {
          return null;
        });

    if (vkBridgeStatus !== 'true') return localValue as string | null;
    if (!!localValue && localValue.length !== 0) {
      return localValue;
    }
    return queryBridge().then((value) => {
      if (value) localStorage.setItem(key, value);
      return value;
    });
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);

    const vkBridgeStatus = localStorage.getItem(VK_BRIDGE_STATUS_KEY);
    if (vkBridgeStatus !== 'true') return;

    bridge
      .send('VKWebAppStorageSet', {
        key,
        value,
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default Storage;
