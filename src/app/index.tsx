import {
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as React from "react";
import { cn } from "@/lib/utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ONBOARDING_STEPS = [
  {
    title: "Gestiona como un Pro",
    description:
      "Controla tus finanzas familiares con un toque de aventura pirata o ninja.",
    image: require("../../assets/onboarding_1.png"),
    bgColor: "bg-blue-500/5",
  },
  {
    title: "Completa Quests",
    description:
      "Ahorrar nunca fue tan divertido. ¡Gana premios por tus logros diarios!",
    image: require("../../assets/onboarding_2.png"),
    bgColor: "bg-orange-500/5",
  },
  {
    title: "Skins de Anime",
    description:
      "Desbloquea estilos legendarios de tus animes favoritos para tu app.",
    image: require("../../assets/onboarding_3.png"),
    bgColor: "bg-red-500/5",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerWidth = React.useRef(SCREEN_WIDTH);

  const handleLayout = (event: any) => {
    containerWidth.current = event.nativeEvent.layout.width;
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / containerWidth.current);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        onLayout={handleLayout}
        className="flex-1 w-full max-w-2xl mx-auto justify-between py-6"
      >
        {/* Logo / Header */}
        <View className="items-center px-6 mb-4">
          <View className="size-12 bg-primary/10 rounded-xl items-center justify-center mb-2 shadow-sm border border-primary/20">
            <Text className="text-2xl">🎮</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground tracking-tight">
            Clan Finance
          </Text>
        </View>

        {/* Carousel */}
        <View className="flex-1">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {ONBOARDING_STEPS.map((step, index) => (
              <View
                key={index}
                className="items-center justify-center px-8"
                style={{ width: Platform.OS === "web" ? "100%" : SCREEN_WIDTH }}
              >
                <View
                  className={cn(
                    "w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden mb-8 shadow-xl shadow-black/20",
                    step.bgColor,
                  )}
                >
                  <Image
                    source={step.image}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-3xl font-bold text-foreground text-center mb-4 px-4">
                  {step.title}
                </Text>
                <Text className="text-muted-foreground text-center text-lg leading-7 px-2">
                  {step.description}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Pagination dots */}
          <View className="flex-row justify-center gap-2 mt-4">
            {ONBOARDING_STEPS.map((_, i) => (
              <View
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === activeIndex ? "w-8 bg-primary" : "w-2 bg-muted/30",
                )}
              />
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="px-6 gap-4 pt-10">
          <Button
            size="lg"
            className="w-full h-16 rounded-2xl shadow-lg shadow-primary/20 border-b-4 border-primary/40 active:border-b-0 active:translate-y-1"
            onPress={() => router.push("/theme-selection")}
          >
            <Text className="font-bold text-xl text-primary-foreground">
              Continuar
            </Text>
          </Button>

          <Pressable
            onPress={() => router.push("/login")}
            className="h-10 items-center justify-center"
          >
            <Text className="text-center text-muted-foreground font-semibold text-base">
              Ya tengo una cuenta
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
