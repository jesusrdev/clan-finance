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
import { Text } from "@/components/ui/text";
import { View, Alert } from "react-native";
import * as React from "react";
import { supabase } from "@/lib/supabase/client";

export function ForgotPasswordForm({ onDismiss }: { onDismiss?: () => void }) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit() {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "clanfinance://reset-password",
      });
      if (error) throw error;

      Alert.alert(
        "Correo enviado",
        "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => onDismiss?.() }],
      );
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left font-bold">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tu correo para recibir un enlace de recuperación.
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
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={loading}>
              <Text className="text-primary-foreground font-bold">
                {loading ? "Enviando..." : "Restablecer contraseña"}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
