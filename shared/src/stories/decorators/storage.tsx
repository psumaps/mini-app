import React, { useMemo } from 'react';
// eslint-disable-next-line import/no-relative-packages
import Storage from '../../../../web/src/app/storage';
import { StorageContext } from '../../models/storage';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

const StorageProviderMock = ({ children }: { children: React.ReactNode }) => {
  return (
    <StorageContext.Provider value={useMemo(() => new Storage(), [])}>
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
