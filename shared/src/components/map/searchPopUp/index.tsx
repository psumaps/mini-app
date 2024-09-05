import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import Poi from '../../../network/models/mapi/poi';
import Block from '../../common/block';
import PopUpBody from './popUpBody';
import PopUpHeader from './popUpHeader';
import {
  calculatePopUpHeight,
  PopUpBodyRef,
  SearchPopUpRef,
} from './popUpUtils';
import { PopUpState } from './search/searchUtils';
import SettingsIcon from '../../../assets/settings.svg?react';
import { NavigatorContext } from '../../../models/navigator';

const SearchPopUp = forwardRef(function SearchPopUp(
  {
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
  },
  ref: React.ForwardedRef<SearchPopUpRef>,
) {
  const { data: animEnabled } = useAnimEnabled();
  const searchInputRef = useRef<PopUpBodyRef>(null);
  const navigator = useContext(NavigatorContext);

  useEffect(() => {
    const interval = setInterval(() => {
      calculatePopUpHeight(id, state, selectedPoi);
    }, 33);
    return () => clearInterval(interval);
  }, [state, id, selectedPoi]);

  useImperativeHandle(ref, () => ({
    search: (query: string) => {
      if (searchInputRef.current) searchInputRef.current.search(query);
    },
  }));

  return (
    <Block
      id={id}
      className={`absolute rounded-none bottom-0 overflow-y-clip right-0 left-0 z-10 
        ${animEnabled && 'transition-all duration-500 ease-in-out'}
        ${state === 'opened' ? '' : 'rounded-t-3xl'}`}
    >
      {state === 'unauthorized' ? (
        <div className="text-center c1 text-xl">
          Авторизация не пройдена.&#10;&#13;Введите токен в настройках&nbsp;
          <button
            type="button"
            onClick={() => navigator?.navigate('/settings#auth')}
            aria-label="Настройки"
          >
            <SettingsIcon className="fill-c_main dark:fill-cd_main size-6 pt-2" />
          </button>
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </Block>
  );
});

export default SearchPopUp;
