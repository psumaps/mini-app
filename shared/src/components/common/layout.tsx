import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-c_bg dark:bg-cd_bg flex flex-col overflow-y-auto h-[92dvh] px-[5%] pb-6">
      {children}
    </div>
  );
};

export default Layout;
