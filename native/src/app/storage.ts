import { Appearance } from 'react-native';
import IStorage from '~/src/models/storage';
import { default as ExpoStorage } from 'expo-storage';

class Storage implements IStorage {
  async isDarkPreffered(): Promise<boolean> {
    return Appearance.getColorScheme() === 'dark';
  }
  async get(key: string): Promise<string | null> {
    return await ExpoStorage.getItem({ key });
  }
  async set(key: string, value: string): Promise<void> {
    await ExpoStorage.setItem({ key, value });
  }
}

export default Storage;
