import React from 'react';
import { PopUpState } from './searchUtils';

const DragHandle = ({ state }: { state: PopUpState }) => {
  return (
    <div
      className={`w-[10%] h-[0.2rem] bg-c_secondary dark:bg-cd_secondary mx-auto rounded-full transition-all duration-200 ease-in-out mt-2
        ${state === 'opened' ? 'mt-4' : ''}
        ${state === 'middle' ? 'delay-200' : ''}`}
    />
  );
};

export default DragHandle;
