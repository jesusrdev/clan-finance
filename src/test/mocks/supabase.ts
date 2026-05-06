import { vi } from "vitest";

export type SupabaseSessionLike = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  token_type?: string;
  user?: {
    id: string;
    email?: string;
  };
};

export function createAuthSessionMock(session: SupabaseSessionLike | null = null) {
  return {
    data: {
      session,
    },
    error: null,
  };
}

export function createAuthStateChangeMock() {
  const unsubscribe = vi.fn();

  return {
    data: {
      subscription: {
        unsubscribe,
      },
    },
    error: null,
    unsubscribe,
  };
}

export function createSupabaseQueryBuilderMock<T>(result: T) {
  return {
    select: vi.fn().mockResolvedValue({ data: result, error: null }),
    insert: vi.fn().mockResolvedValue({ data: result, error: null }),
    update: vi.fn().mockResolvedValue({ data: result, error: null }),
    delete: vi.fn().mockResolvedValue({ data: result, error: null }),
  };
}

export function createSupabaseClientMock<T>(queryResult: T) {
  const authState = createAuthStateChangeMock();

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue(createAuthSessionMock()),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: authState.unsubscribe,
          },
        },
      }),
    },
    from: vi.fn().mockReturnValue(createSupabaseQueryBuilderMock(queryResult)),
  };
}
