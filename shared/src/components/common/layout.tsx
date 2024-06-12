import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-c_bg dark:bg-cd_bg h-[90vh] flex flex-col px-4 -top-3 pb-[4.5rem]">
      {children}
    </div>
  );
};

export default Layout;
