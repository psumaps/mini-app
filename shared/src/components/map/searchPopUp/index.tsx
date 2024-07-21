import React, { useEffect, useRef } from 'react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import Poi from '../../../network/models/mapi/poi';
import Block from '../../common/block';
import PopUpBody from './popUpBody';
import PopUpHeader from './popUpHeader';
import { PopUpState } from './search/searchUtils';
import { calculatePopUpHeight } from './popUpUtils';

const SearchPopUp = ({
  state,
  setState,
  onSelect,
  selectedPoi,
  setSelectedPoi,
  id,
}: {
  state: PopUpState;
  setState: React.Dispatch<React.SetStateAction<PopUpState>>;
  onSelect?: (poi: Poi) => void;
  selectedPoi: Poi | null;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
  id: string;
}) => {
  const { data: animEnabled } = useAnimEnabled();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      calculatePopUpHeight(id, state, selectedPoi);
    }, 33);
    return () => clearInterval(interval);
  }, [state, id, selectedPoi]);

  return (
    <Block
      id={id}
      className={`absolute rounded-none bottom-0 overflow-y-clip right-0 left-0 z-10 
        ${animEnabled && 'transition-all duration-500 ease-in-out'}
        ${state === 'opened' ? '' : 'rounded-t-3xl'}`}
    >
      <PopUpHeader
        state={state}
        setState={setState}
        inputRef={searchInputRef}
        selectedPoi={selectedPoi}
        setSelectedPoi={setSelectedPoi}
      />
      <PopUpBody
        ref={searchInputRef}
        state={state}
        setState={setState}
        selectedPoi={selectedPoi}
        onSelect={onSelect}
      />
    </Block>
  );
};

export default SearchPopUp;
