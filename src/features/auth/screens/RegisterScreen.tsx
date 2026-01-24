import React from "react";
import { View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { RegisterForm } from "../components/RegisterForm";
import { Text } from "@/components/ui/text";

export function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-background" style={{ flex: 1 }}>
      {/* Top Bar with Back Button - Static at top */}
      <View className="z-10 flex-row items-center px-4 pt-5 pb-2 bg-background">
        <Pressable
          onPress={() => router.replace("/login")}
          className="flex-row gap-1 items-center active:opacity-50"
        >
          <ChevronLeft size={24} color="gray" />
          <Text className="font-medium text-muted-foreground">Volver</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <View className="justify-center items-center py-6">
            <RegisterForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
