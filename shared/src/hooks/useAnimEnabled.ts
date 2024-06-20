import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StorageContext } from '../models/storage';
import { getStoredAnimEnabled } from '../utils/readStorage';

const useAnimEnabled = () => {
  const storage = useContext(StorageContext);
  return useQuery<boolean>({
    queryKey: ['animation_enabled'],
    queryFn: async () => getStoredAnimEnabled(storage!),
  });
};

export default useAnimEnabled;
