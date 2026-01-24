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
      <Card className="rounded-3xl shadow-none border-border/0 sm:border-border sm:shadow-lg sm:shadow-black/5">
        <CardHeader className="items-center pt-8 sm:items-start">
          <View
            style={{ backgroundColor: metadata?.color }}
            className="justify-center items-center mb-4 rounded-2xl border-2 shadow-md size-16 border-white/20"
          >
            <Text className="text-3xl">{metadata?.icon || "🎮"}</Text>
          </View>
          <CardTitle className="text-2xl font-bold text-center sm:text-left">
            Bienvenido de nuevo
          </CardTitle>
          <CardDescription className="text-base text-center sm:text-left">
            ¡Prepárate para tu próxima misión! Ingresa tus credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-4">
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
              <Label htmlFor="password">Contraseña</Label>
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

            <View className="flex-row justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-1 py-0 h-4 web:h-fit sm:h-4"
                  >
                    <Text className="text-xs font-normal leading-4 text-muted-foreground/80">
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
                  <ForgotPasswordForm onDismiss={() => {}} />
                </DialogContent>
              </Dialog>
            </View>
            <Button
              className="w-full rounded-2xl border-b-0 shadow-lg shadow-primary/20 border-primary/30 active:border-b-0 active:translate-y-1"
              onPress={onSubmit}
              disabled={loading}
            >
              <Text className="font-bold text-primary-foreground">
                {loading ? "Iniciando sesión..." : "¡VAMOS!"}
              </Text>
            </Button>
          </View>
          <View className="flex-row justify-center items-center pt-2">
            <Text className="text-base font-medium text-muted-foreground">
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
            <Text className="px-4 text-sm text-muted-foreground">
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
