import React, { useMemo } from 'react';

import storage from '../../../../web/src/app/storage';
import { StorageContext } from '../../models/storage';

const StorageProviderMock = ({ children }: { children: React.ReactNode }) => {
  return (
      <StorageContext.Provider value={useMemo(() => storage, [])}>
      {children}
    </StorageContext.Provider>
  );
};

const StorageDecorator = (Story: React.ComponentType) => (
  <StorageProviderMock>
    <Story />
  </StorageProviderMock>
);

export default StorageDecorator;
