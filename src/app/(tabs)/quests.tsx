import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react-native";

export default function QuestsScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-background px-4">
      <View className="items-center mb-10">
        <Text className="text-4xl mb-2">⚔️</Text>
        <Text className="text-3xl font-bold text-primary">Misiones</Text>
        <Text className="text-muted-foreground text-center mt-2 px-6">
          Tu aventura financiera apenas comienza. Completa tus misiones diarias
          para ganar XP y oro.
        </Text>
      </View>

      <View className="w-full max-w-xs gap-4">
        {/* Marcador de posición para misiones */}
        <View className="bg-card p-6 rounded-3xl border-2 border-border/50 items-center">
          <Text className="text-muted-foreground font-medium">
            Próximamente más misiones...
          </Text>
        </View>

        {/* Botón de Logout para pruebas de flujo */}
        <Button
          variant="outline"
          className="rounded-2xl border-destructive/20 active:bg-destructive/10 mt-10"
          onPress={() => signOut()}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-destructive font-bold ml-2">Cerrar Sesión</Text>
        </Button>
      </View>
    </View>
  );
}
