import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import { DEFAULT_PROFILE_AVATAR } from "@/features/profile/constants/avatarEmojis";
import { normalizeProfileAvatar } from "@/features/profile/utils/avatar";
import type { Profile, ProfileUpdate } from "@/types/models";

const MONTHLY_METRIC_ELIGIBLE_STATUSES = ["approved", "rejected", "pending"] as const;

export interface MonthlyProfileMetrics {
  completedThisMonth: number;
  completionPercentage: number;
  denominatorCount: number;
  monthStartIso: string;
  nextMonthStartIso: string;
}

function buildMonthWindow(now: Date = new Date()) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    monthStart,
    nextMonthStart,
    monthStartIso: monthStart.toISOString(),
    nextMonthStartIso: nextMonthStart.toISOString(),
  };
}

type MetricStatus = "approved" | "rejected" | "pending" | string;

function computeMonthlyMetricsFromStatuses(statuses: MetricStatus[]) {
  const approvedCount = statuses.filter((status) => status === "approved").length;
  const rejectedCount = statuses.filter((status) => status === "rejected").length;
  const denominatorCount = approvedCount + rejectedCount;
  const completionPercentage =
    denominatorCount === 0 ? 0 : Math.round((approvedCount / denominatorCount) * 100);

  return {
    completedThisMonth: approvedCount,
    denominatorCount,
    completionPercentage,
  };
}

function runMonthlyMetricSelfChecks() {
  const zeroDenominator = computeMonthlyMetricsFromStatuses(["pending", "pending"]);
  if (zeroDenominator.completionPercentage !== 0) {
    console.warn("Monthly metrics check failed: zero denominator should return 0%");
  }

  const seventyFivePercent = computeMonthlyMetricsFromStatuses([
    "approved",
    "approved",
    "approved",
    "rejected",
  ]);
  if (seventyFivePercent.completionPercentage !== 75) {
    console.warn("Monthly metrics check failed: 3/4 should return 75%");
  }

  const { monthStartIso, nextMonthStartIso } = buildMonthWindow(new Date("2026-05-15T12:00:00.000Z"));
  if (
    monthStartIso !== "2026-05-01T00:00:00.000Z" ||
    nextMonthStartIso !== "2026-06-01T00:00:00.000Z"
  ) {
    console.warn("Monthly metrics check failed: month window boundaries are not deterministic");
  }
}

if (__DEV__) {
  runMonthlyMetricSelfChecks();
}

export interface ExtendedProfile extends Profile {
  clan: { name: string } | null;
  wallet: { balance: number } | null;
}

function queueAvatarSoftMigration(userId: string, avatar: string) {
  void supabase
    .from(TABLES.PROFILES)
    .update({ avatar_url: avatar })
    .eq("id", userId)
    .then(({ error }) => {
      if (error) {
        console.warn("Avatar soft migration failed:", error);
      }
    });
}

export const ProfileService = {
  /**
   * Obtiene el perfil de un usuario por su ID
   */
  async getProfile(userId: string): Promise<ExtendedProfile> {
    // 1. Obtener perfil y clan
    const { data: profileData, error: profileError } = await supabase
      .from(TABLES.PROFILES)
      .select(
        `
        *,
        clan:clans!profiles_clan_id_fkey (
          name
        )
      `,
      )
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // 2. Obtener wallet por separado para evitar errores 400 de schema
    let walletBalance = 0;
    try {
      const { data: walletData, error: walletError } = await supabase
        .from(TABLES.WALLETS)
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (!walletError && walletData) {
        walletBalance = walletData.balance;
      }
    } catch (e) {
      console.log("No se pudo cargar la wallet:", e);
    }

    const normalizedAvatar = normalizeProfileAvatar(profileData?.avatar_url);
    if (profileData?.avatar_url !== normalizedAvatar) {
      queueAvatarSoftMigration(userId, DEFAULT_PROFILE_AVATAR);
    }

    // Combinar los datos
    return {
      ...profileData,
      avatar_url: normalizedAvatar,
      wallet: {
        balance: walletBalance
      }
    } as ExtendedProfile;
  },

  /**
   * Obtiene estadísticas del perfil (tareas completadas)
   */
  async getProfileStats(userId: string) {
    const { count, error } = await supabase
      .from(TABLES.TASK_LOGS)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "approved");

    if (error) throw error;
    return {
      completedTasks: count || 0,
    };
  },

  /**
   * Obtiene métricas mensuales del perfil para el mes calendario actual
   */
  async getMonthlyMetrics(userId: string, now: Date = new Date()): Promise<MonthlyProfileMetrics> {
    const { monthStartIso, nextMonthStartIso } = buildMonthWindow(now);

    const { data, error } = await supabase
      .from(TABLES.TASK_LOGS)
      .select("status")
      .eq("user_id", userId)
      .gte("completed_at", monthStartIso)
      .lt("completed_at", nextMonthStartIso)
      .in("status", [...MONTHLY_METRIC_ELIGIBLE_STATUSES]);

    if (error) throw error;

    const computed = computeMonthlyMetricsFromStatuses((data || []).map((item) => item.status));

    return {
      ...computed,
      monthStartIso,
      nextMonthStartIso,
    };
  },

  /**
   * Obtiene solo el tema seleccionado de un perfil
   */
  async getSelectedTheme(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select("selected_theme")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.selected_theme;
  },

  /**
   * Actualiza el perfil de un usuario
   */
  async updateProfile(userId: string, updates: ProfileUpdate) {
    const sanitizedUpdates: ProfileUpdate = {
      ...updates,
      ...(updates.avatar_url !== undefined
        ? { avatar_url: normalizeProfileAvatar(updates.avatar_url) }
        : {}),
    };

    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update(sanitizedUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  /**
   * Actualiza específicamente el tema seleccionado
   */
  async updateSelectedTheme(userId: string, theme: string) {
    return this.updateProfile(userId, { selected_theme: theme });
  },
};
