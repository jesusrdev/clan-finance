import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind, useUniwind } from "uniwind";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileService } from "@/services/ProfileService";

const THEME_STORAGE_KEY = "@uniwind/theme";

export function useThemePersistence() {
  const { theme } = useUniwind();
  const { session } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // 1. Cargar tema inicial desde el almacenamiento local lo más rápido posible
  useEffect(() => {
    async function loadInitialTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          Uniwind.setTheme(savedTheme as any);
        }
      } catch (error) {
        console.error("Error al cargar el tema inicial:", error);
      } finally {
        setIsReady(true);
      }
    }
    loadInitialTheme();
  }, []);

  // 2. Sincronización post-login: Si el usuario inicia sesión, subir su tema local a la nube
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || !isReady) return;

    async function syncThemeOnLogin(currentUserId: string) {
      try {
        const localTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        // Intentar obtener el tema de Supabase (con reintentos por si el perfil tarda en crearse)
        let cloudTheme: string | null | undefined = null;
        let retries = 3;

        while (retries > 0) {
          try {
            cloudTheme = await ProfileService.getSelectedTheme(currentUserId);
            break; // Éxito
          } catch (error) {
            // Esperar 500ms antes de reintentar
            await new Promise((resolve) => setTimeout(resolve, 500));
            retries--;
          }
        }

        // Caso A: El usuario ya tiene un tema en Supabase pero no localmente (ej: nuevo dispositivo)
        if (cloudTheme && !localTheme) {
          Uniwind.setTheme(cloudTheme as any);
          await AsyncStorage.setItem(THEME_STORAGE_KEY, cloudTheme);
        }
        // Caso B: El usuario eligió un tema como invitado y ahora se loguea
        else if (localTheme && localTheme !== cloudTheme) {
          await ProfileService.updateSelectedTheme(currentUserId, localTheme);
        }
      } catch (error) {
        console.error("Error en sincronización post-login:", error);
      }
    }

    syncThemeOnLogin(userId);
  }, [session?.user?.id, isReady]);

  // Función para cambiar y persistir el tema
  const updateTheme = async (newTheme: string) => {
    try {
      // 1. Cambiar inmediatamente para feedback visual
      Uniwind.setTheme(newTheme as any);

      // 2. Guardar localmente
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);

      // 3. Sincronizar con Supabase si hay sesión
      const userId = session?.user?.id;
      if (userId) {
        await ProfileService.updateSelectedTheme(userId, newTheme);
      }
    } catch (error) {
      console.error("Error al persistir el tema:", error);
    }
  };

  return {
    theme,
    isReady,
    updateTheme,
  };
}
