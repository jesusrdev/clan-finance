import React from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { StatsGrid } from "@/features/profile/components/StatsGrid";
import { EmojiPicker } from "@/features/profile/components/EmojiPicker";
import { MonthlyProgressCard } from "@/features/profile/components/MonthlyProgressCard";
import { LogOut, Palette, User, Info, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProfileTab() {
  const { signOut } = useAuth();
  const { profile, stats, monthlyMetrics, isLoading, updateProfile } = useProfile();
  const [emojiPickerOpen, setEmojiPickerOpen] = React.useState(false);
  const router = useRouter();

  if (isLoading && !profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#d91e1e" />
        <Text className="mt-4 font-bold text-muted-foreground text-center px-6">
          Sincronizando con el Clan...
        </Text>
      </View>
    );
  }

  if (!profile && !isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <View className="bg-destructive/10 p-6 rounded-3xl border border-destructive/20 items-center">
          <Info size={40} color="#d91e1e" />
          <Text className="text-foreground font-black text-xl mb-2 text-center mt-4">
            No pudimos encontrar tu perfil
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Ha ocurrido un problema al cargar los datos de tu cuenta. Por favor,
            intenta cerrar sesión y volver a entrar.
          </Text>
          <Button variant="outline" className="w-full" onPress={signOut}>
            <Text>Cerrar Sesión</Text>
          </Button>
        </View>
      </View>
    );
  }

  const handleEmojiSelect = async (emoji: string) => {
    try {
      await updateProfile({ avatar_url: emoji });
    } catch (e) {
      console.error("Error al actualizar avatar:", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Centered container — max-width for desktop */}
        <View
          style={{
            width: "100%",
            maxWidth: 672,
            alignSelf: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
          }}
        >
          {/* Profile Header (Character Sheet) */}
          <ProfileHeader
            displayName={profile?.display_name}
            avatarUrl={profile?.avatar_url}
            xp={profile?.xp}
            selectedTheme={profile?.selected_theme}
            onAvatarPress={() => setEmojiPickerOpen(true)}
          />

          {/* Quick Stats */}
          <View style={{ marginTop: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Info size={16} color="#d91e1e" />
              <Text className="text-xl font-black text-foreground ml-2">
                Aventura Actual
              </Text>
            </View>
            <StatsGrid
              completedTasks={stats?.completedTasks}
              balance={profile?.wallet?.balance}
              clanName={profile?.clan?.name}
            />
          </View>

          {/* Monthly Progress */}
          {monthlyMetrics && (
            <View style={{ marginTop: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Info size={16} color="#d91e1e" />
                <Text className="text-xl font-black text-foreground ml-2">
                  Progreso de este mes
                </Text>
              </View>
              <MonthlyProgressCard
                completedThisMonth={monthlyMetrics.completedThisMonth}
                completionPercentage={monthlyMetrics.completionPercentage}
              />
            </View>
          )}

          {/* Settings & Management */}
          <View style={{ marginTop: 40 }}>
            <Text className="text-xl font-black text-foreground mb-4">
              Ajustes del Sistema
            </Text>

            <View style={{ gap: 12 }}>
              {/* Theme / Appearance */}
              <Button
                variant="outline"
                className="w-full justify-start rounded-3xl !h-16 border-border/50 bg-card/30"
                onPress={() => router.push("/theme-selection")}
              >
                <View className="bg-primary/10 p-2.5 rounded-2xl mr-4">
                  <Palette size={22} color="#d91e1e" />
                </View>
                <View className="flex-1 items-start">
                  <Text className="text-foreground font-bold text-base">
                    Skin de la App
                  </Text>
                  <Text className="text-muted-foreground text-xs font-medium">
                    Cambia tu estilo visual
                  </Text>
                </View>
                <ChevronRight size={18} color="#666" />
              </Button>

              {/* Avatar / Identity */}
              <Button
                variant="outline"
                className="w-full justify-start rounded-3xl !h-16 border-border/50 bg-card/30"
                onPress={() => setEmojiPickerOpen(true)}
              >
                <View className="bg-blue-500/10 p-2.5 rounded-2xl mr-4">
                  <User size={22} color="#3b82f6" />
                </View>
                <View className="flex-1 items-start">
                  <Text className="text-foreground font-bold text-base">
                    Cambiar Avatar
                  </Text>
                  <Text className="text-muted-foreground text-xs font-medium">
                    Elige tu representación
                  </Text>
                </View>
                <ChevronRight size={18} color="#666" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start rounded-3xl !h-16 border-border/50 bg-card/30"
                onPress={() => router.push("/profile/edit")}
              >
                <View className="bg-purple-500/10 p-2.5 rounded-2xl mr-4">
                  <User size={22} color="#8b5cf6" />
                </View>
                <View className="flex-1 items-start">
                  <Text className="text-foreground font-bold text-base">
                    Editar Nombre
                  </Text>
                  <Text className="text-muted-foreground text-xs font-medium">
                    Actualizá tu identidad visible
                  </Text>
                </View>
                <ChevronRight size={18} color="#666" />
              </Button>

              {/* Logout */}
              <Button
                variant="outline"
                className="w-full justify-start rounded-3xl !h-16 border-border/50 bg-muted/5"
                style={{ marginTop: 8 }}
                onPress={signOut}
              >
                <View className="bg-muted/10 p-2.5 rounded-2xl mr-4">
                  <LogOut size={22} color="#666" />
                </View>
                <Text className="text-muted-foreground font-bold text-base">
                  Desvanecerse (Logout)
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Emoji Selection Dialog */}
      <EmojiPicker
        open={emojiPickerOpen}
        onOpenChange={setEmojiPickerOpen}
        currentEmoji={profile?.avatar_url}
        onSelect={handleEmojiSelect}
      />
    </SafeAreaView>
  );
}
