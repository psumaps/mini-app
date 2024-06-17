import { expect, test } from 'vitest';

import {
  calcSwipeDirection,
  swipeMinSpeed,
  // eslint-disable-next-line import/no-relative-packages
} from '../shared/src/components/common/swipeGesture/swipeGestureUtils';

test('calcSwipeDirection', () => {
  const timeElapsed = 100; // ms
  const defaultOptions = {
    xDown: 0,
    yDown: 0,
    xCurrent: 0,
    yCurrent: 0,
    timeDown: 0,
    timeCurrent: 0,
  };

  expect(
    calcSwipeDirection({ ...defaultOptions, timeCurrent: timeElapsed }),
  ).toBe(null);
  expect(
    calcSwipeDirection({
      ...defaultOptions,
      xCurrent: 1,
      timeCurrent: timeElapsed,
    }),
  ).toBe(null);
  expect(
    calcSwipeDirection({
      ...defaultOptions,
      yCurrent: 1,
      timeCurrent: timeElapsed,
    }),
  ).toBe(null);

  expect(calcSwipeDirection({ ...defaultOptions, xCurrent: 1 })).toBe('right');
  expect(calcSwipeDirection({ ...defaultOptions, yCurrent: 1 })).toBe('down');
  expect(calcSwipeDirection({ ...defaultOptions, xCurrent: -1 })).toBe('left');
  expect(calcSwipeDirection({ ...defaultOptions, yCurrent: -1 })).toBe('up');

  expect(
    calcSwipeDirection({
      ...defaultOptions,
      timeCurrent: timeElapsed,
      xCurrent: swipeMinSpeed * timeElapsed - 1,
    }),
  ).toBe(null);

  expect(
    calcSwipeDirection({
      ...defaultOptions,
      timeCurrent: timeElapsed,
      xCurrent: swipeMinSpeed * timeElapsed,
    }),
  ).toBe('right');
});
