import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="layout"
      className="bg-c_bg dark:bg-cd_bg flex flex-col overflow-y-auto h-[92dvh] px-[5dvw] pb-6"
    >
      {children}
    </div>
  );
};

export default Layout;
