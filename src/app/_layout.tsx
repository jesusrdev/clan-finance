import "@/global.css";
import { NAV_THEME, DARK_THEMES } from "@/lib/theme";
import { Platform } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { queryClient } from "@/lib/query/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect } from "react";
import { useThemePersistence } from "@/features/auth/hooks/useThemePersistence";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { theme, isReady } = useThemePersistence();

  useEffect(() => {
    if (loading) return;
    if (Platform.OS != "web") {
      router.replace("/");
    }
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
          <StatusBar
            style={DARK_THEMES.includes(theme ?? "light") ? "light" : "dark"}
          />
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
