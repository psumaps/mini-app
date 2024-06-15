import React, { useRef, useState } from 'react';
import Block from '../../common/block';
import Input from './input';
import PopUpHeader from './popUpHeader';
import { PopUpState } from './searchUtils';
import Search from './search';
import Poi from '~/src/network/models/mapi/poi';

const SearchPopUp = ({
  state,
  setState,
  onSelect,
}: {
  state: PopUpState;
  setState: React.Dispatch<React.SetStateAction<PopUpState>>;
  onSelect?: (poi: Poi) => void;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Block
      className={`absolute rounded-none bottom-0 overflow-y-clip right-0 left-0 transition-all duration-500 ease-in-out 
        ${state === 'opened' ? 'h-full' : ''} ${state === 'middle' ? 'h-24' : 'h-14'}
        ${state === 'opened' ? '' : 'rounded-t-3xl'}`}
    >
      <PopUpHeader
        state={state}
        setState={setState}
        inputRef={searchInputRef}
      />
      <div
        className={`absolute left-0 right-0 p-4 transition-all duration-500 ease-in-out flex flex-col gap-4
          ${state === 'opened' ? 'top-12' : 'top-12 py-0'}
          ${state === 'closed' ? 'h-0' : 'bottom-0'}`}
      >
        <Input
          ref={searchInputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            setState('opened');
          }}
          onClear={() => setSearchValue('')}
          type="search"
          inputMode="search"
          className={`transition-all duration-500 ease-in-out
            ${state === 'opened' || state === 'middle' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
          placeholder="Поиск"
        />
        <div
          className={`flex-[1_1_auto] overflow-y-auto overflow-x-clip ${state === 'opened' ? 'scale-y-100' : 'scale-y-0'}`}
        >
          <Search entry={searchValue} state={state} onSelect={onSelect} />
        </div>
      </div>
    </Block>
  );
};

export default SearchPopUp;
