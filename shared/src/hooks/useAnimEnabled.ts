import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { StorageContext } from '../models/storage';
import { getStoredAnimEnabled } from '../utils/readStorage';
import useTryQueryClient from './useTryQueryClient';

const useAnimEnabled = () => {
  const queryClient = useTryQueryClient();
  const storage = useContext(StorageContext);
  return useQuery<boolean>(
    {
      queryKey: ['animation_enabled'],
      queryFn: async () => getStoredAnimEnabled(storage!),
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
    queryClient,
  );
};

export default useAnimEnabled;
