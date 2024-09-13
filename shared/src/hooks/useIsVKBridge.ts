import { useContext, useState } from 'react';
import { StorageContext, StorageType } from '../models/storage';

const useVKBridge = () => {
  const storage = useContext(StorageContext);
  const [isVKBridge, setIsVKBridge] = useState(false);
  void storage
    ?.getStorageType()
    .then((s) => setIsVKBridge(s === StorageType.vkbridge));
  return isVKBridge;
};

export default useVKBridge;
