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
import { ToastProvider } from "@/components/ui/toast";
import { Platform } from "react-native";

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { theme } = useUniwind();

  useEffect(() => {
    if (loading) return;
    router.replace("/");
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    // const atRoot = segments.length === 0 || (!inAuthGroup && !inTabsGroup);

    if (session) {
      // Usuario autenticado: siempre ir a tabs
      if (!inTabsGroup) {
        router.replace("/(tabs)");
      }
    } else {
      // Usuario NO autenticado: ir a welcome si está en tabs
      if (inTabsGroup) {
        router.replace("/");
      }
    }
  }, [session, loading, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
          <ToastProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <PortalHost />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
