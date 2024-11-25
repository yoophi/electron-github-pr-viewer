import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 1000,
      gcTime: 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TanStackQueryClientProvider>
  );
};
