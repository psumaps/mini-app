import IStorage, { BridgeType } from 'psumaps-shared/src/models/storage';
import bridge from '@vkontakte/vk-bridge';
import { cloudStorage } from '@telegram-apps/sdk-react';

/* eslint-disable @typescript-eslint/require-await */

export const BRIDGE_STATUS_KEY = 'BRIDGE_STATUS';

// Максимальное количество попыток для операций с внешними хранилищами
const MAX_RETRY_ATTEMPTS = 3;
// Задержка между повторными попытками (в миллисекундах)
const RETRY_DELAY = 500;

// Кэш для типа хранилища
let storageTypeCache: BridgeType | null = null;
// Флаг, указывающий, инициализировано ли хранилище
let isInitialized = false;
// Промис, который разрешается после инициализации хранилища
let initializationPromise: Promise<void> | null = null;

/**
 * Функция для повторных попыток выполнения асинхронной операции
 * Использует рекурсию вместо цикла для избежания await в цикле
 */
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxAttempts = MAX_RETRY_ATTEMPTS,
  delay = RETRY_DELAY,
  attempt = 1,
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    if (attempt >= maxAttempts) {
      console.error('Операция не удалась после нескольких попыток:', error);
      return null;
    }

    // Ждем перед следующей попыткой
    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });

    // Рекурсивно вызываем функцию для следующей попытки
    return retryOperation(operation, maxAttempts, delay, attempt + 1);
  }
};

/**
 * Получает значение из VK Bridge с повторными попытками
 */
const getFromVkBridge = async (key: string): Promise<string | undefined> => {
  const result = await retryOperation(() => vkBridgeQuery(key));
  return result || undefined;
};

/**
 * Получает значение из Telegram Connect с повторными попытками
 */
const getFromTgConnect = async (key: string): Promise<string | undefined> => {
  const result = await retryOperation(() => tgConnectQuery(key));
  return result || undefined;
};

/**
 * Сохраняет значение в VK Bridge с повторными попытками
 */
const setToVkBridge = async (key: string, value: string): Promise<void> => {
  await retryOperation(() =>
    bridge.send('VKWebAppStorageSet', { key, value }).then(() => true),
  );
};

/**
 * Сохраняет значение в Telegram Connect с повторными попытками
 */
const setToTgConnect = async (key: string, value: string): Promise<void> => {
  await retryOperation(() => cloudStorage.setItem(key, value).then(() => true));
};

/**
 * Запрос к VK Bridge для получения значения по ключу
 */
const vkBridgeQuery = (key: string): Promise<string | null> =>
  bridge
    .send('VKWebAppStorageGet', {
      keys: [key],
    })
    .then((data) => {
      if (!data.keys || data.keys.length === 0) return null;
      const { value } = data.keys[0];
      if (!value || value.trim().length === 0) return null;
      return value;
    })
    .catch((error) => {
      console.error(`Ошибка VK Bridge при получении ключа ${key}:`, error);
      return null;
    });

/**
 * Запрос к Telegram Connect для получения значения по ключу
 */
const tgConnectQuery = (key: string): Promise<string | null> =>
  cloudStorage
    .getItem([key])
    .then((data) => {
      if (!data || !data[key] || data[key].trim().length === 0) return null;
      return data[key];
    })
    .catch((error) => {
      console.error(
        `Ошибка Telegram Connect при получении ключа ${key}:`,
        error,
      );
      return null;
    });

/**
 * Сбрасывает кэш типа хранилища
 */
const resetStorageTypeCache = (): void => {
  storageTypeCache = null;
};

/**
 * Получает тип хранилища
 */
const getStorageType = async (): Promise<BridgeType> => {
  // Ждем инициализации хранилища
  await waitForInitialization();

  // Используем кэшированное значение, если оно есть
  if (storageTypeCache !== null) {
    return storageTypeCache;
  }

  const bridgeStatus = localStorage.getItem(BRIDGE_STATUS_KEY);
  let storageType: BridgeType;

  switch (bridgeStatus) {
    case 'vk':
      storageType = BridgeType.vkbridge;
      break;
    case 'tg':
      storageType = BridgeType.tgconnect;
      break;
    default:
      storageType = BridgeType.local;
  }

  // Кэшируем результат
  storageTypeCache = storageType;
  return storageType;
};

