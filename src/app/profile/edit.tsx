import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/features/profile/hooks/useProfile";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdating } = useProfile();
  const [displayName, setDisplayName] = React.useState(profile?.display_name ?? "");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile?.display_name]);

  const handleSubmit = async () => {
    const trimmed = displayName.trim();

    if (!trimmed) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    setError(null);

    try {
      await updateProfile({ display_name: trimmed });
      router.back();
    } catch (e) {
      console.error("Error al actualizar display_name:", e);
      setError("No pudimos guardar tu nombre. Intentá nuevamente.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }} edges={["top"]}>
      <View className="flex-1 px-6 py-6 mx-auto w-full max-w-2xl">
        <Text className="text-3xl font-black text-foreground">Editar identidad</Text>
        <Text className="text-muted-foreground font-medium mt-1 mb-6">
          Cambiá cómo te ve el Clan en tu perfil.
        </Text>

        <View className="gap-2">
          <Text className="text-foreground font-bold text-sm">Nombre visible</Text>
          <Input
            value={displayName}
            onChangeText={(value) => {
              setDisplayName(value);
              if (error) setError(null);
            }}
            placeholder="Ingresá tu nombre"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          {error && <Text className="text-destructive text-xs font-semibold">{error}</Text>}
        </View>

        <View className="mt-8 gap-3">
          <Button onPress={handleSubmit} disabled={isUpdating}>
            <Text>{isUpdating ? "Guardando..." : "Guardar cambios"}</Text>
          </Button>
          <Button variant="outline" onPress={() => router.back()} disabled={isUpdating}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
