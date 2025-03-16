import React from 'react';

interface IStorage {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;

  getStorageType(): Promise<BridgeType>;
  isDarkPreferred(): Promise<boolean>;

  updateStorageType(newType: BridgeType): Promise<void>;
}

export enum BridgeType {
  local,
  vkbridge,
  tgconnect,
}

export const StorageContext = React.createContext<IStorage | null>(null);

export default IStorage;
