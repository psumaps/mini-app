import { NavigatorContext } from 'psumaps-shared/src/models/navigator';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigator from '~/app/navigator';

const PageBase = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <NavigatorContext.Provider
      value={useMemo(() => new Navigator(navigate), [navigate])}
    >
      {children}
    </NavigatorContext.Provider>
  );
};

export default PageBase;
