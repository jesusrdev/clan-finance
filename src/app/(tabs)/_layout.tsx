import { Tabs } from "expo-router";
import { useThemePersistence } from "@/features/auth/hooks/useThemePersistence";
import { THEME_METADATA } from "@/lib/theme";

export default function TabsLayout() {
  const { theme } = useThemePersistence();
  const activeColor =
    THEME_METADATA[theme as keyof typeof THEME_METADATA]?.color || "#D91E1E";

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ocultar header por defecto en tabs para diseño más limpio
        tabBarActiveTintColor: activeColor,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarLabel: "Inicio",
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          tabBarLabel: "Quests",
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarLabel: "Wallet",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
        }}
      />
    </Tabs>
  );
}
