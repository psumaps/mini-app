import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useRef } from 'react';
import CheckSvg from '../../assets/check-circle.svg?react';
import InfoSvg from '../../assets/information-circle.svg?react';
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
  const [modalInstructionsOpened, setModalInstructionsOpened] =
    React.useState(false);
  const [modalValidationOpened, setModalValidationOpened] =
    React.useState(false);

  const icalTokenCorrect = useMemo<boolean>(
    () => !!icalTokenQuery.data && icalTokenQuery.data.length === 16,
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

  const AuthResultIcon = useCallback(
    () =>
      // if more conditions are needed, unwrap this into if statements
      // eslint-disable-next-line no-nested-ternary
      icalTokenPresent ? ( // eslint-disable-next-line no-nested-ternary
        icalValidationQuery.data === true ? (
          <CheckSvg className="size-10 stroke-green-700" />
        ) : icalValidationQuery.data === null ? (
          <MinusSvg className="size-10 stroke-red-700" />
        ) : (
          <CrossSvg className="size-10 stroke-red-700" />
        )
      ) : (
        <MinusSvg className="size-10 stroke-c_main dark:stroke-cd_main" />
      ),
    [icalValidationQuery.data, icalTokenPresent],
  );

  const handleSubmit: React.FormEventHandler<HTMLInputElement> &
    React.FormEventHandler<HTMLFormElement> = () => {
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
    setState('closed');
    inputRef.current!.value = '';
  };

  // if more conditions are needed, unwrap this into if statements
  // eslint-disable-next-line no-nested-ternary
  const authResultText = icalTokenPresent // eslint-disable-next-line no-nested-ternary
    ? icalValidationQuery.data === true
      ? 'Авторизация успешна'
      : icalValidationQuery.data === null
        ? 'Сервер авторизации недоступен'
        : 'Токен не прошел проверку'
    : 'В ожидании токена. Токен должен состоять из 16 латинских букв и цифр.';

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
          className={`absolute top-0 h-full w-fit left-1/2 -translate-x-1/2 c3 origin-top ${state === 'closed' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'} ${
            animEnabled ? 'transition-all duration-200 ease-in-out' : ''
          }`}
          onClick={() => {
            inputRef.current?.focus();
            setState('opened');
          }}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {icalTokenQuery.isPending
            ? 'Загрузка...' /* eslint-disable-next-line no-nested-ternary */
            : icalTokenQuery.isError
              ? 'Ошибка при получении токена'
              : icalTokenPresent
                ? `Ваш токен: ${tokenMasked}`
                : 'Введите ваш токен'}
        </Button>
        <ClearableInput
          className={`absolute top-1/2 -translate-y-1/2 origin-bottom w-[96%] mx-auto ${
            state === 'opened'
              ? 'scale-y-100 opacity-100'
              : 'scale-y-0 opacity-0'
          } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
          placeholder="Ваш токен"
          onSubmit={handleSubmit}
          onClear={() => setState('closed')}
          ref={inputRef}
          alwaysShowClear={false}
        />
      </div>

      {/* Modal background */}

      {(modalInstructionsOpened || modalValidationOpened) && (
        <div
          className="absolute top-0 left-0 w-full h-full z-40"
          onClick={() => {
            setModalValidationOpened(false);
            setModalInstructionsOpened(false);
          }}
        />
      )}

      {/* Auth Modal */}

      <Button
        onClick={() => setModalValidationOpened(true)}
        className="relative flex rounded-3xl h-12 w-12 mr-2 bg-c_bg-block dark:bg-cd_bg-block justify-center items-center"
      >
        <AuthResultIcon />
      </Button>
      <Modal
        title="Статус авторизации"
        onClose={() => setModalValidationOpened(false)}
        className={`origin-bottom z-50 bottom-[8dvh] h-[fit-content_!important] ${
          modalValidationOpened
            ? 'scale-y-100 opacity-100'
            : 'scale-y-0 opacity-0'
        } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
      >
        <div className="flex flex-row gap-4 items-center">
          <AuthResultIcon />
          <p className="flex-[1_0_0]">{authResultText}</p>
        </div>
      </Modal>

      {/* Instructions Modal */}

      <Button
        onClick={() => setModalInstructionsOpened(true)}
        className="relative flex rounded-3xl h-12 w-12 bg-c_bg-block dark:bg-cd_bg-block justify-center items-center"
      >
        <InfoSvg className="size-10 stroke-c_main dark:stroke-cd_main" />
      </Button>
      <Modal
        title="Авторизация ETIS"
        onClose={() => setModalInstructionsOpened(false)}
        className={`origin-bottom z-50 bottom-[8dvh] h-[fit-content_!important] ${
          modalInstructionsOpened
            ? 'scale-y-100 opacity-100'
            : 'scale-y-0 opacity-0'
        } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
      >
        <p>Ваш токен: {tokenMasked}</p>
        <br />
        <p>
          Токен доступен на&nbsp;
          <a
            href="https://student.psu.ru/pls/stu_cus_et/stu.timetable"
            target="_blank"
            className="underline text-c_accent"
            rel="noreferrer"
          >
            странице раписания
          </a>
          &nbsp; в ETIS. Нажмите &quot;Показать&quot; рядом с надписью
          &quot;Синхронизация календаря с внешними сервисами&quot; и скопируйте
          ссылку. Вставьте ссылку в поле, доступное по нажатию на кнопку
          &quot;Введите ваш ical токен&quot;.
        </p>
      </Modal>
    </div>
  );
};

export default IcalTokenInput;
