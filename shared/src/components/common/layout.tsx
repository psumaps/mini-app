import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-c_bg dark:bg-cd_bg h-[90vh]">
      <div className="container p-8 pt-0 bg-c_bg dark:bg-cd_bg mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
