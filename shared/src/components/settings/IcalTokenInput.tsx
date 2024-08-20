import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useRef } from 'react';
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

  const icalTokenCorrect = useMemo<boolean>(
    () =>
      !!icalTokenQuery.data &&
      icalTokenQuery.data.match(/^[0-9A-Z]{16}$/)?.length === 1,
    [icalTokenQuery.data],
  );
  const icalValidationQuery = useQuery(
    {
      queryKey: ['ical_token_validation'],
      queryFn: () => httpClient.mapi.validateIcal(icalTokenQuery.data!),
      enabled: icalTokenCorrect,
      retry: false,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );

  const icalTokenPresent = useMemo<boolean>(
    () => icalValidationQuery.data !== undefined && icalTokenCorrect,
    [icalTokenCorrect, icalValidationQuery.data],
  );

  const authResult = useMemo<
    'valid' | 'invalid' | 'missing' | 'server_error'
  >(() => {
    if (!icalTokenPresent) return 'missing';
    if (icalValidationQuery.data === true) return 'valid';
    if (icalValidationQuery.data === false) return 'invalid';
    return 'server_error';
  }, [icalTokenPresent, icalValidationQuery.data]);

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

  let authResultText: string;
  switch (authResult) {
    case 'valid':
      authResultText = 'Авторизация успешна';
      break;
    case 'invalid':
      authResultText = 'Токен не прошел проверку';
      break;
    case 'server_error':
      authResultText = 'Сервер авторизации недоступен';
      break;
    default:
      authResultText =
        'В ожидании токена. Токен должен состоять из 16 латинских букв и цифр.';
  }

  const internalHandler = () => {
    let { value } = inputRef.current!;
    if (value.startsWith('https://')) {
      const words = value.split('/');
      value = words[words.length - 1];
    }

    void storage.set('ical_token', value);
    void queryClient.invalidateQueries({ queryKey: ['ical_token'] });
    setTimeout(
      () =>
        void queryClient.invalidateQueries({
          queryKey: ['ical_token_validation'],
        }),
      100,
    );
    inputRef.current!.value = value;
  };

  const handleSubmit: React.FormEventHandler<HTMLInputElement> &
    React.FormEventHandler<HTMLFormElement> = () => {
    internalHandler();
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    internalHandler();
  };

  const tokenMasked = useMemo(() => {
    if (icalTokenPresent) {
      const icalToken = icalTokenQuery.data!;
      return (
        icalToken.substring(0, icalToken.length / 2) +
        '*'.repeat(Math.ceil(icalToken.length / 2.0))
      );
    }
    return '';
  }, [icalTokenPresent, icalTokenQuery.data]);

  return (
    <div className={`flex flex-row ${className}`}>
      <div className="relative rounded-3xl flex-[1_0_0] mr-2 h-12 bg-c_bg-block dark:bg-cd_bg-block">
        <Button
          className={`h-full w-full rounded-3xl c3 ${
            animEnabled ? 'transition-all duration-200 ease-in-out' : ''
          }`}
          onClick={() => {
            inputRef.current?.focus();
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
                  : ''
            }`}
          >
            Авторизация
          </p>
        </Button>
      </div>

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
        {icalTokenPresent && <p>Ваш токен: {tokenMasked}</p>}
        <br />
        <ClearableInput
          placeholder="Ваш токен"
          onSubmit={handleSubmit}
          onBlur={handleBlur}
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
        <div className="flex flex-row gap-4 items-center mt-2">
          <AuthResultIcon />
          <p className="flex-[1_0_0]">{authResultText}</p>
        </div>
      </Modal>
    </div>
  );
};

export default IcalTokenInput;
