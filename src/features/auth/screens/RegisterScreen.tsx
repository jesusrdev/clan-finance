import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterScreen() {
  return (
    <SafeAreaView className="bg-background" style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-4">
        <RegisterForm />
      </View>
    </SafeAreaView>
  );
}
