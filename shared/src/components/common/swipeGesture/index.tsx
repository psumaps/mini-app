import React, { useCallback, useEffect, useState } from 'react';
import { calcSwipeDirection } from './swipeGestureUtils';

const SwipeGesture = ({
  children,
  onSwipe,
  id = 'swipe-gesture',
  onTouch,
}: {
  children?: React.ReactNode;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  id?: string;
  onTouch?: (e: TouchEvent) => void;
}) => {
  const [xDown, setXDown] = useState<number | null>(null);
  const [yDown, setYDown] = useState<number | null>(null);
  const [timeDown, setTimeDown] = useState<number | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent): void => {
      const firstTouch = e.touches[0];
      setXDown(firstTouch.clientX);
      setYDown(firstTouch.clientY);
      setTimeDown(Date.now());

      if (onTouch) onTouch(e);

      e.preventDefault();
      e.stopPropagation();
    },
    [onTouch],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent): void => {
      if (xDown === null || yDown === null || timeDown === null) return;

      const direction = calcSwipeDirection({
        xDown,
        yDown,
        timeDown,
        xCurrent: e.touches[0].clientX,
        yCurrent: e.touches[0].clientY,
        timeCurrent: Date.now(),
      });

      if (!direction) return;

      onSwipe(direction);

      setXDown(null);
      setYDown(null);
      setTimeDown(null);
    },
    [onSwipe, xDown, yDown, timeDown],
  );

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return () => {}; // consistent-return

    element.addEventListener('touchstart', handleTouchStart, false);
    element.addEventListener('touchmove', handleTouchMove, false);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [xDown, yDown, id, handleTouchStart, handleTouchMove]);

  return (
    <div id={id} className="size-full">
      {children}
    </div>
  );
};

export default SwipeGesture;
