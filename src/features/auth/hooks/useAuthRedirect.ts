import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Hook para redirigir a usuarios autenticados
 * Úsalo en páginas de auth (login, register, welcome, etc.)
 */
export function useAuthRedirect() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading]);

  return { loading };
}
