import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { Text } from "@/components/ui/text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import {
  getLevel,
  getLevelProgress,
  getRankTitle,
  getThemeMarker,
  getXpForNextLevel,
} from "../utils/profileMath";
import { DEFAULT_PROFILE_AVATAR } from "../constants/avatarEmojis";

interface ProfileHeaderProps {
  displayName?: string | null;
  avatarUrl?: string | null;
  xp?: number;
  selectedTheme?: string | null;
  onAvatarPress?: () => void;
}

export function ProfileHeader({
  displayName,
  avatarUrl,
  xp = 0,
  selectedTheme = "light",
  onAvatarPress,
}: ProfileHeaderProps) {
  const MARKER_SIZE = 24;
  const level = getLevel(xp);
  const progress = getLevelProgress(xp);
  const rank = getRankTitle(selectedTheme || "light", level);
  const marker = getThemeMarker(selectedTheme || "light");
  const nextXp = getXpForNextLevel(xp);

  // Pixel width of the track — needed because worklets can't use % strings
  const [trackWidth, setTrackWidth] = useState(0);

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  // Per Uniwind docs: use inline style only for dynamic/animated values
  const progressFillStyle = useAnimatedStyle(() => ({
    width: animatedProgress.value * trackWidth,
  }));

  const markerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: animatedProgress.value * trackWidth - MARKER_SIZE / 2 },
      {
        scale: interpolate(
          animatedProgress.value,
          [0, 0.5, 1],
          [0.8, 1.2, 0.8],
        ),
      },
    ],
  }));

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View className="items-center py-8">
      {/* Avatar */}
      <View className="relative">
        <TouchableOpacity
          onPress={onAvatarPress}
          className="w-32 h-32 rounded-full bg-card items-center justify-center overflow-hidden"
          style={{ borderWidth: 4, borderColor: "rgba(217,30,30,0.3)" }}
          activeOpacity={0.8}
        >
          <Text className="text-6xl">{avatarUrl || DEFAULT_PROFILE_AVATAR}</Text>
        </TouchableOpacity>

        {/* Level Badge — plain View, className works fine here */}
        <View
          className="absolute bg-primary px-3 py-1 rounded-full"
          style={{ bottom: -8, right: -8, borderWidth: 2, borderColor: "#000" }}
        >
          <Text className="text-primary-foreground font-black text-xs">
            LVL {level}
          </Text>
        </View>
      </View>

      {/* Name & Rank */}
      <View className="items-center mt-6">
        <Text className="text-3xl font-black text-foreground tracking-tight">
          {displayName || "Viajero Sin Nombre"}
        </Text>
        <View
          className="px-4 py-1.5 rounded-full mt-1"
          style={{
            backgroundColor: "rgba(217,30,30,0.12)",
            borderWidth: 1,
            borderColor: "rgba(217,30,30,0.3)",
          }}
        >
          <Text
            className="font-bold text-xs uppercase tracking-widest"
            style={{ color: "#d91e1e" }}
          >
            {rank}
          </Text>
        </View>
      </View>

      {/* XP Progress Bar */}
      <View className="w-full mt-10 px-8" style={{ maxWidth: 320 }}>
        {/* Labels */}
        <View className="flex-row justify-between mb-3 px-1">
          <Text className="text-muted-foreground font-bold text-[10px] uppercase tracking-tighter">
            Progreso de Rango
          </Text>
          <Text className="text-foreground font-black text-[10px]">
            {Math.floor(progress * 100)}%
          </Text>
        </View>

        {/* Track — onLayout captures real pixel width for worklets */}
        <View
          className="relative h-5 w-full justify-center"
          onLayout={handleTrackLayout}
        >
          {/* Background track — visible in both light and dark mode */}
          <View
            className="h-2.5 w-full rounded-full"
            style={{
              backgroundColor: "rgba(127,127,127,0.2)",
              borderWidth: 1,
              borderColor: "rgba(127,127,127,0.35)",
            }}
          />

          {/* Animated fill — style only (dynamic pixel value) */}
          {trackWidth > 0 && (
            <Animated.View
              className="absolute left-0 h-2.5 rounded-full"
              style={[{ backgroundColor: "#d91e1e" }, progressFillStyle]}
            />
          )}

          {/* Animated marker — style only (dynamic translateX) */}
          {trackWidth > 0 && (
            <Animated.View
              className="absolute left-0 top-0 bottom-0 items-center justify-center"
              style={markerStyle}
            >
              <View
                className="rounded-full bg-background items-center justify-center"
                style={{
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                  borderWidth: 1,
                  borderColor: "rgba(217,30,30,0.4)",
                }}
              >
                <Text className="text-sm">{marker}</Text>
              </View>
            </Animated.View>
          )}
        </View>

        {/* XP info */}
        <View className="mt-5 flex-row justify-between items-center opacity-70">
          <Text className="text-[9px] text-muted-foreground font-bold uppercase italic">
            XP: {xp}
          </Text>
          <Text
            className="text-[9px] font-bold uppercase"
            style={{ color: "#d91e1e" }}
          >
            Siguiente Nivel: +{nextXp} XP
          </Text>
        </View>
      </View>
    </View>
  );
}
