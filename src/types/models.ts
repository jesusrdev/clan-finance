/**
 * Tipos de modelos de negocio
 * Extraídos de database.types.ts para facilitar el uso
 */

import { Database } from "./database.types";

// =====================================================
// TIPOS DE TABLAS (Row)
// =====================================================

export type Clan = Database["public"]["Tables"]["clans"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type JoinRequest = Database["public"]["Tables"]["join_requests"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskLog = Database["public"]["Tables"]["task_logs"]["Row"];
export type Wallet = Database["public"]["Tables"]["wallets"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Payout = Database["public"]["Tables"]["payouts"]["Row"];

// =====================================================
// TIPOS DE INSERCIÓN
// =====================================================

export type ClanInsert = Database["public"]["Tables"]["clans"]["Insert"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type JoinRequestInsert =
  Database["public"]["Tables"]["join_requests"]["Insert"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskLogInsert = Database["public"]["Tables"]["task_logs"]["Insert"];
export type WalletInsert = Database["public"]["Tables"]["wallets"]["Insert"];
export type TransactionInsert =
  Database["public"]["Tables"]["transactions"]["Insert"];
export type PayoutInsert = Database["public"]["Tables"]["payouts"]["Insert"];

// =====================================================
// TIPOS DE ACTUALIZACIÓN
// =====================================================

export type ClanUpdate = Database["public"]["Tables"]["clans"]["Update"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type JoinRequestUpdate =
  Database["public"]["Tables"]["join_requests"]["Update"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type TaskLogUpdate = Database["public"]["Tables"]["task_logs"]["Update"];
export type WalletUpdate = Database["public"]["Tables"]["wallets"]["Update"];
export type TransactionUpdate =
  Database["public"]["Tables"]["transactions"]["Update"];
export type PayoutUpdate = Database["public"]["Tables"]["payouts"]["Update"];

// =====================================================
// ENUMS
// =====================================================

export type UserRole = "admin" | "member";
export type RequestStatus = "pending" | "approved" | "rejected";
export type TaskFrequency = "daily" | "weekly" | "monthly" | "once";
export type TransactionType =
  | "allowance_payout"
  | "manual_income"
  | "expense"
  | "savings_transfer";
export type PayoutStatus = "calculated" | "paid_in_person";
export type PayoutType = "monthly_allowance" | "bonus" | "special";

// =====================================================
// TIPOS DE TEMAS
// =====================================================

export type ThemeName =
  | "onePiece"
  | "demonSlayer"
  | "naruto"
  | "dragonBall"
  | "strangerThings";
