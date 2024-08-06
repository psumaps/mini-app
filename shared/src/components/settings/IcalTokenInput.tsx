import React, { useRef } from 'react';
import ClearableInput from '../common/clearableInput';
import IStorage from '../../models/storage';
import Button from '../common/button';
import useIcalToken from '../../hooks/useIcalToken';
import useTryQueryClient from '../../hooks/useTryQueryClient';
import useAnimEnabled from '../../hooks/useAnimEnabled';

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
  const handleSubmit: React.FormEventHandler<HTMLInputElement> &
    React.FormEventHandler<HTMLFormElement> = () => {
    void storage.set('ical_token', inputRef.current!.value);
    void queryClient.invalidateQueries({ queryKey: ['ical_token'] });
    setState('closed');
  };

  return (
    <div
      className={`relative rounded-3xl h-12 w-full bg-c_bg-block dark:bg-cd_bg-block ${className}`}
    >
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
          state === 'opened' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
        placeholder="Ваш ical токен"
        onSubmit={handleSubmit}
        onClear={() => setState('closed')}
        ref={inputRef}
        alwaysShowClear={false}
      />
    </div>
  );
};

export default IcalTokenInput;
