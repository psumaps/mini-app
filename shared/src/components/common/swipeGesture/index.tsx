import React, { useCallback, useEffect, useState } from 'react';
import { calcSwipeDirection } from './swipeGestureUtils';

const SwipeGesture = ({
  children,
  onSwipe,
  id = 'swipe-gesture',
}: {
  children: React.ReactNode;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  id?: string;
}) => {
  const [xDown, setXDown] = useState<number | null>(null);
  const [yDown, setYDown] = useState<number | null>(null);
  const [timeDown, setTimeDown] = useState<number | null>(null);

  const handleTouchStart = useCallback((evt: TouchEvent): void => {
    const firstTouch = evt.touches[0];
    setXDown(firstTouch.clientX);
    setYDown(firstTouch.clientY);
    setTimeDown(Date.now());
  }, []);

  const handleTouchMove = useCallback(
    (evt: TouchEvent): void => {
      if (xDown === null || yDown === null || timeDown === null) return;

      const direction = calcSwipeDirection({
        xDown,
        yDown,
        timeDown,
        xCurrent: evt.touches[0].clientX,
        yCurrent: evt.touches[0].clientY,
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

  return <div id={id}>{children}</div>;
};

export default SwipeGesture;
