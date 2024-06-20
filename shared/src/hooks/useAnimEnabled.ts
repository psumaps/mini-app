import { useContext } from 'react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { StorageContext } from '../models/storage';
import { getStoredAnimEnabled } from '../utils/readStorage';

const useAnimEnabled = () => {
  let queryClient: QueryClient;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryClient = useQueryClient();
  } catch (e) {
    queryClient = new QueryClient();
  }
  const storage = useContext(StorageContext);
  return useQuery<boolean>(
    {
      queryKey: ['animation_enabled'],
      queryFn: async () => getStoredAnimEnabled(storage!),
    },
    queryClient,
  );
};

export default useAnimEnabled;
