export const swipeMinSpeed = 0.15; // px/ms

export const calcSwipeDirection = ({
  xDown,
  yDown,
  xCurrent,
  yCurrent,
  timeDown,
  timeCurrent,
}: {
  xDown: number;
  yDown: number;
  xCurrent: number;
  yCurrent: number;
  timeDown: number;
  timeCurrent: number;
}): 'left' | 'right' | 'up' | 'down' | null => {
  const msElapsed = timeCurrent - timeDown;

  const xDiff = xDown - xCurrent;
  const yDiff = yDown - yCurrent;

  const horizontalDiff = Math.abs(xDiff);
  const verticalDiff = Math.abs(yDiff);

  // manhattan length is just a fast way of calculating approximate distance instead of using pythagoras
  const manhattanLength = horizontalDiff + verticalDiff;
  if (manhattanLength < swipeMinSpeed * msElapsed) return null;

  if (horizontalDiff > verticalDiff) return xDiff > 0 ? 'left' : 'right';
  return yDiff > 0 ? 'up' : 'down';
};
