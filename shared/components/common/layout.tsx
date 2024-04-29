import React from "react";

function Layout({ children }: { children: any }) {
  return (
    <div className="bg-c_bg dark:bg-cd_bg h-[90vh]">
      <div className="container p-8 bg-c_bg dark:bg-cd_bg">{children}</div>
    </div>
  );
}

export default Layout;
