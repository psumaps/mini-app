import IStorage from 'psumaps-frontend/shared/models/storage';

/* eslint-disable @typescript-eslint/require-await */

class Storage implements IStorage {
  async isDarkPreffered(): Promise<boolean> {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }
}

export default Storage;
