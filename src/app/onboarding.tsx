import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { View } from "react-native";

export default function OnboardingScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center px-6 bg-background">
      <Text className="text-2xl font-bold text-center text-foreground">
        Te falta completar el onboarding del clan
      </Text>
      <Text className="mt-3 text-center text-muted-foreground">
        Vamos a llevarte por ese flujo antes de entrar a la app.
      </Text>

      <Button className="mt-8" onPress={() => signOut()}>
        <Text>Cerrar sesión</Text>
      </Button>
    </View>
  );
}
