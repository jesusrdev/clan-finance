import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useThemePersistence } from "@/features/auth/hooks/useThemePersistence";
import { THEME_METADATA } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { ChevronRight, Sparkles } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ThemeSelectionScreen() {
  const router = useRouter();
  const { theme, updateTheme } = useThemePersistence();

  return (
    <SafeAreaView className="bg-background" style={{ flex: 1 }}>
      <View className="flex-1 px-6 py-6 mx-auto w-full max-w-2xl">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row gap-2 items-center mb-1">
            <Text className="text-3xl font-bold text-foreground">
              Elige tu Skin
            </Text>
            <Sparkles
              size={24}
              color={
                THEME_METADATA[theme as keyof typeof THEME_METADATA]?.color ||
                "gold"
              }
            />
          </View>
          <Text className="text-base font-medium text-muted-foreground">
            ¡Personaliza tu aventura con objetos legendarios!
          </Text>
        </View>

        {/* Vertical Selector */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: 40,
          }}
        >
          <View className="gap-5">
            {Object.entries(THEME_METADATA).map(([key, metadata]) => (
              <Pressable
                key={key}
                onPress={() => updateTheme(key)}
                className={cn(
                  "flex-row items-center p-5 rounded-3xl border-2 transition-all duration-300",
                  theme === key
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.02]"
                    : "border-border bg-card/40 opacity-80",
                )}
              >
                {/* Visual Icon Box */}
                <View
                  style={{ backgroundColor: metadata.color }}
                  className="justify-center items-center rounded-2xl border-2 shadow-md size-16 border-white/30"
                >
                  <Text className="text-3xl">{metadata.icon}</Text>
                </View>

                <View className="flex-1 ml-5">
                  <View className="flex-row gap-2 items-center">
                    <Text
                      className={cn(
                        "text-xl font-bold",
                        theme === key ? "text-primary" : "text-foreground",
                      )}
                    >
                      {metadata.name}
                    </Text>
                    {theme === key && (
                      <View className="bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20">
                        <Text className="text-[10px] font-bold text-primary uppercase leading-tight">
                          Activo
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-muted-foreground text-sm font-medium mt-0.5">
                    {metadata.description}
                  </Text>

                  {/* Item indicator */}
                  <View className="flex-row items-center mt-2 opacity-70">
                    <Text className="mr-1 text-xs font-bold text-foreground/60">
                      ITEM:
                    </Text>
                    <Text className="text-xs font-bold text-primary">
                      {metadata.item}
                    </Text>
                  </View>
                </View>

                <View
                  className={cn(
                    "size-9 rounded-full items-center justify-center transition-all",
                    theme === key ? "bg-primary shadow-md" : "bg-muted/20",
                  )}
                >
                  <ChevronRight
                    size={theme === key ? 22 : 20}
                    color={theme === key ? "white" : "gray"}
                    strokeWidth={theme === key ? 3 : 2}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="pt-6">
          <Button
            size="lg"
            className="w-full rounded-2xl border-b-0 shadow-xl shadow-primary/20 border-primary/40 active:border-b-0 active:translate-y-1"
            onPress={() => router.push("/login")}
          >
            <Text className="text-xl font-bold tracking-wide text-primary-foreground">
              Confirmar Estilo
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
