import React, { useState, useEffect } from 'react';

const UpArrowIcon = () => (
  <svg
    enableBackground="new 0 0 32 32"
    height="32px"
    id="Layer_1"
    version="1.1"
    viewBox="0 0 32 32"
    width="32px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
      fill="#515151"
    />
  </svg>
);

const ScrollToTop = () => {
  // State to manage the visibility of the "scroll to top" button
  const [visible, setVisible] = useState(true); // todo: fix

  const scrollToTop = () => {
    document.getElementById('header')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add a scroll event listener to track when to show or hide the button
  useEffect(() => {
    const listener = () => {
      // ?: scrollY always is 0
      if (window.scrollY >= 200) {
        setVisible(true);
      } /* else {
        setVisible(false);
      } */
    };
    window.addEventListener('scroll', listener, true);

    return () => {
      window.removeEventListener('scroll', listener, true);
    };
  }, []);

  return (
    <div>
      {visible && (
        <div
          className={`fixed bottom-32 right-4 z-10 w-5 h-5 bg-white flex justify-center items-center p-4 rounded-lg bg-opacity-5 backdrop-blur-sm  ${
            visible ? 'visible' : 'hidden'
          } hover:pb-1`}
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
