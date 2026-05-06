import "@/global.css";
import { NAV_THEME, DARK_THEMES } from "@/lib/theme";
import { Platform } from "react-native";
import { ActivityIndicator, View } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { queryClient } from "@/lib/query/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { useThemePersistence } from "@/features/auth/hooks/useThemePersistence";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import {
  resolveAuthClanRedirect,
  shouldHoldNavigation,
  type ClanResolutionStatus,
} from "@/app/guards/authClanGuard";

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasClan, setHasClan] = useState<boolean | null>(null);
  const [isResolvingClan, setIsResolvingClan] = useState(false);
  const [clanResolutionStatus, setClanResolutionStatus] =
    useState<ClanResolutionStatus>("idle");

  const { theme, isReady } = useThemePersistence();

  useEffect(() => {
    let cancelled = false;

    const resolveClanMembership = async () => {
      if (!session?.user?.id) {
        setHasClan(null);
        setIsResolvingClan(false);
        setClanResolutionStatus("idle");
        return;
      }

      setIsResolvingClan(true);
      setClanResolutionStatus("loading");

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .select("clan_id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setHasClan(null);
        setClanResolutionStatus("error");
      } else {
        setHasClan(!!data?.clan_id);
        setClanResolutionStatus("resolved");
      }

      setIsResolvingClan(false);
    };

    resolveClanMembership();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    const redirectTo = resolveAuthClanRedirect({
      loading,
      isReady,
      isResolvingClan,
      hasSession: !!session,
      hasClan,
      clanResolutionStatus,
      segments,
    });

    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [
    loading,
    isReady,
    isResolvingClan,
    session,
    hasClan,
    clanResolutionStatus,
    segments,
    router,
  ]);

  const holdNavigation = shouldHoldNavigation({
    loading,
    isReady,
    hasSession: !!session,
    hasClan,
    clanResolutionStatus,
    isRootSegment: !segments[0],
    isWeb: Platform.OS === "web",
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
          <StatusBar
            style={DARK_THEMES.includes(theme ?? "light") ? "light" : "dark"}
          />
          <ToastProvider>
            {holdNavigation ? (
              <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" />
              </Stack>
            )}
            <PortalHost />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
