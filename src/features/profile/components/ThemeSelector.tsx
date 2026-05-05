import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { THEME_METADATA } from "@/lib/theme";
import { ChevronRight } from "lucide-react-native";

interface ThemeSelectorProps {
  currentTheme: string;
  onSelect: (theme: string) => void;
  compact?: boolean;
}

export function ThemeSelector({
  currentTheme,
  onSelect,
  compact = false,
}: ThemeSelectorProps) {
  return (
    <View className="gap-5">
      {Object.entries(THEME_METADATA).map(([key, metadata]) => (
        <Pressable
          key={key}
          onPress={() => onSelect(key)}
          className={cn(
            "flex-row items-center rounded-3xl border-2 transition-all duration-300",
            compact ? "p-3" : "p-5",
            currentTheme === key
              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.02]"
              : "border-border bg-card/40 opacity-80",
          )}
        >
          {/* Visual Icon Box */}
          <View
            style={{ backgroundColor: metadata.color }}
            className={cn(
              "justify-center items-center rounded-2xl border-2 shadow-md border-white/30",
              compact ? "size-12" : "size-16",
            )}
          >
            <Text className={compact ? "text-xl" : "text-3xl"}>
              {metadata.icon}
            </Text>
          </View>

          <View className={cn("flex-1", compact ? "ml-3" : "ml-4 sm:ml-5")}>
            <View className="flex-row flex-wrap gap-2 items-center">
              <Text
                className={cn(
                  "font-bold",
                  compact ? "text-base" : "text-lg sm:text-xl",
                  currentTheme === key ? "text-primary" : "text-foreground",
                )}
              >
                {metadata.name}
              </Text>
              {currentTheme === key && (
                <View className="bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20">
                  <Text className="text-[10px] font-bold text-primary uppercase leading-tight">
                    Activo
                  </Text>
                </View>
              )}
            </View>
            {!compact && (
              <Text
                className="text-muted-foreground text-sm font-medium mt-0.5"
                numberOfLines={1}
              >
                {metadata.description}
              </Text>
            )}
          </View>

          <View
            className={cn(
              "rounded-full items-center justify-center transition-all",
              compact ? "size-7" : "size-9",
              currentTheme === key ? "bg-primary shadow-md" : "bg-muted/20",
            )}
          >
            <ChevronRight
              size={
                currentTheme === key ? (compact ? 16 : 22) : compact ? 14 : 20
              }
              color={currentTheme === key ? "white" : "gray"}
              strokeWidth={currentTheme === key ? 3 : 2}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
