import { Toaster } from 'sonner';
import type { PropsWithChildren } from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { theme } from '@/styles/base/theme';
import { queryClient } from '@/lib/query-client.ts';

export function Providers({ children }: PropsWithChildren) {
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </MantineProvider>
  );
}
