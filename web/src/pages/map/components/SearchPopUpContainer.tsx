import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import SearchPopUp from 'psumaps-shared/src/components/map/searchPopUp';
import { SearchPopUpRef } from 'psumaps-shared/src/components/map/searchPopUp/popUpUtils';
import { PopUpState } from 'psumaps-shared/src/components/map/searchPopUp/search/searchUtils';
import Poi from 'psumaps-shared/src/network/models/mapi/poi';

interface SearchPopUpContainerProps {
  id: string;
  state: PopUpState;
  setState: React.Dispatch<React.SetStateAction<PopUpState>>;
  onSelect: (poi: Poi) => void;
  selectedPoi: Poi | null;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
}

export interface SearchPopUpContainerRef {
  search: (name: string) => void;
}

const SearchPopUpContainer = forwardRef<
  SearchPopUpContainerRef,
  SearchPopUpContainerProps
>(({ id, state, setState, onSelect, selectedPoi, setSelectedPoi }, ref) => {
  const searchPopUpRef = useRef<SearchPopUpRef>(null);

  useImperativeHandle(ref, () => ({
    search: (name: string) => searchPopUpRef.current?.search(name),
  }));

  return (
    <SearchPopUp
      ref={searchPopUpRef}
      id={id}
      state={state}
      setState={setState}
      onSelect={onSelect}
      selectedPoi={selectedPoi}
      setSelectedPoi={setSelectedPoi}
    />
  );
});

SearchPopUpContainer.displayName = 'SearchPopUpContainer';

export default SearchPopUpContainer;
