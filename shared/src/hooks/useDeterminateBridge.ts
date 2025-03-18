import { useContext, useEffect, useState } from 'react';
import { BridgeType, StorageContext } from '../models/storage';

const useDeterminateBridge = () => {
  const storage = useContext(StorageContext);
  const [isVkBridge, setIsVkBridge] = useState(BridgeType.local);

  useEffect(() => {
    void storage?.getStorageType().then((s) => setIsVkBridge(s));
  }, []);

  return isVkBridge;
};

export default useDeterminateBridge;
