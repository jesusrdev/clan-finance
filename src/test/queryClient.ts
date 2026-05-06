import { QueryClient } from "@tanstack/react-query";
import {
  createQueryClient,
  queryClientDefaultOptions,
} from "@/lib/query/client";

export function createTestQueryClient(): QueryClient {
  return createQueryClient({
    ...queryClientDefaultOptions,
    queries: {
      ...queryClientDefaultOptions.queries,
      retry: false,
      gcTime: 0,
    },
    mutations: {
      ...queryClientDefaultOptions.mutations,
      retry: false,
    },
  });
}
