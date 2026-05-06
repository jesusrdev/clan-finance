import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Trophy } from "lucide-react-native";

interface MonthlyProgressCardProps {
  completedThisMonth: number;
  completionPercentage: number;
}

export function MonthlyProgressCard({
  completedThisMonth,
  completionPercentage,
}: MonthlyProgressCardProps) {
  const isZeroState = completedThisMonth === 0 && completionPercentage === 0;

  return (
    <View className="bg-card p-5 rounded-3xl border border-border/50 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-primary/10 p-2.5 rounded-2xl mr-3">
            <Trophy size={20} color="#d91e1e" />
          </View>
          <View>
            <Text className="text-foreground font-black text-base">Progreso Mensual</Text>
            <Text className="text-muted-foreground text-xs font-medium">
              Tu avance del mes actual
            </Text>
          </View>
        </View>
        <Text className="text-2xl font-black text-primary">{completionPercentage}%</Text>
      </View>

      <View className="mt-4 bg-muted/10 rounded-2xl px-4 py-3">
        <Text className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
          Misiones completadas
        </Text>
        <Text className="text-foreground text-2xl font-black mt-0.5">{completedThisMonth}</Text>
      </View>

      {isZeroState && (
        <Text className="text-muted-foreground text-xs font-medium mt-3">
          Aún no tenés progreso registrado este mes. ¡Completá tu primera misión para empezar!
        </Text>
      )}
    </View>
  );
}
