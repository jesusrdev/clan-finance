import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import type { Profile, ProfileUpdate } from "@/types/models";

export const ProfileService = {
  /**
   * Obtiene el perfil de un usuario por su ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as Profile;
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
