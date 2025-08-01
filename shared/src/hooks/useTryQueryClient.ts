import { QueryClient, useQueryClient } from '@tanstack/react-query';

const useTryQueryClient = () => {
  let queryClient: QueryClient;
  try {
    queryClient = useQueryClient();
  } catch (_e) {
    queryClient = new QueryClient();
  }

  return queryClient;
};

export default useTryQueryClient;
