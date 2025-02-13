import IStorage, { BridgeType } from 'psumaps-shared/src/models/storage';
import bridge from '@vkontakte/vk-bridge';
import { cloudStorage } from '@telegram-apps/sdk-react';

/* eslint-disable @typescript-eslint/require-await */

export const BRIDGE_STATUS_KEY = 'BRIDGE_STATUS';

class Storage implements IStorage {
  async isDarkPreferred(): Promise<boolean> {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  async getStorageType() {
    const bridgeStatus = localStorage.getItem(BRIDGE_STATUS_KEY);
    switch (bridgeStatus) {
      case 'vk':
        return BridgeType.vkbridge;
      case 'tg':
        return BridgeType.tgconnect;
      default:
        return BridgeType.local;
    }
  }

  async get(key: string): Promise<string | undefined> {
    const storageType = await this.getStorageType();
    const localValue = localStorage.getItem(key)?.trim();

    if (storageType === BridgeType.local) return localValue;
    if (!!localValue && localValue.length !== 0) {
      return localValue;
    }
    return (
      storageType === BridgeType.vkbridge
        ? this.vkBridgeQuery(key)
        : this.tgConnectQuery(key)
    ).then((value) => {
      if (!value) {
        return undefined;
      }

      localStorage.setItem(key, value);
      return value;
    });
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);

    const bridgeStatus = await this.getStorageType();
    // eslint-disable-next-line default-case
    switch (bridgeStatus) {
      case BridgeType.vkbridge:
        bridge
          .send('VKWebAppStorageSet', {
            key,
            value,
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case BridgeType.tgconnect:
        await cloudStorage.setItem(key, value).catch((error) => {
          console.log(error);
        });
        break;
    }
  }

  private vkBridgeQuery = (key: string) =>
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

  private tgConnectQuery = (key: string) =>
    cloudStorage
      .getItem(key)
      .then((data) => {
        if (data?.trim().length === 0) return null;
        return data;
      })
      .catch(() => {
        return null;
      });
}

export default Storage;
