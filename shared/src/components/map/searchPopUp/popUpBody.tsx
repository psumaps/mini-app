import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import Poi from '../../../network/models/mapi/poi';
import Input from '../../common/clearableInput';
import PoiInfoDetails from './poiInfoDetails';
import {
  popUpBodyPoiContainerId,
  PopUpBodyRef,
  popUpSearchInputId,
} from './popUpUtils';
import Search from './search';
import { PopUpState } from './search/searchUtils';

const PopUpBody = forwardRef(function PopUpBody(
  {
    state,
    setState,
    selectedPoi,
    onSelect,
  }: {
    state: PopUpState;
    setState: React.Dispatch<React.SetStateAction<PopUpState>>;
    selectedPoi: Poi | null;
    onSelect?: (poi: Poi) => void;
  },
  ref: React.ForwardedRef<PopUpBodyRef>,
) {
  const { data: animEnabled } = useAnimEnabled();
  const [selectedPoiInner, setSelectedPoiInner] = useState<Poi | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedPoi !== null) setSelectedPoiInner(selectedPoi);
  }, [selectedPoi]);

  useImperativeHandle(ref, () => ({
    search: (value: string) => {
      setSearchValue(value);
      setState('opened');
    },
    get current() {
      return inputRef.current;
    },
  }));

  const inputStyles =
    (state === 'opened' || state === 'middle') && selectedPoi === null
      ? 'scale-y-100 opacity-100'
      : 'scale-y-0 opacity-0';

  return (
    <div
      className={`absolute left-0 right-0 p-4 flex flex-col gap-4 
        ${selectedPoi === null ? 'z-20' : ''} 
        ${animEnabled && 'transition-all duration-500 ease-in-out'} 
        ${state === 'opened' ? 'top-12' : 'top-12 py-0'}
        ${state === 'closed' ? 'h-0' : 'bottom-0'}`}
    >
      <Input
        id={popUpSearchInputId}
        ref={inputRef}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          setState('opened');
        }}
        onClear={() => setSearchValue('')}
        type="search"
        inputMode="search"
        className={`${animEnabled && 'transition-all duration-500 ease-in-out'} z-30 ${inputStyles}`}
        placeholder="Поиск"
      />
      <div
        id={popUpBodyPoiContainerId}
        className={`absolute -top-2 left-0 right-0 px-2 origin-bottom z-20
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${selectedPoi === null || state === 'closed' ? 'scale-y-0 opacity-0 h-0' : 'scale-y-100 opacity-100 mt-10 pb-10'}`}
      >
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
