'use client';

import { SessionProvider } from 'next-auth/react';
import { CompareProvider } from '@/contexts/CompareContext';
import CompareButton from '@/components/CompareButton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CompareProvider>
          {children}
          <CompareButton />
        </CompareProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
