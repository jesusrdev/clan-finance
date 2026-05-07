import type { TaskFrequency } from "@/types/models";

export type QuestFrequency = TaskFrequency;

export type UtcWindow = {
  startIso: string;
  endIso: string;
};

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function startOfIsoWeekUtc(date: Date): Date {
  const day = date.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + diffToMonday));
}

function startOfUtcMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function buildFrequencyWindowUtc(
  frequency: QuestFrequency,
  now: Date = new Date(),
): UtcWindow | null {
  switch (frequency) {
    case "daily": {
      const start = startOfUtcDay(now);
      const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 1));
      return { startIso: start.toISOString(), endIso: end.toISOString() };
    }
    case "weekly": {
      const start = startOfIsoWeekUtc(now);
      const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 7));
      return { startIso: start.toISOString(), endIso: end.toISOString() };
    }
    case "monthly": {
      const start = startOfUtcMonth(now);
      const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
      return { startIso: start.toISOString(), endIso: end.toISOString() };
    }
    case "once":
      return null;
    default:
      return null;
  }
}
