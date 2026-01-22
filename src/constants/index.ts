/**
 * Constantes de la aplicación
 */

export const APP_CONFIG = {
  name: "Clan Finance",
  version: "1.0.0",
  defaultCurrency: "USD",
  minCompletionPercent: 85,
} as const;

export const NOTIFICATION_CONFIG = {
  dailyTaskReminder: {
    hour: 20, // 8 PM
    minute: 0,
    title: "¡No dejes que tu racha muera!",
    body: "Marca tus tareas antes de las 8 PM",
  },
  biweeklyProgress: {
    title: "Estado de tu Bono",
    // Body se genera dinámicamente con el porcentaje
  },
} as const;

export const QUERY_KEYS = {
  auth: {
    session: ["auth", "session"],
    profile: ["auth", "profile"],
  },
  clan: {
    current: ["clan", "current"],
    members: (clanId: string) => ["clan", clanId, "members"],
    joinRequests: (clanId: string) => ["clan", clanId, "joinRequests"],
  },
  tasks: {
    all: (clanId: string) => ["tasks", clanId],
    logs: (userId: string) => ["tasks", "logs", userId],
  },
  wallet: {
    balance: (userId: string) => ["wallet", userId, "balance"],
    transactions: (userId: string) => ["wallet", userId, "transactions"],
  },
  payouts: {
    user: (userId: string) => ["payouts", userId],
  },
} as const;
