import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { LoginForm } from "../components/LoginForm";
import { Text } from "@/components/ui/text";

export function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-background" style={{ flex: 1 }}>
      {/* Top Bar with Back Button */}
      <View className="flex-row items-center px-4 h-14">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1 active:opacity-50"
        >
          <ChevronLeft size={24} color="gray" />
          <Text className="text-muted-foreground font-medium">Volver</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}
