/**
 * Data Transfer Objects (DTOs)
 * Tipos compuestos para la aplicación
 */

import type {
  Clan,
  Profile,
  Task,
  TaskLog,
  Wallet,
  Transaction,
  Payout,
} from "./models";

// =====================================================
// DTOs DE CLAN
// =====================================================

export interface ClanWithMembers extends Clan {
  members: Profile[];
  totalBalance: number;
  activeMembersCount: number;
}

export interface ClanDashboard extends Clan {
  members: ProfileWithWallet[];
  activeTasks: Task[];
  pendingRequests: number;
  monthlyProgress: number; // Porcentaje promedio de completado
}

// =====================================================
// DTOs DE PERFIL
// =====================================================

export interface ProfileWithWallet extends Profile {
  wallet: Wallet;
}

export interface ProfileWithStats extends Profile {
  wallet: Wallet;
  completedTasksThisMonth: number;
  completionPercentage: number;
  totalEarnings: number;
}

// =====================================================
// DTOs DE TAREAS
// =====================================================

export interface TaskWithLogs extends Task {
  logs: TaskLog[];
  completionCount: number;
}

export interface TaskProgress {
  task: Task;
  completedBy: Profile[];
  pendingApproval: number;
  completionRate: number; // Porcentaje de miembros que completaron
}

// =====================================================
// DTOs DE TASK LOGS
// =====================================================

export interface TaskLogWithDetails extends TaskLog {
  task: Task;
  user: Profile;
}

// =====================================================
// DTOs DE WALLET
// =====================================================

export interface WalletWithTransactions extends Wallet {
  transactions: TransactionWithDetails[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface TransactionWithDetails extends Transaction {
  wallet: {
    user: Profile;
  };
}

// =====================================================
// DTOs DE PAYOUTS
// =====================================================

export interface PayoutWithProfile extends Payout {
  profile: Profile;
}

export interface MonthlyPayoutSummary {
  month: number;
  year: number;
  totalAmount: number;
  payouts: PayoutWithProfile[];
  paidCount: number;
  pendingCount: number;
}

// =====================================================
// DTOs DE DASHBOARD
// =====================================================

export interface AdminDashboardData {
  clan: ClanWithMembers;
  monthlyProgress: {
    user: Profile;
    completionPercentage: number;
    tasksCompleted: number;
    tasksTotal: number;
  }[];
  financialSummary: {
    totalBalance: number;
    monthlyAllowance: number;
    totalExpenses: number;
    totalIncome: number;
  };
  pendingApprovals: TaskLogWithDetails[];
}

export interface MemberDashboardData {
  profile: ProfileWithStats;
  activeTasks: Task[];
  recentTransactions: TransactionWithDetails[];
  monthlyProgress: {
    completed: number;
    total: number;
    percentage: number;
    projectedPayout: number;
  };
}

// =====================================================
// DTOs DE ONBOARDING
// =====================================================

export interface OnboardingData {
  hasProfile: boolean;
  hasClan: boolean;
  isAdmin: boolean;
  pendingJoinRequest?: {
    clan: Clan;
    status: "pending" | "approved" | "rejected";
  };
}

// =====================================================
// DTOs DE GRÁFICAS
// =====================================================

export interface ExpenseDistribution {
  type: "allowance_payout" | "manual_income" | "expense" | "savings_transfer";
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string; // 'Jan', 'Feb', etc.
  income: number;
  expenses: number;
  savings: number;
}

export interface TaskCompletionChart {
  user: Profile;
  completionPercentage: number;
  tasksCompleted: number;
  tasksTotal: number;
}
