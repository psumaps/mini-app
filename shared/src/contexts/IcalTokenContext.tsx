import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type IStorage from '../models/storage';
import httpClient from '../network/httpClient';

interface IcalTokenContextType {
  icalToken: string | null;
  jwtToken: string | null;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  isServiceAvailable: boolean;
  setToken: (icalToken: string) => Promise<void>;
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
  const [icalToken, setIcalTokenState] = useState<string | null>(null);
  const [jwtToken, setJwtTokenState] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);

  // Обмен iCal токена на JWT
  const exchangeToken = useCallback(
    async (icalTokenToExchange: string): Promise<string | null> => {
      try {
        const jwt =
          await httpClient.auth.exchangeIcalForJwt(icalTokenToExchange);
        setIsServiceAvailable(true);
        setError(null);
        return jwt;
      } catch (err: unknown) {
        setIsServiceAvailable(true);
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { status?: number } };
          if (axiosErr.response?.status === 401) {
            setError('Токен не прошел проверку');
            return null;
          }
        }
        // Сетевые ошибки или таймаут
        setError('Сервер временно недоступен');
        setIsServiceAvailable(false);
        return null;
      }
    },
    [],
  );

  // Валидация токена
  const validateToken = useCallback(
    async (tokenToValidate: string): Promise<boolean> => {
      try {
        const result = await httpClient.auth.validateJwt(tokenToValidate);

        setIsServiceAvailable(true);
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
        setIsServiceAvailable(false);
        return false;
      } catch (_err) {
        // Непредвиденные ошибки
        setError('Ошибка при валидации токена');
        return false;
      }
    },
    [],
  );

  // Установка нового токена
  const setToken = useCallback(
    async (newIcalToken: string): Promise<void> => {
      // Проверка формата токена
      if (!newIcalToken.match(/^\w{16}$/)) {
        setError('Токен должен состоять из 16 латинских букв и цифр');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Пытаемся обменять токен на JWT
        const jwt = await exchangeToken(newIcalToken);

        if (jwt) {
          // Сохраняем оба токена
          await storage.set('ical_token', newIcalToken);
          await storage.set('jwt_token', jwt);
          setIcalTokenState(newIcalToken);
          setJwtTokenState(jwt);
          setIsValid(true);
        } else {
          // Обмен не удался, но токен сохраняем для повторных попыток
          setIsValid(false);
        }
      } catch (_err) {
        setError('Ошибка при сохранении токена');
      } finally {
        setIsLoading(false);
      }
    },
    [storage, exchangeToken],
  );

  // Очистка токена
  const clearToken = useCallback(async (): Promise<void> => {
    try {
      await storage.set('ical_token', '');
      await storage.set('jwt_token', '');
      setIcalTokenState(null);
      setJwtTokenState(null);
      setIsValid(false);
      setError(null);
    } catch (_err) {
      setError('Ошибка при очистке токена');
    }
  }, [storage]);

  // Инициализация токена при загрузке
  useEffect(() => {
    const initializeToken = async () => {
      try {
        const storedIcalToken = await storage.get('ical_token');
        const storedJwtToken = await storage.get('jwt_token');

        if (storedIcalToken) {
          setIcalTokenState(storedIcalToken);

          // Если есть JWT - используем его
          if (storedJwtToken) {
            setJwtTokenState(storedJwtToken);
            const valid = await validateToken(storedJwtToken);
            setIsValid(valid);
          } else {
            // Автоматическая миграция: есть iCal, но нет JWT
            const jwt = await exchangeToken(storedIcalToken);
            if (jwt) {
              await storage.set('jwt_token', jwt);
              setJwtTokenState(jwt);
              setIsValid(true);
            } else {
              // Обмен не удался, попытка будет при следующей загрузке
              setIsValid(false);
            }
          }
        }
      } catch (_err) {
        setError('Ошибка при инициализации токена');
      } finally {
        setIsLoading(false);
      }
    };

    void initializeToken();
  }, [storage, exchangeToken]);

  const value = useMemo(
    () => ({
      icalToken,
      jwtToken,
      isValid,
      isLoading,
      error,
      isServiceAvailable,
      setToken,
      validateToken,
      clearToken,
    }),
    [
      icalToken,
      jwtToken,
      isValid,
      isLoading,
      error,
      isServiceAvailable,
      setToken,
      validateToken,
      clearToken,
    ],
  );

  return (
    <IcalTokenContext.Provider value={value}>
      {children}
    </IcalTokenContext.Provider>
  );
};
