import React from 'react';

const HeaderBar = ({ pageName }: { pageName: string }) => {
  return (
    <div
      id="header"
      className="flex justify-around items-center py-4 px-4 bg-c_bg dark:bg-cd_bg"
    >
      <h2>{pageName}</h2>
    </div>
  );
};

export default HeaderBar;
