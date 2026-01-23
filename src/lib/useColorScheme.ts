import { useColorScheme as useNativeColorScheme } from "react-native";

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  // In the future, we can add logic here to sync with Uniwind's setVariant if needed.
  return {
    colorScheme: systemColorScheme ?? "light",
    isDark: systemColorScheme === "dark",
    setColorScheme: (scheme: "light" | "dark") => {
      // Logic to toggle Uniwind variant would go here
    },
  };
}
