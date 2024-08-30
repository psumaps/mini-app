import IStorage from '../models/storage';

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

export async function getStoredIcalToken<T extends IStorage>(
  storage: T,
): Promise<string | null> {
  return storage.get('ical_token');
}
