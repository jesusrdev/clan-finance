import { SocialConnections } from "@/components/social-connections";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import * as React from "react";
import { Pressable, type TextInput, View, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "expo-router";
import { useUniwind } from "uniwind";
import { THEME_METADATA } from "@/lib/theme";

export function RegisterForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const { signUp } = useAuth();
  const router = useRouter();
  const { theme } = useUniwind();
  const metadata = THEME_METADATA[theme as keyof typeof THEME_METADATA];

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert("¡Éxito!", "Revisa tu correo para confirmar tu cuenta");
    } catch (e: any) {
      Alert.alert("Error de registro", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-6 w-full max-w-md">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-lg sm:shadow-black/5 rounded-3xl">
        <CardHeader className="items-center sm:items-start pt-8">
          <View
            style={{ backgroundColor: metadata?.color }}
            className="size-16 rounded-2xl items-center justify-center mb-4 shadow-md border-2 border-white/20"
          >
            <Text className="text-3xl">{metadata?.icon || "⚔️"}</Text>
          </View>
          <CardTitle className="text-center sm:text-left text-2xl font-bold">
            Crea tu cuenta
          </CardTitle>
          <CardDescription className="text-center sm:text-left text-base">
            ¡Tu aventura financiera comienza aquí! Únete a un Clan.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Email */}
            <View className="gap-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View className="gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                placeholder="Crea una contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={onPasswordSubmitEditing}
                returnKeyType="next"
              />
            </View>

            {/* Confirm Password */}
            <View className="gap-1.5">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                ref={confirmPasswordInputRef}
                id="confirm-password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onSubmitEditing={onSubmit}
                returnKeyType="send"
              />
            </View>

            <Button
              className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 border-b-4 border-primary/30 active:border-b-0 active:translate-y-1"
              onPress={onSubmit}
              disabled={loading}
            >
              <Text className="text-primary-foreground font-bold text-lg">
                {loading ? "Creando cuenta..." : "¡UNIRSE AL CLAN!"}
              </Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center pt-2">
            <Text className="text-base text-muted-foreground font-medium">
              ¿Ya tienes una cuenta?{" "}
            </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-base font-bold text-primary">
                Entra aquí
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">
              o regístrate con
            </Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
