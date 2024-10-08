import React from 'react';

const Block = (
  props: React.HTMLAttributes<HTMLDivElement> & { className?: string },
) => {
  const { children, className, ...rest } = props;
  return (
    <div
      className={`rounded-3xl p-4 shadow-lg shadow-c_shadow dark:shadow-none bg-c_bg-block dark:bg-cd_bg-block ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Block;
