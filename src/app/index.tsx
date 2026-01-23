import {
  View,
  Pressable,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";

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
  const { width: windowWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = React.useState(windowWidth);
  const flatListRef = React.useRef<FlatList>(null);

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: (typeof ONBOARDING_STEPS)[0] }) => (
    <View
      style={{ width: containerWidth }}
      className="items-center justify-center px-8"
    >
      <View className="w-full max-w-md">
        <View
          className={cn(
            "w-full aspect-square max-w-[320px] mx-auto rounded-3xl overflow-hidden mb-8 shadow-xl shadow-black/20",
            item.bgColor,
          )}
        >
          <Image
            source={item.image}
            className="w-full h-full"
            contentFit="contain"
          />
        </View>
        <Text className="text-3xl font-bold text-foreground text-center mb-4 px-4">
          {item.title}
        </Text>
        <Text className="text-muted-foreground text-center text-lg leading-7 px-2">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        className="flex-1 w-full max-w-2xl mx-auto justify-between py-6"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
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
          <FlatList
            ref={flatListRef}
            data={ONBOARDING_STEPS}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            bounces={false}
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={containerWidth}
            contentContainerStyle={{ alignItems: "center" }}
          />

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
