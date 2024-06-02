import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-c_bg dark:bg-cd_bg h-[90vh] relative p-4">
      {children}
    </div>
  );
};

export default Layout;
