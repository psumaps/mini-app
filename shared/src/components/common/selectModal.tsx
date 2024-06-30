import React from 'react';
import Block from './block';
import Button from './button';
import useAnimEnabled from '../../hooks/useAnimEnabled';
import SwipeGesture from './swipeGesture';
import DragHandle from './dragHandle';

const SelectModal = ({
  options,
  title,
  className,
  chosenOption,
  onSelect,
  onClose,
}: {
  options: { label: string; value: string }[];
  chosenOption: string | null;
  title: string;
  className?: string;
  onSelect: (optionValue: string) => void;
  onClose: () => void;
}) => {
  const { data: animEnabled } = useAnimEnabled();
  return (
    <Block
      className={`fixed left-0 right-0 h-[92dvh] rounded-none rounded-t-3xl flex flex-col z-40 ${
        animEnabled ? 'transition-all duration-500 ease-in-out' : ''
      } ${className}`}
    >
      <div className="h-20 w-full">
        <SwipeGesture
          onSwipe={(direction) => direction === 'down' && onClose()}
          onTouch={() => {}}
          id={title}
        >
          <DragHandle className="mb-4" />
          <h2 className="w-fit mx-auto flex mb-4">{title}</h2>
        </SwipeGesture>
      </div>
      <div className="overflow-y-auto">
        {options.map((option) => (
          <Button
            className="w-full text-left px-4 py-1 my-1 rounded-3xl text-wrap flex flex-row [justify-content:flex-start_!important]"
            variant={option.value === chosenOption ? 'accent' : 'primary'}
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </Block>
  );
};

export default SelectModal;
