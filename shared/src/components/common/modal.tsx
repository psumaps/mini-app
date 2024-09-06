import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Block from './block';
import DragHandle from './dragHandle';
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
  const [stopScroll, setStopScroll] = useState(false);

  const handlers = useSwipeable({
    onSwipeStart: () => setStopScroll(true),
    onSwiped: (eventData) => {
      setStopScroll(false);
      if (eventData.dir === 'Down') onClose();
    },
  });
  return (
    <div {...handlers} style={{ touchAction: stopScroll ? 'none' : 'auto' }}>
      <Block
        className={`fixed left-0 right-0 h-[92dvh] rounded-none rounded-t-3xl flex flex-col z-40 ${
          animEnabled ? 'transition-all duration-500 ease-in-out' : ''
        } ${className}`}
      >
        <div className="h-20 w-full">
          <DragHandle className="mb-4" />
          <h2 className="w-fit mx-auto flex mb-4">{title}</h2>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </Block>
    </div>
  );
};

export default Modal;
