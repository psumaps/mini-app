import React, { useEffect, useState } from 'react';

const Modal = ({
  children,
  className,
  target,
}: {
  children: React.ReactNode;
  className?: string;
  target: React.RefObject<HTMLDivElement>;
}) => {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
    } = target.current?.getBoundingClientRect() ?? {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };
    setTop(targetTop);
    setLeft(targetLeft);
    setWidth(targetWidth);
    setHeight(targetHeight);
  }, [target]);

  return (
    <div className="absolute top-0 left-0 h-screen w-screen">
      <div
        className={`${className} relative translate-x--1/2`}
        style={{ top: top + height, left: left + width / 2 }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
