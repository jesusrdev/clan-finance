import { useAuth } from "@/features/auth/hooks/useAuth";
import { ProfileService } from "@/services/ProfileService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfileUpdate } from "@/types/models";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => (user?.id ? ProfileService.getProfile(user.id) : null),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const statsQuery = useQuery({
    queryKey: ["profile-stats", user?.id],
    queryFn: () => (user?.id ? ProfileService.getProfileStats(user.id) : null),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const monthlyMetricsQuery = useQuery({
    queryKey: ["profile-monthly-metrics", user?.id],
    queryFn: () => (user?.id ? ProfileService.getMonthlyMetrics(user.id) : null),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: ProfileUpdate) => {
      if (!user?.id) throw new Error("No hay usuario autenticado");
      return ProfileService.updateProfile(user.id, updates);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", user?.id], data);
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    monthlyMetrics: monthlyMetricsQuery.data,
    isLoading: profileQuery.isLoading || statsQuery.isLoading || monthlyMetricsQuery.isLoading,
    error: profileQuery.error || statsQuery.error || monthlyMetricsQuery.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}
