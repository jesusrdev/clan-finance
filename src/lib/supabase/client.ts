import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type SupportedPlatform = "web" | "ios" | "android";

type AuthStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const NoopStorage: AuthStorage = {
  getItem: (key: string) => Promise.resolve(null),
  setItem: (key: string, value: string) => Promise.resolve(undefined),
  removeItem: (key: string) => Promise.resolve(undefined),
};

const WebStorage: AuthStorage = {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve(undefined);
  },
  removeItem: (key: string) => {
    window.localStorage.removeItem(key);
    return Promise.resolve(undefined);
  },
};

type SupabaseClientDeps = {
  platformOS?: SupportedPlatform;
  isServer?: boolean;
  storage?: AuthStorage;
  env?: {
    url?: string;
    anonKey?: string;
  };
};

export function resolveSupabaseEnv(env?: { url?: string; anonKey?: string }) {
  const supabaseUrl = env?.url ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env?.anonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env file.",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function resolveSupabaseAuthStorage(deps: {
  platformOS?: SupportedPlatform;
  isServer?: boolean;
  storage?: AuthStorage;
} = {}): AuthStorage {
  if (deps.storage) {
    return deps.storage;
  }

  const isServer = deps.isServer ?? typeof window === "undefined";
  if (isServer) {
    return NoopStorage;
  }

  return (deps.platformOS ?? Platform.OS) === "web" ? WebStorage : AsyncStorage;
}

export function createSupabaseClient(deps: SupabaseClientDeps = {}) {
  const { supabaseUrl, supabaseAnonKey } = resolveSupabaseEnv(deps.env);
  const authStorage = resolveSupabaseAuthStorage(deps);

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // CRÍTICO: Permite detectar tokens OAuth en la URL
    },
  });
}

export const supabase = createSupabaseClient();
