import React, { useRef } from 'react';
import ClearableInput from '../common/clearableInput';
import IStorage from '../../models/storage';
import Button from '../common/button';
import useIcalToken from '../../hooks/useIcalToken';
import useTryQueryClient from '../../hooks/useTryQueryClient';
import useAnimEnabled from '../../hooks/useAnimEnabled';
import Modal from '../common/modal';
import QuestionSvg from '../../assets/question.svg?react';

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
  const [modalOpened, setModalOpened] = React.useState(false);

  const handleSubmit: React.FormEventHandler<HTMLInputElement> &
    React.FormEventHandler<HTMLFormElement> = () => {
    let { value } = inputRef.current!;
    if (value.startsWith('https://')) {
      const words = value.split('/');
      value = words[words.length - 1];
    }

    void storage.set('ical_token', value);
    void queryClient.invalidateQueries({ queryKey: ['ical_token'] });
    setState('closed');
    inputRef.current!.value = '';
  };

  return (
    <div className={`flex flex-row ${className}`}>
      <div className="relative rounded-3xl flex-[1_0_0] mr-2 h-12 bg-c_bg-block dark:bg-cd_bg-block">
        <Button
          className={`absolute top-0 h-full w-fit left-1/2 -translate-x-1/2 c3 origin-top ${state === 'closed' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'} ${
            animEnabled ? 'transition-all duration-200 ease-in-out' : ''
          }`}
          onClick={() => setState('opened')}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {icalTokenQuery.isPending
            ? 'Загрузка...' /* eslint-disable-next-line no-nested-ternary */
            : icalTokenQuery.isError
              ? 'Ошибка при получении токена'
              : icalTokenQuery.data === null
                ? 'Введите ваш ical токен'
                : `Ваш ical токен: ${icalTokenQuery.data}`}
        </Button>
        <ClearableInput
          className={`absolute top-1/2 -translate-y-1/2 origin-bottom w-[96%] mx-auto ${
            state === 'opened'
              ? 'scale-y-100 opacity-100'
              : 'scale-y-0 opacity-0'
          } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
          placeholder="Ваш ical токен"
          onSubmit={handleSubmit}
          onClear={() => setState('closed')}
          ref={inputRef}
          alwaysShowClear={false}
        />
      </div>
      <Button
        onClick={() => setModalOpened(true)}
        className="relative flex rounded-3xl h-12 w-12 bg-c_bg-block dark:bg-cd_bg-block justify-center items-center"
      >
        <QuestionSvg className="size-10 stroke-c_main dark:stroke-cd_main" />
      </Button>
      {modalOpened && (
        <div
          className="absolute top-0 left-0 w-full h-full z-40"
          onClick={() => setModalOpened(false)}
        />
      )}
      <Modal
        title="Токен ical"
        onClose={() => setModalOpened(false)}
        className={`origin-bottom z-50 bottom-[8dvh] h-[fit-content_!important] ${
          modalOpened ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
      >
        <p>Ваш ical токен: {icalTokenQuery.data}</p>
        <br />
        <p>
          Токен доступен на&nbsp;
          <a
            href="https://student.psu.ru/pls/stu_cus_et/stu.timetable"
            className="underline text-c_accent"
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
