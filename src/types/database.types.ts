/*
 * Supabase generated types
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clans: {
        Row: {
          admin_id: string | null;
          created_at: string;
          currency_code: string;
          id: string;
          join_code: string;
          min_completion_percent: number;
          monthly_allowance: number;
          name: string;
          updated_at: string;
        };
        Insert: {
          admin_id?: string | null;
          created_at?: string;
          currency_code?: string;
          id?: string;
          join_code: string;
          min_completion_percent?: number;
          monthly_allowance?: number;
          name: string;
          updated_at?: string;
        };
        Update: {
          admin_id?: string | null;
          created_at?: string;
          currency_code?: string;
          id?: string;
          join_code?: string;
          min_completion_percent?: number;
          monthly_allowance?: number;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clans_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      join_requests: {
        Row: {
          clan_id: string;
          created_at: string;
          id: string;
          status: Database["public"]["Enums"]["request_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          clan_id: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          clan_id?: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["request_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "join_requests_clan_id_fkey";
            columns: ["clan_id"];
            isOneToOne: false;
            referencedRelation: "clans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "join_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payouts: {
        Row: {
          amount: number;
          created_at: string;
          description: string | null;
          id: string;
          month: number;
          payout_type: Database["public"]["Enums"]["payout_type"];
          status: Database["public"]["Enums"]["payout_status"];
          updated_at: string;
          user_id: string;
          year: number;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          month: number;
          payout_type: Database["public"]["Enums"]["payout_type"];
          status?: Database["public"]["Enums"]["payout_status"];
          updated_at?: string;
          user_id: string;
          year: number;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          month?: number;
          payout_type?: Database["public"]["Enums"]["payout_type"];
          status?: Database["public"]["Enums"]["payout_status"];
          updated_at?: string;
          user_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "payouts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          clan_id: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          selected_theme: string | null;
          updated_at: string;
          xp: number;
        };
        Insert: {
          avatar_url?: string | null;
          clan_id?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          selected_theme?: string | null;
          updated_at?: string;
          xp?: number;
        };
        Update: {
          avatar_url?: string | null;
          clan_id?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          selected_theme?: string | null;
          updated_at?: string;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_clan_id_fkey";
            columns: ["clan_id"];
            isOneToOne: false;
            referencedRelation: "clans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      task_logs: {
        Row: {
          completed_at: string;
          created_at: string;
          id: string;
          status: Database["public"]["Enums"]["request_status"];
          task_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["request_status"];
          task_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["request_status"];
          task_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "task_logs_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "task_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          clan_id: string;
          created_at: string;
          frequency: Database["public"]["Enums"]["task_frequency"];
          id: string;
          is_active: boolean;
          reward_value: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          clan_id: string;
          created_at?: string;
          frequency: Database["public"]["Enums"]["task_frequency"];
          id?: string;
          is_active?: boolean;
          reward_value?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          clan_id?: string;
          created_at?: string;
          frequency?: Database["public"]["Enums"]["task_frequency"];
          id?: string;
          is_active?: boolean;
          reward_value?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_clan_id_fkey";
            columns: ["clan_id"];
            isOneToOne: false;
            referencedRelation: "clans";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          description: string | null;
          id: string;
          type: Database["public"]["Enums"]["transaction_type"];
          wallet_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          type: Database["public"]["Enums"]["transaction_type"];
          wallet_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
          wallet_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey";
            columns: ["wallet_id"];
            isOneToOne: false;
            referencedRelation: "wallets";
            referencedColumns: ["id"];
          },
        ];
      };
      wallets: {
        Row: {
          balance: number;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      payout_status: "calculated" | "paid_in_person";
      payout_type: "monthly_allowance" | "bonus" | "special";
      request_status: "pending" | "approved" | "rejected";
      task_frequency: "daily" | "weekly" | "monthly" | "once";
      transaction_type:
        | "allowance_payout"
        | "manual_income"
        | "expense"
        | "savings_transfer";
      user_role: "admin" | "member";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
