import { useAuth } from "@/features/auth/hooks/useAuth";
import "@/global.css";
import { queryClient } from "@/lib/query/client";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { NAV_THEME } from "@/lib/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { theme } = useUniwind();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const atWelcome = !inAuthGroup && !inTabsGroup;

    if (session && (inAuthGroup || atWelcome)) {
      // Si hay sesión y estamos en auth o en el welcome, ir a tabs
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
