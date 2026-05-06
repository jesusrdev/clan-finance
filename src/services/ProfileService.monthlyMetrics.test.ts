import { beforeEach, describe, expect, it, vi } from "vitest";

const queryState = vi.hoisted(() => ({
  rows: [] as Array<{ status: string }>,
  error: null as Error | null,
  updateResult: { id: "profile-1", display_name: "Nuevo Nombre" },
  updateError: null as Error | null,
  calls: [] as Array<{ method: string; args: unknown[] }>,
}));

vi.mock("@/lib/supabase/client", () => {
  const buildTaskLogsQuery = () => {
    const query = {
      select: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "select", args });
        return query;
      }),
      eq: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "eq", args });
        return query;
      }),
      gte: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "gte", args });
        return query;
      }),
      lt: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "lt", args });
        return query;
      }),
      in: vi.fn(async (...args: unknown[]) => {
        queryState.calls.push({ method: "in", args });
        return { data: queryState.rows, error: queryState.error };
      }),
    };
    return query;
  };

  const buildProfilesQuery = () => {
    const query = {
      update: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "update", args });
        return query;
      }),
      eq: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "eq", args });
        return query;
      }),
      select: vi.fn((...args: unknown[]) => {
        queryState.calls.push({ method: "select", args });
        return query;
      }),
      single: vi.fn(async () => ({
        data: queryState.updateResult,
        error: queryState.updateError,
      })),
    };
    return query;
  };

  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === "task_logs") return buildTaskLogsQuery();
        if (table === "profiles") return buildProfilesQuery();
        throw new Error(`Tabla no mockeada: ${table}`);
      }),
    },
  };
});

import { ProfileService } from "./ProfileService";

describe("ProfileService monthly metrics", () => {
  beforeEach(() => {
    queryState.rows = [];
    queryState.error = null;
    queryState.updateError = null;
    queryState.calls = [];
  });

  it("computa métricas con filtros de estado definidos", async () => {
    queryState.rows = [
      { status: "approved" },
      { status: "approved" },
      { status: "rejected" },
      { status: "pending" },
    ];

    const metrics = await ProfileService.getMonthlyMetrics("user-1", new Date("2026-05-15T12:00:00.000Z"));

    expect(metrics.completedThisMonth).toBe(2);
    expect(metrics.denominatorCount).toBe(3);
    expect(metrics.completionPercentage).toBe(67);

    expect(queryState.calls).toEqual(
      expect.arrayContaining([
        { method: "eq", args: ["user_id", "user-1"] },
        { method: "gte", args: ["completed_at", metrics.monthStartIso] },
        { method: "lt", args: ["completed_at", metrics.nextMonthStartIso] },
        { method: "in", args: ["status", ["approved", "rejected", "pending"]] },
      ]),
    );
  });

  it("devuelve 0% cuando denominador es cero", async () => {
    queryState.rows = [{ status: "pending" }, { status: "pending" }];

    const metrics = await ProfileService.getMonthlyMetrics("user-1", new Date("2026-05-15T12:00:00.000Z"));

    expect(metrics.completedThisMonth).toBe(0);
    expect(metrics.denominatorCount).toBe(0);
    expect(metrics.completionPercentage).toBe(0);
  });

  it("redondea a entero en caso no cero (3/4 => 75%)", async () => {
    queryState.rows = [
      { status: "approved" },
      { status: "approved" },
      { status: "approved" },
      { status: "rejected" },
    ];

    const metrics = await ProfileService.getMonthlyMetrics("user-1", new Date("2026-05-15T12:00:00.000Z"));

    expect(metrics.completedThisMonth).toBe(3);
    expect(metrics.denominatorCount).toBe(4);
    expect(metrics.completionPercentage).toBe(75);
  });
});
