import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { StorageContext } from '../models/storage';
import { getStoredIcalToken } from '../utils/readStorage';
import useTryQueryClient from './useTryQueryClient';

const useIcalToken = () => {
  const queryClient = useTryQueryClient();
  const storage = useContext(StorageContext);
  return useQuery(
    {
      queryKey: ['storage', 'ical_token'],
      queryFn: async () => getStoredIcalToken(storage!),
    },
    queryClient,
  );
};

export default useIcalToken;