/**
 * Ожидает инициализации хранилища
 */
const waitForInitialization = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  if (initializationPromise) {
    await initializationPromise;
  }

  // Если хранилище еще не инициализировано и нет промиса инициализации,
  // просто возвращаемся (это может произойти, если метод вызван до инициализации App.tsx)
};

/**
 * Инициализирует хранилище с указанным типом
 */
export const initializeStorage = (type: 'vk' | 'tg' | 'local'): void => {
  if (isInitialized) {
    return;
  }

  // Создаем промис инициализации
  initializationPromise = new Promise<void>((resolve) => {
    // Устанавливаем тип хранилища
    localStorage.setItem(BRIDGE_STATUS_KEY, type);
    // Сбрасываем кэш типа хранилища
    resetStorageTypeCache();
    // Помечаем хранилище как инициализированное
    isInitialized = true;
    // Разрешаем промис
    resolve();
  });
};

/**
 * Получает значение из хранилища по ключу
 */
const get = async (key: string): Promise<string | undefined> => {
  // Ждем инициализации хранилища
  await waitForInitialization();

  const storageType = await getStorageType();
  const localValue = localStorage.getItem(key)?.trim();

  // Для локального хранилища просто возвращаем значение
  if (storageType === BridgeType.local) {
    return localValue || undefined;
  }

  // Если значение есть в localStorage и оно не пустое, возвращаем его
  if (localValue && localValue.length > 0) {
    return localValue;
  }

  // Иначе пытаемся получить значение из внешнего хранилища
  try {
    const externalValue = await (storageType === BridgeType.vkbridge
      ? getFromVkBridge(key)
      : getFromTgConnect(key));

    // Если значение получено, сохраняем его в localStorage
    if (externalValue) {
      localStorage.setItem(key, externalValue);
      return externalValue;
    }

    return undefined;
  } catch (error) {
    console.error(`Ошибка при получении значения для ключа ${key}:`, error);
    return localValue || undefined;
  }
};

/**
 * Сохраняет значение в хранилище по ключу
 */
const set = async (key: string, value: string): Promise<void> => {
  // Ждем инициализации хранилища
  await waitForInitialization();

  // Сохраняем значение в localStorage
  localStorage.setItem(key, value);

  const storageType = await getStorageType();

  // Для локального хранилища больше ничего не делаем
  if (storageType === BridgeType.local) {
    return;
  }

  // Сохраняем значение во внешнем хранилище
  try {
    if (storageType === BridgeType.vkbridge) {
      await setToVkBridge(key, value);
    } else if (storageType === BridgeType.tgconnect) {
      await setToTgConnect(key, value);
    }
  } catch (error) {
    console.error(`Ошибка при сохранении значения для ключа ${key}:`, error);
    // Даже если внешнее хранилище недоступно, значение сохранено в localStorage
  }
};

/**
 * Проверяет, предпочитает ли пользователь темную тему
 */
const isDarkPreferred = async (): Promise<boolean> => {
  // Ждем инициализации хранилища
  await waitForInitialization();

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

/**
 * Обновляет тип хранилища
 */
const updateStorageType = async (newType: BridgeType): Promise<void> => {
  // Ждем инициализации хранилища
  await waitForInitialization();

  let newStatus: string;

  switch (newType) {
    case BridgeType.vkbridge:
      newStatus = 'vk';
      break;
    case BridgeType.tgconnect:
      newStatus = 'tg';
      break;
    default:
      newStatus = 'local';
  }

  // Обновляем статус в localStorage
  localStorage.setItem(BRIDGE_STATUS_KEY, newStatus);

  // Сбрасываем кэш типа хранилища
  resetStorageTypeCache();
};

// Создаем объект хранилища
const storage: IStorage = {
  get,
  set,
  getStorageType,
  isDarkPreferred,
  updateStorageType,
};

export default storage;
