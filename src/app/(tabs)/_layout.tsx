import { Tabs } from "expo-router";
import { useThemePersistence } from "@/features/auth/hooks/useThemePersistence";
import { THEME_METADATA } from "@/lib/theme";
import { House, ScrollText, Wallet, UserRound } from "lucide-react-native";

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
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          tabBarLabel: "Quests",
          tabBarIcon: ({ color, size }) => <ScrollText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarLabel: "Wallet",
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
