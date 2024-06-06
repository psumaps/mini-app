import React from 'react';

const Line = (
  props: React.HTMLAttributes<HTMLHRElement> & { className?: string },
) => {
  const { className, ...rest } = props;
  return (
    <hr
      className={`border-solid border rounded-sm w-full ${className}`}
      {...rest}
    />
  );
};

export default Line;
