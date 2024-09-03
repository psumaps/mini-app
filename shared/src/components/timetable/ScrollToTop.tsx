import React, { useState, useEffect, useCallback } from 'react';
import UpArrowIcon from '../../assets/up-arrow.svg?react';
import { node } from '../../utils/selector';

const ScrollToTop = () => {
  // State to manage the visibility of the "scroll to top" button
  const [visible, setVisible] = useState(false); // todo: fix
  const layout = useCallback(() => node('#layout'), []);

  const scrollToTop = () => {
    layout()?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add a scroll event listener to track when to show or hide the button
  useEffect(() => {
    const listener = () => {
      if ((layout()?.scrollTop ?? 0) >= 200) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', listener, true);

    return () => {
      window.removeEventListener('scroll', listener, true);
    };
  }, [layout]);

  return (
    <div>
      {visible && (
        <div
          className={`fixed bottom-32 right-5 z-10 w-5 h-5 bg-white flex justify-center items-center p-4 rounded-lg bg-opacity-5 backdrop-blur-sm ${
            visible ? 'visible' : 'hidden'
          } active:scale-90`}
        >
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            aria-label="Scroll to Top"
            onClick={scrollToTop}
            className="bg-opacity-30"
          >
            <UpArrowIcon />
          </button>
        </div>
      )}
    </div>
  );
};
export default ScrollToTop;
