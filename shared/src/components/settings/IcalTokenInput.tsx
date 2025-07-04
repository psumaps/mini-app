import React, { useRef, useState, useEffect } from 'react';
import CheckSvg from '../../assets/check-circle.svg?react';
import MinusSvg from '../../assets/minus-circle.svg?react';
import CrossSvg from '../../assets/x-circle.svg?react';
import useAnimEnabled from '../../hooks/useAnimEnabled';
import { useIcalToken } from '../../contexts/IcalTokenContext';
import Button from '../common/button';
import ClearableInput from '../common/clearableInput';
import Modal from '../common/modal';

// Минимальное время проверки токена (мс)
const MIN_VALIDATION_TIME = 800;

// Компоненты для отображения статуса авторизации
const StatusIcon = ({
  isLoading,
  isValid,
  hasError,
}: {
  isLoading: boolean;
  isValid: boolean;
  hasError: boolean;
}) => {
  if (isLoading)
    return <MinusSvg className="size-10 stroke-c_main dark:stroke-cd_main" />;

  if (isValid) return <CheckSvg className="size-10 stroke-green-700" />;
  if (hasError) return <CrossSvg className="size-10 stroke-red-700" />;
  return <MinusSvg className="size-10 stroke-c_main dark:stroke-cd_main" />;
};

const StatusText = ({
  isLoading,
  isValid,
  error,
}: {
  isLoading: boolean;
  isValid: boolean;
  error: string | null;
}) => {
  if (isLoading) return 'Проверяем...';
  if (isValid) return 'Авторизация успешна';
  if (error) return error;
  return 'В ожидании токена. Токен должен состоять из 16 латинских букв и цифр.';
};

interface Props {
  className?: string;
}

const IcalTokenInput = ({ className }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: animEnabled } = useAnimEnabled();
  const [state, setState] = useState<'opened' | 'closed'>('closed');
  const [isShaking, setIsShaking] = useState(false);
  const [isManuallyValidating, setIsManuallyValidating] = useState(false);
  const [lastProcessedToken, setLastProcessedToken] = useState<string>('');

  const { token, isValid, isLoading, error, setToken, clearToken } =
    useIcalToken();

  // Эффект для отображения анимации тряски при ошибке
  useEffect(() => {
    if (isManuallyValidating && !isLoading && error && !isValid) {
      handleShake();
      setIsManuallyValidating(false);
    }
  }, [isLoading, error, isValid, isManuallyValidating]);

  const handleShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 700);
  };

  // Обработка и проверка токена
  const processToken = (inputValue: string) => {
    if (!inputValue) return '';

    // Обработка URL с токеном
    let processedToken = inputValue;
    if (processedToken.startsWith('https://')) {
      const words = processedToken.split('/');
      processedToken = words[words.length - 1];
    }

    return processedToken.trim();
  };

  const validateTokenWithDelay = async (tokenToValidate: string) => {
    if (isLoading || tokenToValidate === lastProcessedToken) return;

    setLastProcessedToken(tokenToValidate);
    setIsManuallyValidating(true);

    // Запускаем таймер минимального времени проверки
    const startTime = Date.now();

    try {
      // Выполняем проверку токена
      await setToken(tokenToValidate);

      // Проверяем, прошло ли минимальное время
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_VALIDATION_TIME) {
        // Если нет, ждем оставшееся время
        await new Promise((resolve) => {
          setTimeout(resolve, MIN_VALIDATION_TIME - elapsedTime);
        });
      }
    } catch (err) {
      // Обработка ошибок
      console.error('Ошибка при проверке токена:', err);
      handleShake();
    } finally {
      setIsManuallyValidating(false);
    }
  };

  const handleTokenSubmit = () => {
    if (!inputRef.current) return;

    const processedToken = processToken(inputRef.current.value);
    if (!processedToken) return;

    void validateTokenWithDelay(processedToken);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Получаем вставленный текст
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    // Обрабатываем токен
    const processedToken = processToken(pastedText);
    if (!processedToken) return;

    // Устанавливаем обработанный токен в поле ввода и проверяем его
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = processedToken;
      }

      // Автоматически проверяем токен
      void validateTokenWithDelay(processedToken);
    }, 0);
  };

  const handleClearToken = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    void clearToken();
  };

  // Маскирование токена для отображения
  const tokenMasked = token
    ? `${token.substring(0, token.length / 2)}${'*'.repeat(Math.ceil(token.length / 2.0))}`
    : '';

  // Определяем класс для статуса
  const getStatusClass = () => {
    if (error) return 'text-red-700';
    if (isValid) return 'text-green-700';
    return 'text-c_main';
  };

  const statusClass = getStatusClass();

  // Определяем, показывать ли индикатор загрузки
  const showLoading = isLoading || isManuallyValidating;

  return (
    <div className={`flex flex-row ${className}`}>
      <Button
        className={`rounded-3xl dark:bg-cd_textHeader h-12 w-full ${
          animEnabled ? 'transition-all duration-200 ease-in-out' : ''
        }`}
        onClick={() => {
          setState('opened');
        }}
      >
        <p className={`c3 ${statusClass}`}>Авторизация</p>
      </Button>

      {state === 'opened' && (
        <div
          className="absolute top-0 left-0 w-full h-full z-40"
          onClick={() => setState('closed')}
        />
      )}

      <Modal
        title="Авторизация ЕТИС"
        onClose={() => setState('closed')}
        className={`origin-bottom z-50 bottom-[8dvh] h-[fit-content_!important] ${
          state === 'opened' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''} `}
      >
        <div className="overflow-hidden">
          {isValid && token && <p>Ваш токен: {tokenMasked}</p>}
          <br />
          <ClearableInput
            placeholder="Ваш токен"
            onSubmit={handleTokenSubmit}
            onBlur={handleTokenSubmit}
            onPaste={handlePaste}
            onClear={handleClearToken}
            ref={inputRef}
            alwaysShowClear={false}
          />
          <br />
          <p>
            1. Перейдите на &nbsp;
            <a
              href="https://student.psu.ru/pls/stu_cus_et/stu.timetable"
              target="_blank"
              className="underline text-c_accent"
              rel="noreferrer"
            >
              страницу расписания
            </a>
            &nbsp; в ЕТИС.
          </p>
          <p>
            2. Нажмите кнопку &quot;Показать&quot; рядом с надписью
            &quot;Синхронизация календаря с внешними сервисами&quot;, при
            наличии нажмите кнопку &quot;Подписаться&quot;
          </p>
          <p>3. Скопируйте ссылку, затем вставьте её в поле выше.</p>
          <br />
          <h4>Статус авторизации</h4>
          <div
            className={`flex flex-row gap-4 items-center mt-2 ${isShaking ? 'animate-shake' : ''}`}
          >
            <StatusIcon
              isLoading={showLoading}
              isValid={isValid}
              hasError={!!error}
            />
            <p className="flex-[1_0_0]">
              <StatusText
                isLoading={showLoading}
                isValid={isValid}
                error={error}
              />
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IcalTokenInput;
