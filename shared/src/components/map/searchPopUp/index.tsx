import React, { useRef } from 'react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import Poi from '../../../network/models/mapi/poi';
import Block from '../../common/block';
import PopUpBody from './popUpBody';
import PopUpHeader from './popUpHeader';
import { PopUpState } from './search/searchUtils';

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
  const { data: animEnabled } = useAnimEnabled();
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <Block
      className={`absolute rounded-none bottom-0 overflow-y-clip right-0 left-0 z-10 
        ${animEnabled && 'transition-all duration-500 ease-in-out'}
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
      <PopUpBody
        ref={searchInputRef}
        state={state}
        setState={setState}
        selectedPoi={selectedPoi}
        setSelectedPoi={setSelectedPoi}
        onSelect={onSelect}
      />
    </Block>
  );
};

export default SearchPopUp;
