import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Maneja el redirect de OAuth en Web
WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios en la sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (Platform.OS === "web") {
      // En Web, usar el flujo estándar sin WebBrowser
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/google-auth`,
        },
      });

      if (error) throw error;
      return data;
    } else {
      // En móvil, usar WebBrowser
      const redirectUrl = Linking.createURL("google-auth");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (!data?.url) {
        throw new Error("No se pudo obtener la URL de autenticación");
      }

      // Usar WebBrowser para abrir la sesión de OAuth
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type === "success") {
        const { url } = result;

        // El hash (#) se usa para tokens implícitos, el query (?) para códigos PKCE
        const baseUrl = url.includes("#")
          ? url.split("#")[1]
          : url.split("?")[1];
        const params = new URLSearchParams(baseUrl);

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const code = params.get("code");

        if (access_token && refresh_token) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
          if (sessionError) throw sessionError;
          return sessionData;
        } else if (code) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (sessionError) throw sessionError;
          return sessionData;
        }

        return data;
      } else {
        throw new Error("Autenticación cancelada");
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  return {
    session,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
}
