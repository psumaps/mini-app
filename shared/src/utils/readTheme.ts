import IStorage from '../models/storage';

async function getStoredTheme<T extends IStorage>(
  storage: T,
): Promise<boolean> {
  const theme: string = (await storage.get('theme')) ?? '';
  switch (theme) {
    case 'dark':
      return true;
    case 'light':
      return false;
    default:
      return storage.isDarkPreferred();
  }
}

export default getStoredTheme;
