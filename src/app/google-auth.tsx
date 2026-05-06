import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

export default function GoogleAuthCallback() {
  const router = useRouter();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // En Web, Supabase detecta automáticamente el hash fragment (#access_token=...)
        // y actualiza la sesión. Solo necesitamos esperar un momento.
        if (Platform.OS === "web") {
          // Dar tiempo a Supabase para procesar el hash fragment
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Verificar si hay sesión después de que Supabase procese el callback
        let {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Initial Session check:", session?.user?.email);

        // Si no hay sesión inmediata, reintentar una vez tras un pequeño delay
        // (especialmente útil en mobile cuando el onAuthStateChange no es instantáneo)
        if (!session) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();
          session = retrySession;
        }

        console.log("Final Session check:", session?.user?.email);

        if (session) {
          const userName =
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0];

          toast.show("¡Bienvenido!", `Hola ${userName}`, "success");

          // Pequeña pausa para que el usuario vea el toast
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Dejar que el gate central (_layout) resuelva onboarding vs tabs.
          router.replace("/");
        } else {
          console.log(
            "No session found after OAuth. Params:",
            window.location.hash || window.location.search,
          );
          toast.show(
            "¡Misión Fallida!",
            "No se pudo completar el inicio de sesión",
            "error",
          );
          setTimeout(() => {
            router.replace("/login");
          }, 2000);
        }
      } catch (err) {
        console.error("Error in OAuth callback:", err);
        toast.show(
          "¡Misión Fallida!",
          "Error inesperado al iniciar sesión",
          "error",
        );
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-background">
      {isProcessing && (
        <>
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-muted-foreground">
            Completando inicio de sesión...
          </Text>
        </>
      )}
    </View>
  );
}
