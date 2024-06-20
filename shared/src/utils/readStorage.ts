import IStorage from '../models/storage';

export async function getStoredTheme<T extends IStorage>(
  storage: T,
): Promise<boolean> {
  const theme: string = (await storage.get('theme')) ?? '';
  switch (theme) {
    case 'dark':
      return true;
    case 'light':
      return false;
    default:
      return storage.isDarkPreffered();
  }
}

export async function getStoredAnimEnabled<T extends IStorage>(
  storage: T,
): Promise<boolean> {
  const animationEnabled: string =
    (await storage.get('animation_enabled')) ?? '';
  switch (animationEnabled) {
    case '1':
      return true;
    case '0':
      return false;
    default:
      return true;
  }
}
