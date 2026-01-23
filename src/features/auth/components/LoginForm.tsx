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

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const passwordInputRef = React.useRef<TextInput>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e: any) {
      Alert.alert("Error de inicio de sesión", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-6 w-full max-w-md">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left font-bold">
            Bienvenido de nuevo
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tus credenciales para acceder a tu cuenta de Clan Finance
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
              <View className="flex-row items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() =>
                    Alert.alert(
                      "Próximamente",
                      "La recuperación de contraseña estará disponible pronto.",
                    )
                  }
                >
                  <Text className="font-normal leading-4 text-xs">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Button>
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
            <Button className="w-full" onPress={onSubmit} disabled={loading}>
              <Text className="text-primary-foreground font-bold">
                {loading ? "Iniciando sesión..." : "Continuar"}
              </Text>
            </Button>
          </View>
          <Text className="text-center text-sm text-muted-foreground font-medium">
            ¿No tienes una cuenta?{" "}
            <Pressable
              onPress={() => router.push("/register")}
              className="justify-center flex"
            >
              <Text className="text-sm font-bold text-primary underline underline-offset-4">
                Regístrate
              </Text>
            </Pressable>
          </Text>
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
