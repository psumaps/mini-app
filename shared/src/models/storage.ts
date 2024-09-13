import React from 'react';

interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;

  getStorageType(): Promise<StorageType>;
  isDarkPreferred(): Promise<boolean>;
}

export enum StorageType {
  local,
  vkbridge,
}

export const StorageContext = React.createContext<IStorage | null>(null);

export default IStorage;
