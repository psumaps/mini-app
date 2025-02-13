import { useContext, useEffect, useState } from 'react';
import { StorageContext, BridgeType } from '../models/storage';

const useDeterminateBridge = () => {
  const storage = useContext(StorageContext);
  const [isVkBridge, setIsVkBridge] = useState(BridgeType.local);

  useEffect(() => {
    void storage?.getStorageType().then((s) => setIsVkBridge(s));
  }, [storage]);

  return isVkBridge;
};

export default useDeterminateBridge;
