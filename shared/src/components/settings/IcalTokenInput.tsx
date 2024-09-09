import { useQuery } from '@tanstack/react-query';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CheckSvg from '../../assets/check-circle.svg?react';
import MinusSvg from '../../assets/minus-circle.svg?react';
import CrossSvg from '../../assets/x-circle.svg?react';
import useAnimEnabled from '../../hooks/useAnimEnabled';
import useIcalToken from '../../hooks/useIcalToken';
import useTryQueryClient from '../../hooks/useTryQueryClient';
import IStorage from '../../models/storage';
import httpClient from '../../network/httpClient';
import Button from '../common/button';
import ClearableInput from '../common/clearableInput';
import Modal from '../common/modal';

const IcalTokenInput = ({
  storage,
  className,
}: {
  storage: IStorage;
  className?: string;
}) => {
  const queryClient = useTryQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const icalTokenQuery = useIcalToken();
  const { data: animEnabled } = useAnimEnabled();
  const [state, setState] = React.useState<'opened' | 'closed'>('closed');
  const [stagedToken, setStagedToken] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const icalTokenCorrect = useMemo(() => {
    const query = icalTokenQuery.data?.trim();
    return !!query && query.match(/^[0-9A-Z]{16}$/)?.length === 1;
  }, [icalTokenQuery.data]);

  const icalStageTokenCorrect = (token: string | null) => {
    const query = token?.trim();
    return !!query && query.match(/^[0-9A-Z]{16}$/)?.length === 1;
  };

  const icalValidationQuery = useQuery(
    {
      queryKey: ['ical_token_validation'],
      queryFn: () =>
        httpClient.mapi.validateIcal(
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          stagedToken || icalTokenQuery.data?.trim()!,
        ),
      enabled: icalStageTokenCorrect(stagedToken) || icalTokenCorrect,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
    queryClient,
  );

  useEffect(() => {
    if (location.hash.slice(1) === 'auth')
      setTimeout(() => setState('opened'), 50);
  }, []);

  const authResult = useMemo<
    'valid' | 'invalid' | 'missing' | 'server_error'
  >(() => {
    if (
      !icalValidationQuery.isFetched ||
      (stagedToken && !icalStageTokenCorrect(stagedToken))
    )
      return 'missing';
    if (icalValidationQuery.data === true) return 'valid';
    if (icalValidationQuery.data === false) return 'invalid';
    return 'server_error';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stagedToken, icalValidationQuery.data, stagedToken]);

  const handleShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 700);
  };

  useEffect(() => {
    if (stagedToken) {
      if (authResult === 'valid') {
        void storage.set('ical_token', stagedToken);
      } else if (authResult === 'invalid') {
        void storage.set('ical_token', '');
        handleShake();
      }
    }
    // зависимость от запроса, который иерархически сохраняет статус
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icalValidationQuery]);

  const AuthResultIcon = useCallback(() => {
    switch (authResult) {
      case 'valid':
        return <CheckSvg className="size-10 stroke-green-700" />;
      case 'invalid':
        return <CrossSvg className="size-10 stroke-red-700" />;
      case 'server_error':
        return <MinusSvg className="size-10 stroke-red-700" />;
      default:
        return (
          <MinusSvg className="size-10 stroke-c_main dark:stroke-cd_main" />
        );
    }
  }, [authResult]);

  const AuthResultText = useCallback(() => {
    switch (authResult) {
      case 'valid':
        return 'Авторизация успешна';
      case 'invalid':
        return 'Токен не прошел проверку';
      case 'server_error':
        return 'Сервер авторизации недоступен';
      default:
        return 'В ожидании токена. Токен должен состоять из 16 латинских букв и цифр.';
    }
  }, [authResult]);

  const handleTokenSubmit = () => {
    let { value } = inputRef.current!;
    if (value.startsWith('https://')) {
      const words = value.split('/');
      value = words[words.length - 1];
    }
    if (authResult !== 'valid' && stagedToken === value?.trim()) handleShake();

    setStagedToken(value?.trim());
    setTimeout(() => {
      if (icalStageTokenCorrect(value.trim()))
        void queryClient.invalidateQueries({
          queryKey: ['ical_token_validation'],
        });
      else handleShake();
    }, 150);
    inputRef.current!.value = value;
  };

  const tokenMasked = useMemo(() => {
    if (icalTokenCorrect || icalStageTokenCorrect(stagedToken)) {
      const token = stagedToken || icalTokenQuery.data!;
      return (
        token.substring(0, token.length / 2) +
        '*'.repeat(Math.ceil(token.length / 2.0))
      );
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stagedToken, icalTokenCorrect]);

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
        <p
          className={`c3 ${
            // eslint-disable-next-line no-nested-ternary
            authResult === 'invalid'
              ? 'text-red-700'
              : authResult === 'valid'
                ? 'text-green-700'
                : 'text-c_main'
          }`}
        >
          Авторизация
        </p>
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
        } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
      >
        {icalTokenCorrect && <p>Ваш токен: {tokenMasked}</p>}
        <br />
        <ClearableInput
          placeholder="Ваш токен"
          onSubmit={() => handleTokenSubmit()}
          onBlur={() => handleTokenSubmit()}
          onClear={() => {
            inputRef.current!.value = '';
          }}
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
          &quot;Синхронизация календаря с внешними сервисами&quot;, при наличии
          нажмите кнопку &quot;Подписаться&quot;
        </p>
        <p>3. Скопируйте ссылку, затем вставьте её в поле выше.</p>
        <br />
        <h4>Статус авторизации</h4>
        <div
          className={`flex flex-row gap-4 items-center mt-2 ${isShaking ? 'animate-shake' : ''} no-scrollbar`}
        >
          <AuthResultIcon />
          <p className="flex-[1_0_0]">
            <AuthResultText />
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default IcalTokenInput;
