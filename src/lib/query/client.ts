import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

export const queryClientDefaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos (antes cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 1,
  },
};

export function createQueryClient(defaultOptions = queryClientDefaultOptions) {
  return new QueryClient({ defaultOptions });
}

export const queryClient = createQueryClient();
