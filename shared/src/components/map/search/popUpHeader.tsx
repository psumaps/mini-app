import React, { useCallback } from 'react';
import SwipeGesture from '../../common/swipeGesture';
import DragHandle from './dragHandle';
import { PopUpState } from './searchUtils';
import SearchIcon from '../../../assets/search.svg?react';

const PopUpHeader = ({
  state,
  setState,
  inputRef,
}: {
  state: PopUpState;
  setState: React.Dispatch<PopUpState>;
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    switch (direction) {
      case 'up':
        setState('opened');
        break;
      case 'down':
        setState('closed');
        break;
      default:
    }
  };

  const handleClosedClick = useCallback(() => {
    if (state !== 'closed') return;
    setState('middle');
    inputRef.current?.focus?.();
  }, [state, setState, inputRef]);

  return (
    <div
      className={`absolute
          ${state === 'opened' || state === 'middle' ? 'top-0 left-0 right-0 h-[15dvh]' : 'inset-0'}`}
    >
      <SwipeGesture
        onSwipe={handleSwipe}
        id="popup-swipe"
        onTouch={useCallback(() => handleClosedClick(), [handleClosedClick])}
      >
        <div className="size-full items-center relative cursor-pointer">
          <DragHandle state={state} />
          <div
            className={`absolute top-0 left-0 right-0 flex flex-row items-center px-4 mt-4 h-fit transition-all duration-500 ease-in-out origin-top
                ${state === 'closed' ? 'scale-y-100 opacity-100' : 'opacity-0 scale-y-0'}`}
          >
            <SearchIcon className="size-6 stroke-c_main dark:stroke-cd_main absolute top-0 left-4" />
            <p className="mx-auto z-[-1]">Поиск</p>
          </div>
        </div>
      </SwipeGesture>
    </div>
  );
};

export default PopUpHeader;
