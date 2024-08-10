import React from 'react';
import Block from './block';
import DragHandle from './dragHandle';
import SwipeGesture from './swipeGesture';
import useAnimEnabled from '../../hooks/useAnimEnabled';

const Modal = ({
  children,
  className,
  onClose,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  title: string;
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
      <div className="overflow-y-auto">{children}</div>
    </Block>
  );
};

export default Modal;
