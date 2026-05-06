import { afterEach, vi } from "vitest";

process.env.EXPO_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";

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

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
