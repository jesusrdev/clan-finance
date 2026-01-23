import { SocialConnections } from "@/components/social-connections";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
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

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const passwordInputRef = React.useRef<TextInput>(null);

  const { signIn } = useAuth();
  const router = useRouter();
  const { theme } = useUniwind();
  const metadata = THEME_METADATA[theme as keyof typeof THEME_METADATA];
  const toast = useToast();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!email || !password) {
      toast.show(
        "¡Misión Interrumpida!",
        "Para entrar a tu Clan, necesitamos tu correo y contraseña.",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e: any) {
      let message = e.message;
      if (message.includes("Invalid login credentials")) {
        message =
          "¿Has olvidado las llaves de tu Clan? Las credenciales no parecen correctas.";
      } else if (message.includes("Email not confirmed")) {
        message =
          "¡Un momento! Tu pergamino aún no ha sido confirmado. Revisa tu correo.";
      }
      toast.show("¡Misión Fallida!", message, "error");
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
            <Text className="text-3xl">{metadata?.icon || "🎮"}</Text>
          </View>
          <CardTitle className="text-center sm:text-left text-2xl font-bold">
            Bienvenido de nuevo
          </CardTitle>
          <CardDescription className="text-center sm:text-left text-base">
            ¡Prepárate para tu próxima misión! Ingresa tus credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
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
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      size="sm"
                      className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                    >
                      <Text className="font-normal leading-4 text-xs">
                        ¿Olvidaste tu contraseña?
                      </Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Recuperar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu correo para recibir las instrucciones de
                        recuperación.
                      </DialogDescription>
                    </DialogHeader>
                    <ForgotPasswordForm />
                  </DialogContent>
                </Dialog>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
            <Button
              className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 border-b-4 border-primary/30 active:border-b-0 active:translate-y-1"
              onPress={onSubmit}
              disabled={loading}
            >
              <Text className="text-primary-foreground font-bold text-lg">
                {loading ? "Iniciando sesión..." : "¡VAMOS!"}
              </Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center pt-2">
            <Text className="text-base text-muted-foreground font-medium">
              ¿Eres nuevo aquí?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/register")}>
              <Text className="text-base font-bold text-primary">
                Crea tu Clan
              </Text>
            </Pressable>
          </View>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">
              o continúa con
            </Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
