import { useContext, useEffect, useState } from 'react';
import { BridgeType, StorageContext } from '../models/storage';

const useDeterminateBridge = (): BridgeType => {
  const storage = useContext(StorageContext);
  const [bridgeType, setBridgeType] = useState<BridgeType>(BridgeType.local);

  useEffect(() => {
    if (!storage) {
      console.warn('Storage context is not provided');
      return;
    }

    let isMounted = true;

    const determineBridge = async () => {
      try {
        const type = await storage.getStorageType();
        if (isMounted) {
          setBridgeType(type);
        }
      } catch (error) {
        console.error('Failed to determine bridge type:', error);
        if (isMounted) {
          setBridgeType(BridgeType.local);
        }
      }
    };

    void determineBridge();

    return () => {
      isMounted = false;
    };
  }, [storage]);

  return bridgeType;
};

export default useDeterminateBridge;
