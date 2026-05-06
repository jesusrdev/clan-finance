import React from "react";
import { View } from "react-native";
import { useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Swords, Target, Wallet } from "lucide-react-native";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
}

function StatItem({ label, value, icon, colorClass }: StatItemProps) {
  return (
    <View className="flex-1 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
      <View
        className={cn(
          "size-10 rounded-2xl items-center justify-center mb-3",
          colorClass,
        )}
      >
        {icon}
      </View>
      <Text className="text-2xl font-black text-foreground">{value}</Text>
      <Text className="text-xs font-bold text-muted-foreground uppercase mt-0.5">
        {label}
      </Text>
    </View>
  );
}

export interface StatsGridProps {
  completedTasks?: number;
  completedQuests?: number;
  balance?: number;
  clanName?: string;
}

export function StatsGrid({
  completedTasks = 0,
  completedQuests = 0,
  balance = 0,
  clanName = "Sin Clan",
}: StatsGridProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 430;

  return (
    <View className="gap-4 px-1" style={{ flexDirection: isSmallScreen ? "column" : "row" }}>
      <View style={{ flex: 1 }}>
        <StatItem
          label="Clan"
          value={clanName}
          colorClass="bg-blue-500/10 text-blue-500"
          icon={<Target size={20} color="#3b82f6" />}
        />
      </View>
      <View style={{ flex: 1 }}>
        <StatItem
          label="Misiones"
          value={completedTasks}
          colorClass="bg-orange-500/10 text-orange-500"
          icon={<Swords size={20} color="#f97316" />}
        />
      </View>
      <View style={{ flex: 1 }}>
        <StatItem
          label="Balance"
          value={`$${balance}`}
          colorClass="bg-primary/10 text-primary"
          icon={<Wallet size={20} color="#d91e1e" />}
        />
      </View>
    </View>
  );
}
