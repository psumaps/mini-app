import React, { useEffect, useRef, useState } from 'react';
import Block from '../../common/block';
import Input from './input';
import PopUpHeader from './popUpHeader';
import { PopUpState } from './searchUtils';
import Search from './search';
import Poi from '../../../network/models/mapi/poi';
import SearchEntry from './searchEntry';

const SearchPopUp = ({
  state,
  setState,
  onSelect,
  selectedPoi,
  setSelectedPoi,
}: {
  state: PopUpState;
  setState: React.Dispatch<React.SetStateAction<PopUpState>>;
  onSelect?: (poi: Poi) => void;
  selectedPoi: Poi | null;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedPoiInner, setSelectedPoiInner] = useState<Poi | null>(null);

  useEffect(() => {
    if (selectedPoi !== null) setSelectedPoiInner(selectedPoi);
  }, [selectedPoi]);

  const handleClearPoi = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setSelectedPoi(null);
  };

  return (
    <Block
      className={`absolute rounded-none bottom-0 overflow-y-clip right-0 left-0 transition-all duration-500 ease-in-out z-10
        ${state === 'opened' ? 'h-full' : ''} 
        ${state === 'middle' ? 'h-24' : 'h-14'}
        ${state === 'opened' ? '' : 'rounded-t-3xl'}`}
    >
      <PopUpHeader
        state={state}
        setState={setState}
        inputRef={searchInputRef}
        selectedPoi={selectedPoi}
        setSelectedPoi={setSelectedPoi}
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
            ${
              (state === 'opened' || state === 'middle') && selectedPoi === null
                ? 'scale-y-100 opacity-100'
                : 'scale-y-0 opacity-0'
            }`}
          placeholder="Поиск"
        />
        <div
          className={`absolute -top-2 left-0 right-0 px-4 origin-bottom transition-all duration-500 ease-in-out
            ${selectedPoi === null || state === 'closed' ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}
        >
          <SearchEntry
            item={selectedPoiInner}
            onClick={() => {}}
            classNameInner=""
          />
          <button
            type="button"
            onClick={handleClearPoi}
            onTouchStartCapture={handleClearPoi}
            className="absolute top-1/2 -translate-y-1/2 right-4 size-6 z-20"
            title="Очистить выбранную точку"
          >
            <div className="w-full h-[1px] origin-center rotate-45 bg-c_secondary dark:bg-cd_secondary" />
            <div className="w-full h-[1px] origin-center -rotate-45 bg-c_secondary dark:bg-cd_secondary" />
          </button>
        </div>
        <div
          className={`flex-[1_1_auto] overflow-y-auto overflow-x-clip 
            ${state === 'opened' ? 'scale-y-100' : 'scale-y-0'}`}
        >
          <Search
            entry={searchValue}
            state={state}
            onSelect={onSelect}
            selectedPoi={selectedPoi}
          />
        </div>
      </div>
    </Block>
  );
};

export default SearchPopUp;
