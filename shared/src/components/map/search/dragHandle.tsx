import React from 'react';
import { PopUpState } from './searchUtils';
import useAnimEnabled from '../../../hooks/useAnimEnabled';

const DragHandle = ({ state }: { state: PopUpState }) => {
  const { data: animEnabled } = useAnimEnabled();
  return (
    <div
      className={`w-[10%] h-[0.2rem] bg-c_secondary dark:bg-cd_secondary mx-auto rounded-full mt-2 
        ${animEnabled && 'transition-all duration-200 ease-in-out'} 
        ${state === 'opened' ? 'mt-4' : ''}
        ${state === 'middle' ? 'delay-200' : ''}`}
    />
  );
};

export default DragHandle;
