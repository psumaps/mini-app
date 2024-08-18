import React, { useCallback, useEffect } from 'react';
import SearchIcon from '../../../assets/search.svg?react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import Poi from '../../../network/models/mapi/poi';
import DragHandle from '../../common/dragHandle';
import SwipeGesture from '../../common/swipeGesture';
import PoiInfo from './poiInfo';
import { PopUpBodyRef } from './popUpUtils';
import { PopUpState } from './search/searchUtils';
import ShareButton from './sharePoiButton';

const PopUpHeader = ({
  state,
  setState,
  inputRef,
  selectedPoi,
  setSelectedPoi,
}: {
  state: PopUpState;
  setState: React.Dispatch<PopUpState>;
  inputRef: React.RefObject<PopUpBodyRef>;
  selectedPoi: Poi | null;
  setSelectedPoi: React.Dispatch<React.SetStateAction<Poi | null>>;
}) => {
  const { data: animEnabled } = useAnimEnabled();
  const [selectedPoiInner, setSelectedPoiInner] = React.useState<Poi | null>(
    null,
  );

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    switch (direction) {
      case 'up':
        if (!selectedPoi) setState('opened');
        break;
      case 'down':
        setState('closed');
        break;
      default:
    }
  };

  useEffect(() => {
    if (selectedPoi !== null) setSelectedPoiInner(selectedPoi);
  }, [selectedPoi]);

  const handleClosedClick = useCallback(() => {
    if (state !== 'closed') return;
    setState('middle');
    if (selectedPoi === null) inputRef.current?.current?.focus?.();
  }, [state, setState, inputRef, selectedPoi]);

  const handleClearPoi = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setSelectedPoi(null);
  };

  return (
    <div
      className={`absolute z-10
          ${state === 'opened' || state === 'middle' ? 'top-0 left-0 right-0 h-[15dvh]' : 'inset-0'}`}
    >
      <SwipeGesture
        onSwipe={handleSwipe}
        id="popup-swipe"
        onTouch={handleClosedClick}
      >
        <div className="size-full items-center relative cursor-pointer pt-2">
          <DragHandle
            className={`${state === 'opened' ? 'mt-[0.5rem_!important]' : 'mt-[0_!important]'} ${state === 'middle' ? 'delay-200' : ''}`}
          />
          <div
            className={`absolute top-0 left-0 right-0 flex flex-row items-center px-4 mt-4 h-fit origin-top 
              ${animEnabled && 'transition-all duration-500 ease-in-out'}
              ${state === 'closed' && selectedPoi === null ? 'scale-y-100 opacity-100' : 'opacity-0 scale-y-0'}`}
          >
            <SearchIcon className="size-6 stroke-c_main dark:stroke-cd_main absolute top-0 left-4" />
            <p className="mx-auto z-[-1]">Поиск</p>
          </div>
          <div
            className={`absolute top-2 left-0 right-0 flex flex-row items-center px-2 mt-4 h-fit origin-bottom
              ${animEnabled && 'transition-all duration-500 ease-in-out'}
              ${(state === 'closed' || state === 'middle') && !!selectedPoi ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
              ${state === 'opened' || state === 'middle' ? 'origin-top' : ''}`}
          >
            <PoiInfo
              item={selectedPoiInner}
              onClick={() => {}}
              classNameInner=""
              className="px-4"
            />
            {selectedPoi && selectedPoi.properties.tags.id && (
              <div className="absolute right-12">
                <ShareButton id={selectedPoi.properties.tags.id} />
              </div>
            )}
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
        </div>
      </SwipeGesture>
    </div>
  );
};

export default PopUpHeader;
