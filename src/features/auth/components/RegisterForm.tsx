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
import { useToast } from "@/components/ui/toast";

export function RegisterForm() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const nameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const { signUp } = useAuth();
  const router = useRouter();
  const { theme } = useUniwind();
  const metadata = THEME_METADATA[theme as keyof typeof THEME_METADATA];
  const toast = useToast();

  function onNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.show(
        "¡Misión Incompleta!",
        "Por favor completa todos los campos para continuar.",
        "error",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.show(
        "¡Conflicto!",
        "Las contraseñas no coinciden. Revisa tu pergamino.",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName);
      setSuccess(true);
    } catch (e: any) {
      toast.show(
        "Misión Fallida",
        e.message || "Algo salió mal al intentar crear tu cuenta.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <View className="gap-6 w-full max-w-md">
        <Card className="border-border/0 sm:border-border shadow-none sm:shadow-lg sm:shadow-black/5 rounded-3xl">
          <CardHeader className="items-center pt-8">
            <View
              style={{ backgroundColor: metadata?.color }}
              className="size-20 rounded-3xl items-center justify-center mb-6 shadow-xl border-2 border-white/20"
            >
              <Text className="text-5xl">📩</Text>
            </View>
            <CardTitle className="text-center text-3xl font-bold">
              ¡Misión Lanzada!
            </CardTitle>
            <CardDescription className="text-center text-base px-2 pt-2">
              Hemos enviado un pergamino de confirmación a{" "}
              <Text className="font-bold text-primary">{email}</Text>.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6 items-center">
            <Text className="text-center text-muted-foreground">
              Revísalo para activar tu cuenta y comenzar tu aventura financiera.
            </Text>
            <Button
              className="w-full h-14 rounded-2xl"
              onPress={() => router.push("/login")}
            >
              <Text className="text-primary-foreground font-bold text-lg">
                Ir al Inicio de Sesión
              </Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    );
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
            {/* Full Name */}
            <View className="gap-1.5">
              <Label htmlFor="fullname">Nombre Completo</Label>
              <Input
                ref={nameInputRef}
                id="fullname"
                placeholder="Ej. Monkey D. Luffy"
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
                onSubmitEditing={onNameSubmitEditing}
                returnKeyType="next"
              />
            </View>

            {/* Email */}
            <View className="gap-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                ref={emailInputRef}
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
            <Pressable onPress={() => router.replace("/login")}>
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
