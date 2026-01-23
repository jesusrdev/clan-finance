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

    if (!session && !inAuthGroup) {
      // Si no hay sesión y no estamos en auth, ir a login
      router.replace("/login");
    } else if (session && inAuthGroup) {
      // Si hay sesión y estamos en auth, ir a tabs
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
