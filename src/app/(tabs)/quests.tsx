import React from "react";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react-native";
import { useToast } from "@/components/ui/toast";
import { useCompleteTask } from "@/features/quests/hooks/useCompleteTask";

export default function QuestsScreen() {
  const { signOut } = useAuth();
  const toast = useToast();
  const { completeTask, isCompleting, lastErrorCode } = useCompleteTask();

  const questPlaceholder = {
    id: "placeholder-quest-1",
    title: "Registrar gasto del día",
    frequency: "daily" as const,
  };

  useEffect(() => {
    if (lastErrorCode === "TASK_ALREADY_COMPLETED_IN_WINDOW") {
      toast.show("Misión ya completada", "Ya completaste esta tarea en este período.", "info");
    }
  }, [lastErrorCode, toast]);

  const handleCompleteTask = async () => {
    try {
      await completeTask(questPlaceholder);
      toast.show("¡Misión enviada!", "Tu completitud quedó pendiente de aprobación.", "success");
    } catch (error) {
      if (lastErrorCode === "TASK_ALREADY_COMPLETED_IN_WINDOW") {
        return;
      }

      toast.show("No se pudo completar", "Revisá tu conexión e intentá de nuevo.", "error");
    }
  };

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
        <View className="bg-card p-6 rounded-3xl border-2 border-border/50 gap-4">
          <Text className="text-lg font-semibold text-foreground">{questPlaceholder.title}</Text>
          <Text className="text-muted-foreground">Frecuencia: diaria</Text>

          <Button
            onPress={handleCompleteTask}
            disabled={isCompleting}
            className="rounded-2xl"
          >
            <Text className="font-bold text-primary-foreground">
              {isCompleting ? "Completando..." : "Completar"}
            </Text>
          </Button>
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
