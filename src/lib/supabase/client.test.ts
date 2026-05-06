import { beforeEach, describe, expect, it, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createSupabaseClient,
  resolveSupabaseAuthStorage,
  resolveSupabaseEnv,
} from "./client";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => createClientMock(...args),
}));

describe("supabase client seam", () => {
  beforeEach(() => {
    createClientMock.mockReset();
    createClientMock.mockReturnValue({ auth: {} });
  });

  it("resolves env from explicit deps", () => {
    const result = resolveSupabaseEnv({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });

    expect(result).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
    });
  });

  it("fails when env is missing", () => {
    const previousUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => resolveSupabaseEnv({})).toThrow(
      "Missing Supabase environment variables",
    );

    process.env.EXPO_PUBLIC_SUPABASE_URL = previousUrl;
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = previousKey;
  });

  it("uses noop storage on server", async () => {
    const storage = resolveSupabaseAuthStorage({ isServer: true });

    await expect(storage.getItem("k")).resolves.toBeNull();
  });

  it("uses web localStorage on web platform", async () => {
    const memoryStorage = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => memoryStorage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memoryStorage.set(key, value);
        },
        removeItem: (key: string) => {
          memoryStorage.delete(key);
        },
      },
    });

    const storage = resolveSupabaseAuthStorage({
      platformOS: "web",
      isServer: false,
    });

    await storage.setItem("token", "abc");
    await expect(storage.getItem("token")).resolves.toBe("abc");
    await storage.removeItem("token");
    await expect(storage.getItem("token")).resolves.toBeNull();
  });

  it("uses native async storage on native platform", () => {
    const storage = resolveSupabaseAuthStorage({
      platformOS: "ios",
      isServer: false,
    });

    expect(storage).toBe(AsyncStorage);
  });

  it("creates client with resolved env and auth storage", () => {
    createSupabaseClient({
      platformOS: "web",
      isServer: false,
      env: {
        url: "https://example.supabase.co",
        anonKey: "anon-key",
      },
    });

    expect(createClientMock).toHaveBeenCalledTimes(1);
    const call = createClientMock.mock.calls[0];
    expect(call[0]).toBe("https://example.supabase.co");
    expect(call[1]).toBe("anon-key");
    expect(call[2]).toMatchObject({
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    expect((call[2] as any).auth.storage).toBeDefined();
  });
});
