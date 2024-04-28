import React from 'react';

function Block({ children }: { children: any }) {
  return (
    <div className='z-20 rounded-3xl p-6 shadow-lg shadow-c_shadow bg-c_bg-block'>
      {children}
    </div>
  );
}

export default Block;
