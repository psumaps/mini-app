import React, { ChangeEvent, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { useSwipeable } from 'react-swipeable';
import Button from '../../common/button';
import CheckableText from '../../common/checkableText';
import CrossIcon from '../../../assets/cross.svg?react';
import Filter from '../../../network/models/psu-tools/eventFilter';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import DragHandle from '../../common/dragHandle';

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  filters: Filter[] | null;
  query: UseQueryResult<Filter[], Error>;
  setFilters: (
    event: ChangeEvent<HTMLInputElement>,
    filterId: string,
    valueId: string,
  ) => void;
}

const Modal = (props: ModalProps) => {
  const { data: animEnabled } = useAnimEnabled();
  const { active, setActive, setFilters, filters, query } = props;

  const [stopScroll, setStopScroll] = useState(false);

  const handlers = useSwipeable({
    onSwipeStart: () => setStopScroll(true),
    onSwiped: (eventData) => {
      setStopScroll(false);
      switch (eventData.dir) {
        case 'Down':
          setActive(false);
          break;
        default:
      }
    },
  });
  return (
    <div
      className={`mt-8 fixed inset-0 flex items-center justify-center z-30
        ${animEnabled && 'transition-all duration-300'} ${
          active
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 pointer-events-none translate-y-full'
        }`}
    >
      <div // eslint-disable-next-line no-useless-escape
        className={`bg-cd_main dark:bg-cd_bg-block w-screen h-screen rounded-forty p-4 shadow-[0_0px_0.6rem_0px_var(--c\_shadow)] dark:shadow-none overflow-y-auto
          ${animEnabled && 'transition-opacity duration-300 ease-in-out'}`}
      >
        <div className="flex pr-4 pl-4 mb-10  relative">
          <div
            className="size-full"
            {...handlers}
            style={{ touchAction: stopScroll ? 'none' : 'auto' }}
          >
            <DragHandle className="mb-4 w-[20%]" />
            <h2 className="mx-auto text-center c_textHeader dark:text-cd_main">
              Фильтры
            </h2>
          </div>
          <Button
            onClick={() => setActive(false)}
            className="absolute top-1/4 -translate-y-1/2 right-2 p-2 bg-inherit"
          >
            <CrossIcon className="size-4" />
          </Button>
        </div>
        {/* eslint-disable-next-line no-nested-ternary */}
        {query.isPending ? (
          <p>Загрузка...</p>
        ) : query.isError ? (
          <p>Ошибка!</p>
        ) : (
          <div className="flex gap-x-1.5 gap-y-4 flex-wrap justify-center">
            {filters?.map((filter) => (
              <CheckableText
                key={filter.id}
                filterId={filter.id}
                valueId={filter.id}
                label={filter.name}
                isChecked={filter.isChecked}
                onChange={setFilters}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
