import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_STEPS = [
  {
    title: "Gestiona como un Pro",
    description:
      "Controla tus finanzas familiares con un toque de aventura pirata o ninja.",
    image: require("@/../assets/onboarding_1.png"),
    bgColor: "bg-blue-500/5",
  },
  {
    title: "Completa Quests",
    description:
      "Ahorrar nunca fue tan divertido. ¡Gana premios por tus logros diarios!",
    image: require("@/../assets/onboarding_2.png"),
    bgColor: "bg-orange-500/5",
  },
  {
    title: "Skins de Anime",
    description:
      "Desbloquea estilos legendarios de tus animes favoritos para tu app.",
    image: require("@/../assets/onboarding_3.png"),
    bgColor: "bg-red-500/5",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = React.useState(windowWidth);
  const flatListRef = React.useRef<FlatList>(null);

  // Optimización de ViewableItems para evitar delays y asegurar trigger en Web
  const onViewableItemsChanged = React.useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index || 0;
      setActiveIndex(index);
    }
  }, []);

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const handleNext = () => {
    if (activeIndex < ONBOARDING_STEPS.length - 1) {
      const nextIndex = activeIndex + 1;
      // Pre-actualizamos el estado para inmediatez visual en Web
      if (Platform.OS === "web") {
        setActiveIndex(nextIndex);
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    } else {
      router.push("/theme-selection");
    }
  };

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof ONBOARDING_STEPS)[0] }) => (
      <View
        style={{ width: containerWidth }}
        className="justify-center items-center px-5"
      >
        <View className="items-center w-full max-w-sm">
          <View
            className={cn(
              "rounded-3xl overflow-hidden shadow-xl shadow-black/20 mb-6",
              item.bgColor,
            )}
            style={{
              width: "100%",
              aspectRatio: 1,
              maxHeight: windowHeight * 0.33,
              maxWidth: windowHeight * 0.33,
            }}
          >
            <Image
              source={item.image}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
              priority="high"
            />
          </View>

          <View className="w-full">
            <Text className="mb-4 text-2xl font-bold text-center sm:text-3xl text-foreground">
              {item.title}
            </Text>
            <Text
              className="px-2 text-base leading-7 text-center sm:text-lg text-muted-foreground"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
        </View>
      </View>
    ),
    [containerWidth, windowHeight],
  );

  return (
    <SafeAreaView className="bg-background" style={{ flex: 1 }}>
      <View
        className="flex-1 mx-auto w-full max-w-2xl"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {/* Header */}
        <View className="items-center px-6 py-4">
          <View className="justify-center items-center mb-2 rounded-xl border shadow-sm size-12 bg-primary/10 border-primary/20">
            <Text className="text-2xl">🎮</Text>
          </View>
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            Clan Finance
          </Text>
        </View>

        {/* Carousel */}
        <View className="flex-1 justify-center">
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
            disableIntervalMomentum={true} // Mejora el snapping en iOS/Web
            onScrollToIndexFailed={() => {}} // Previene crashes
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews={Platform.OS !== "web"}
            getItemLayout={(_, index) => ({
              length: containerWidth,
              offset: containerWidth * index,
              index,
            })}
            contentContainerStyle={{
              alignItems: "center",
              flexGrow: 1,
            }}
            style={{ flex: 1 }}
          />

          {/* Pagination Indicators - More noticeable visibility */}
          <View className="flex-row gap-3 justify-center py-4">
            {ONBOARDING_STEPS.map((_, i) => (
              <View
                key={i}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 border",
                  i === activeIndex
                    ? "w-8 bg-primary border-primary/40 shadow-sm shadow-primary/30"
                    : "w-2.5 bg-muted/30 border-muted-foreground/30",
                )}
              />
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className="gap-4 px-6 py-8 pt-4">
          <Button
            size="lg"
            className="w-full rounded-2xl border-b-0 shadow-lg shadow-primary/20 border-primary/40 active:border-b-0 active:translate-y-1"
            onPress={handleNext}
          >
            <Text className="text-xl font-bold text-primary-foreground">
              {activeIndex === ONBOARDING_STEPS.length - 1
                ? "¡Empezar!"
                : "Continuar"}
            </Text>
          </Button>

          <Pressable
            onPress={() => router.push("/login")}
            className="justify-center items-center"
          >
            <Text className="text-base font-semibold text-center text-muted-foreground">
              Ya tengo una cuenta
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
