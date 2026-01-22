/**
 * Tipos de base de datos de Supabase
 * Generados automáticamente desde el esquema de la base de datos
 */

export interface Database {
  public: {
    Tables: {
      clans: {
        Row: {
          id: string;
          name: string;
          admin_id: string;
          currency_code: string;
          monthly_allowance: number;
          min_completion_percent: number;
          join_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["clans"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["clans"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          clan_id: string | null;
          display_name: string;
          avatar_url: string | null;
          role: "admin" | "member";
          selected_theme: string;
          xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      join_requests: {
        Row: {
          id: string;
          clan_id: string;
          user_id: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["join_requests"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["join_requests"]["Insert"]
        >;
      };
      tasks: {
        Row: {
          id: string;
          clan_id: string;
          title: string;
          reward_value: number;
          frequency: "daily" | "weekly" | "monthly" | "once";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tasks"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
      };
      task_logs: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          status: "pending" | "approved" | "rejected";
          completed_at: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["task_logs"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["task_logs"]["Insert"]>;
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["wallets"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["wallets"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          wallet_id: string;
          amount: number;
          type:
            | "allowance_payout"
            | "manual_income"
            | "expense"
            | "savings_transfer";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["transactions"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      payouts: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          month: number;
          year: number;
          payout_type: "monthly_allowance" | "bonus" | "special";
          description: string | null;
          status: "calculated" | "paid_in_person";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["payouts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["payouts"]["Insert"]>;
      };
    };
  };
}
