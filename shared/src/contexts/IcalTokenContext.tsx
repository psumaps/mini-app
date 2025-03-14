import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type IStorage from '../models/storage';
import httpClient from '../network/httpClient';

interface IcalTokenContextType {
  token: string | null;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => Promise<void>;
  validateToken: (token: string) => Promise<boolean>;
  clearToken: () => Promise<void>;
}

export const IcalTokenContext = createContext<IcalTokenContextType | null>(
  null,
);

export const useIcalToken = () => {
  const context = useContext(IcalTokenContext);
  if (!context) {
    throw new Error('useIcalToken must be used within an IcalTokenProvider');
  }
  return context;
};

interface IcalTokenProviderProps {
  storage: IStorage;
  children: React.ReactNode;
}

export const IcalTokenProvider: React.FC<IcalTokenProviderProps> = ({
  storage,
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Валидация токена
  const validateToken = useCallback(
    async (tokenToValidate: string): Promise<boolean> => {
      try {
        const result = await httpClient.mapi.validateIcal(tokenToValidate);

        // Обработка всех возможных результатов от mapiClient.validateIcal
        if (result === true) {
          // Токен валиден
          setError(null);
          return true;
        }

        if (result === false) {
          // Токен не прошел проверку (401)
          setError('Токен не прошел проверку');
          return false;
        }

        // Другие ошибки (например, таймаут)
        setError('Сервер временно недоступен');
        return false;
      } catch (err) {
        // Непредвиденные ошибки
        setError('Ошибка при валидации токена');
        return false;
      }
    },
    [],
  );

  // Установка нового токена
  const setToken = useCallback(
    async (newToken: string): Promise<void> => {
      // Проверка формата токена
      if (!newToken.match(/^\w{16}$/)) {
        setError('Токен должен состоять из 16 латинских букв и цифр');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const isTokenValid = await validateToken(newToken);
        if (isTokenValid) {
          await storage.set('ical_token', newToken);
          setTokenState(newToken);
          setIsValid(true);
        } else {
          // Не очищаем токен из хранилища при ошибке валидации
          setIsValid(false);
        }
      } catch (err) {
        setError('Ошибка при сохранении токена');
      } finally {
        setIsLoading(false);
      }
    },
    [storage, validateToken],
  );

  // Очистка токена
  const clearToken = useCallback(async (): Promise<void> => {
    try {
      await storage.set('ical_token', '');
      setTokenState(null);
      setIsValid(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при очистке токена');
    }
  }, [storage]);

  // Инициализация токена при загрузке
  useEffect(() => {
    const initializeToken = async () => {
      try {
        const storedToken = await storage.get('ical_token');
        if (storedToken) {
          setTokenState(storedToken);
          const valid = await validateToken(storedToken);
          setIsValid(valid);
        }
      } catch (err) {
        setError('Ошибка при инициализации токена');
      } finally {
        setIsLoading(false);
      }
    };

    void initializeToken();
  }, [storage, validateToken]);

  const value = useMemo(
    () => ({
      token,
      isValid,
      isLoading,
      error,
      setToken,
      validateToken,
      clearToken,
    }),
    [token, isValid, isLoading, error, setToken, validateToken, clearToken],
  );

  return (
    <IcalTokenContext.Provider value={value}>
      {children}
    </IcalTokenContext.Provider>
  );
};
