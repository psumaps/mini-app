import React, { useRef, useState } from 'react';
import Block from '../../common/block';
import Input from './input';
import PopUpHeader from './popUpHeader';
import { PopUpState } from './searchUtils';

const SearchPopUp = ({
  state,
  setState,
}: {
  state: PopUpState;
  setState: React.Dispatch<React.SetStateAction<PopUpState>>;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Block // eslint-disable-next-line no-nested-ternary
      className={`absolute rounded-none rounded-t-3xl bottom-0 right-0 left-0 transition-all duration-500 ease-in-out ${state === 'opened' ? 'h-full' : state === 'middle' ? 'h-20' : 'h-14'}`}
    >
      <PopUpHeader
        state={state}
        setState={setState}
        inputRef={searchInputRef}
      />
      <div
        className={`absolute left-0 right-0 p-4 transition-all duration-500 ease-in-out flex 
          ${state === 'opened' ? 'top-12' : 'top-8 py-0'}`}
      >
        <Input
          ref={searchInputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClear={() => {
            setSearchValue('');
            if (searchInputRef.current) searchInputRef.current.focus();
          }}
          type="search"
          inputMode="search"
          className={`h-fit w-full px-4 py-1 transition-all duration-500 ease-in-out 
            ${state === 'opened' || state === 'middle' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
          placeholder="Поиск"
        />
        <div
          className={`${state === 'opened' ? 'scale-y-100' : 'scale-y-0'}`}
        />
      </div>
    </Block>
  );
};

export default SearchPopUp;
