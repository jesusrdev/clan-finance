import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useUniwind, Uniwind } from "uniwind";
import { cn } from "@/lib/utils";

const ANIMES = [
  { id: "light", name: "Light", color: "#ffffff" },
  { id: "dark", name: "Dark", color: "#09090b" },
  { id: "onePiece", name: "One Piece", color: "#d91e1e" },
  { id: "naruto", name: "Naruto", color: "#ff9f1c" },
  { id: "dragonBall", name: "Dragon Ball", color: "#f28f08" },
  { id: "demonSlayer", name: "Demon Slayer", color: "#2d5f5d" },
  { id: "strangerThings", name: "Stranger Things", color: "#e20713" },
];

export function ThemeSelector() {
  const { theme } = useUniwind();

  return (
    <View className="gap-4">
      <Text className="text-lg font-bold text-foreground">
        Selecciona tu Estilo
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <View className="flex-row gap-4 px-1">
          {ANIMES.map((anime) => (
            <Pressable
              key={anime.id}
              onPress={() => Uniwind.setTheme(anime.id as any)}
              className={cn(
                "items-center gap-2 p-2 rounded-xl border-2 transition-all",
                theme === anime.id
                  ? "border-primary bg-primary/5"
                  : "border-transparent",
              )}
            >
              <View
                style={{ backgroundColor: anime.color }}
                className="rounded-full border shadow-sm size-12 border-border"
              />
              <Text
                className={cn(
                  "text-xs font-medium",
                  theme === anime.id ? "text-primary" : "text-muted-foreground",
                )}
              >
                {anime.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
