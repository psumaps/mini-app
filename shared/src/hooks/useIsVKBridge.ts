import { useContext, useEffect, useState } from 'react';
import { StorageContext, StorageType } from '../models/storage';

const useIsVkBridge = () => {
  const storage = useContext(StorageContext);
  const [isVkBridge, setIsVkBridge] = useState(false);

  useEffect(() => {
    void storage
      ?.getStorageType()
      .then((s) => setIsVkBridge(s === StorageType.vkbridge));
  }, [storage]);

  return isVkBridge;
};

export default useIsVkBridge;
