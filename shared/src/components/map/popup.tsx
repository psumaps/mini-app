import React, { useRef, useEffect, useState, useCallback } from 'react';
import Block from '../common/block';
import SwipeGesture from '../common/swipeGesture';
import SearchIcon from '../../assets/search.svg?react';
import Input from './input';

const Popup = ({
  state,
  setState,
}: {
  state: 'closed' | 'middle' | 'opened';
  setState: React.Dispatch<
    React.SetStateAction<'closed' | 'middle' | 'opened'>
  >;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [willFocusSearch, setWillFocusSearch] = useState<boolean>(false);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [willFocusSearch]);

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
    setState('middle');
    setWillFocusSearch((prev) => !prev);
  }, [setState, setWillFocusSearch]);

  return (
    <Block // eslint-disable-next-line no-nested-ternary
      className={`absolute rounded-none rounded-t-3xl bottom-0 right-0 left-0 transition-all duration-500 ease-in-out ${state === 'opened' ? 'h-full' : state === 'middle' ? 'h-20' : 'h-14'}`}
    >
      <div
        className={`absolute
          ${state === 'opened' || state === 'middle' ? 'top-0 left-0 right-0 h-[15dvh]' : 'inset-0'}`}
      >
        <SwipeGesture
          onSwipe={handleSwipe}
          id="popup-swipe"
          onTouch={useCallback(() => handleClosedClick(), [handleClosedClick])}
        >
          <div
            className="size-full items-center relative cursor-pointer"
            onClick={handleClosedClick}
          >
            <div
              className={`w-[10%] h-[0.2rem] bg-c_secondary dark:bg-cd_secondary mx-auto rounded-full transition-all duration-200 ease-in-out
              ${state === 'opened' || state === 'middle' ? 'opacity-100 scale-x-100 mt-4 delay-200' : 'opacity-0 scale-x-0'}`}
            />
            <div
              className={`absolute top-0 left-0 right-0 flex flex-row items-center px-4 pt-4 h-fit transition-all duration-500 ease-in-out origin-top
                ${state === 'closed' ? 'scale-y-100 opacity-100' : 'opacity-0 scale-y-0'}`}
            >
              <SearchIcon className="size-6 stroke-c_main dark:stroke-cd_main absolute top-4 left-4" />
              <p className="mx-auto z-[-1]">Поиск</p>
            </div>
          </div>
        </SwipeGesture>
      </div>
      <div
        className={`absolute left-0 right-0 p-4 transition-all duration-500 ease-in-out flex 
          ${state === 'opened' || state === 'middle' ? 'scale-y-100' : 'scale-y-0'}
          ${state === 'opened' ? 'top-12' : 'top-8 py-0'}`}
      >
        <Input
          ref={searchInputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClear={() => setSearchValue('')}
          type="text"
          className="h-fit w-full px-4 py-1"
          placeholder="Поиск"
        />
      </div>
    </Block>
  );
};

export default Popup;
