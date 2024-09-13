import { useContext, useEffect, useState } from 'react';
import { StorageContext, StorageType } from '../models/storage';

const useVKBridge = () => {
  const storage = useContext(StorageContext);
  const [isVKBridge, setIsVKBridge] = useState(false);

  useEffect(() => {
    void storage
      ?.getStorageType()
      .then((s) => setIsVKBridge(s === StorageType.vkbridge));
  }, [storage]);

  return isVKBridge;
};

export default useVKBridge;
