import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import type { Profile, ProfileUpdate } from "@/types/models";

export interface ExtendedProfile extends Profile {
  clan: { name: string } | null;
  wallet: { balance: number } | null;
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

    // Combinar los datos
    return {
      ...profileData,
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
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update(updates)
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
