import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useToast } from "@/components/ui/toast";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { profile, updateProfile, isUpdating } = useProfile();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const [displayName, setDisplayName] = React.useState(profile?.display_name ?? "");
  const [error, setError] = React.useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
  };

  React.useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile?.display_name]);

  const handleSubmit = async () => {
    const trimmed = displayName.trim();

    if (!trimmed) {
      setError("El nombre no puede estar vacío.");
      toast.show("Nombre inválido", "Ingresá un nombre para poder guardar.", "error");
      return;
    }

    setError(null);

    try {
      await updateProfile({ display_name: trimmed });
      toast.show("Cambios guardados", "Tu nombre se actualizó correctamente.", "success");
      handleBack();
    } catch (e) {
      console.error("Error al actualizar display_name:", e);
      setError("No pudimos guardar tu nombre. Intentá nuevamente.");
      toast.show("No se pudo guardar", "Revisá tu conexión e intentá de nuevo.", "error");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-5 py-5 mx-auto w-full max-w-2xl">
          {/* Top Bar */}
          <View className="flex-row items-center mb-4">
            <Pressable
              onPress={handleBack}
              className="flex-row items-center active:opacity-50"
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <ChevronLeft size={22} color="gray" />
              <Text className="font-medium text-muted-foreground">Volver</Text>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 24,
            }}
          >
            <Text className="text-3xl font-black text-foreground">Editar nombre</Text>
            <Text className="text-muted-foreground font-medium mt-1 mb-6">
              Cambiá cómo te ve el Clan en tu perfil.
            </Text>

            <View className="rounded-3xl border border-border/50 bg-card/30 p-4">
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
                  maxLength={40}
                />
                <Text className="text-muted-foreground text-xs">
                  Se verá en tus misiones, progreso y actividad del Clan.
                </Text>
                {error && <Text className="text-destructive text-xs font-semibold">{error}</Text>}
              </View>
            </View>

            <View className="mt-auto pt-8 gap-3">
              <Button
                onPress={handleSubmit}
                disabled={isUpdating}
                className={isCompact ? "w-full" : "w-full rounded-2xl"}
              >
                <Text>{isUpdating ? "Guardando..." : "Guardar cambios"}</Text>
              </Button>
              <Button
                variant="outline"
                onPress={handleBack}
                disabled={isUpdating}
                className={isCompact ? "w-full" : "w-full rounded-2xl"}
              >
                <Text>Cancelar</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
