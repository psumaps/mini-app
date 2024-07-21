import React, { forwardRef, useEffect, useState } from 'react';
import Input from './input';
import PoiInfo from './poiInfo';
import PoiInfoDetails from './poiInfoDetails';
import Search from './search';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import { PopUpState } from './search/searchUtils';
import Poi from '../../../network/models/mapi/poi';
import { popUpBodyPoiContainerId, popUpSearchInputId } from './popUpUtils';

const PopUpBody = forwardRef(function PopUpBody(
  {
    state,
    setState,
    selectedPoi,
    setSelectedPoi,
    onSelect,
  }: {
    state: PopUpState;
    setState: React.Dispatch<React.SetStateAction<PopUpState>>;
    selectedPoi: Poi | null;
    setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
    onSelect?: (poi: Poi) => void;
  },
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { data: animEnabled } = useAnimEnabled();
  const [selectedPoiInner, setSelectedPoiInner] = useState<Poi | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

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

  const inputStyles =
    (state === 'opened' || state === 'middle') && selectedPoi === null
      ? 'scale-y-100 opacity-100'
      : 'scale-y-0 opacity-0';

  return (
    <div
      className={`absolute left-0 right-0 p-4 flex flex-col gap-4 
          ${animEnabled && 'transition-all duration-500 ease-in-out'} 
          ${state === 'opened' ? 'top-12' : 'top-12 py-0'}
          ${state === 'closed' ? 'h-0' : 'bottom-0'}`}
    >
      <Input
        id={popUpSearchInputId}
        ref={ref}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          setState('opened');
        }}
        onClear={() => setSearchValue('')}
        type="search"
        inputMode="search"
        className={`${animEnabled && 'transition-all duration-500 ease-in-out'} ${inputStyles}`}
        placeholder="Поиск"
      />
      <div
        id={popUpBodyPoiContainerId}
        className={`absolute -top-2 left-0 right-0 px-2 origin-bottom 
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${selectedPoi === null || state === 'closed' ? 'scale-y-0 opacity-0 h-0' : 'scale-y-100 opacity-100'}`}
      >
        <PoiInfo
          item={selectedPoiInner}
          onClick={() => {}}
          classNameInner=""
          className="px-4"
        />
        <button
          type="button"
          onClick={handleClearPoi}
          onTouchStartCapture={handleClearPoi}
          className="absolute top-0 right-4 size-6 z-20"
          title="Очистить выбранную точку"
        >
          <div className="w-full h-[1px] origin-center rotate-45 bg-c_secondary dark:bg-cd_secondary" />
          <div className="w-full h-[1px] origin-center -rotate-45 bg-c_secondary dark:bg-cd_secondary" />
        </button>
        <PoiInfoDetails item={selectedPoiInner} className="w-100 pt-3" />
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
  );
});

export default PopUpBody;
