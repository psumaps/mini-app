import { QueryClient, useQueryClient } from '@tanstack/react-query';

const useTryQueryClient = () => {
  let queryClient: QueryClient;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryClient = useQueryClient();
  } catch (e) {
    queryClient = new QueryClient();
  }

  return queryClient;
};

export default useTryQueryClient;
