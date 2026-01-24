import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind, useUniwind } from "uniwind";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

const THEME_STORAGE_KEY = "@uniwind/theme";

export function useThemePersistence() {
  const { theme } = useUniwind();
  const { session } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Cargar tema inicial desde el almacenamiento local
  useEffect(() => {
    async function loadPersistedTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          Uniwind.setTheme(savedTheme as any);
        } else if (session?.user?.id) {
          // Si no hay localmente, intentar cargar de Supabase
          const { data, error } = await supabase
            .from("profiles")
            .select("selected_theme")
            .eq("id", session.user.id)
            .single();

          if (data && "selected_theme" in data && data.selected_theme) {
            const themeValue = data.selected_theme as any;
            Uniwind.setTheme(themeValue);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, themeValue);
          }
        }
      } catch (error) {
        console.error("Error al cargar el tema persistido:", error);
      } finally {
        setIsReady(true);
      }
    }

    loadPersistedTheme();
  }, [session?.user?.id]);

  // Función para cambiar y persistir el tema
  const updateTheme = async (newTheme: string) => {
    try {
      // 1. Cambiar inmediatamente para feedback visual
      Uniwind.setTheme(newTheme as any);

      // 2. Guardar localmente
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);

      // 3. Sincronizar con Supabase si hay sesión
      if (session?.user?.id) {
        const { error } = await supabase
          .from("profiles")
          .update({ selected_theme: newTheme } as any)
          .eq("id", session.user.id);

        if (error) {
          console.error("Error al sincronizar tema con Supabase:", error);
        }
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
