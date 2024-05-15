import React from 'react';

function Block({ children, className }: { children: any, className?: string }) {
  return (
    <div className={`z-20 rounded-3xl p-6 shadow-lg dark:shadow-xl shadow-c_shadow dark:shadow-cd_shadow bg-c_bg-block dark:bg-cd_bg-block ${className}`}>
      {children}
    </div>
  );
}

export default Block;
