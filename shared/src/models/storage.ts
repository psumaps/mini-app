import React from 'react';

interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  isDarkPreffered(): Promise<boolean>;
}

export const StorageContext = React.createContext<IStorage | null>(null);

export default IStorage;
