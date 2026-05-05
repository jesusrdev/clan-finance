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
import { supabase } from "@/lib/supabase/client";

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { theme, isReady } = useThemePersistence();

  // Redirección inicial solo si no estamos en ninguna ruta (arranque en frío)
  useEffect(() => {
    if (loading || !isReady) return;

    // Si no hay ruta (root) y no estamos logueados, ir a "/"
    // Si estamos logueados, el segundo efecto nos llevará a /(tabs)
    if (!segments[0] && !session && Platform.OS !== "web") {
      router.replace("/");
    }
  }, [loading, isReady, session]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    const verifyAndRoute = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession) {
        // Si está autenticado y trata de entrar a login/register o welcome, mandarlo a tabs
        if (inAuthGroup || !segments[0]) {
          router.replace("/(tabs)");
        }
      } else {
        // Si NO está autenticado y trata de entrar a las pestañas, mandarlo a welcome
        if (inTabsGroup) {
          router.replace("/");
        }
      }
    };

    verifyAndRoute();
  }, [session, loading, segments]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const inAuthGroup = segments[0] === "(auth)";
      const inTabsGroup = segments[0] === "(tabs)";

      if (nextSession) {
        if (inAuthGroup || !segments[0]) {
          router.replace("/(tabs)");
        }
      } else if (inTabsGroup) {
        router.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, segments]);

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
