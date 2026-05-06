import { afterEach, vi } from "vitest";
import React from "react";

process.env.EXPO_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";
(globalThis as { __DEV__?: boolean }).__DEV__ = false;
(globalThis as { window?: unknown }).window ??= globalThis;

vi.mock("react-native", async () => {
  const reactNativeWeb = await vi.importActual("react-native-web");

  return {
    ...reactNativeWeb,
    Platform: {
      OS: "web",
      select: <T>(config: { web?: T; default?: T }) =>
        config.web ?? config.default,
    },
  };
});

vi.mock("expo-linking", () => ({
  createURL: vi.fn(() => "clan-finance://"),
  parse: vi.fn(() => ({ path: "", queryParams: {} })),
}));

vi.mock("expo-constants", () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

vi.mock("lucide-react-native", () => {
  const Icon = () => React.createElement("span", { "data-testid": "icon" });
  return {
    Trophy: Icon,
    ChevronLeft: Icon,
    LogOut: Icon,
    Palette: Icon,
    User: Icon,
    Info: Icon,
    ChevronRight: Icon,
  };
});

vi.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
