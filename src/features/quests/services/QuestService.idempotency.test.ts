import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => {
      throw new Error("Supabase should not be used in this unit test");
    }),
  },
}));

import { QuestServiceTestSeams } from "./QuestService";

describe("QuestService.completeTask idempotency", () => {
  it("devuelve error de dominio en conflicto dentro de la ventana", async () => {
    const service = QuestServiceTestSeams.createQuestService({
      findExistingInWindow: vi.fn(async () => true),
      insertPending: vi.fn(async () => ({ id: "log-1", completed_at: "2026-05-06T10:00:00.000Z" })),
    });

    await expect(
      service.completeTask({
        userId: "user-1",
        taskId: "task-1",
        frequency: "daily",
        now: new Date("2026-05-06T10:00:00.000Z"),
      }),
    ).rejects.toMatchObject({
      code: "TASK_ALREADY_COMPLETED_IN_WINDOW",
    });
  });

  it("permite completar fuera de ventana e inserta pending", async () => {
    const findExistingInWindow = vi.fn(async () => false);
    const insertPending = vi.fn(async () => ({ id: "log-2", completed_at: "2026-05-07T00:00:00.000Z" }));

    const service = QuestServiceTestSeams.createQuestService({
      findExistingInWindow,
      insertPending,
    });

    const result = await service.completeTask({
      userId: "user-1",
      taskId: "task-1",
      frequency: "daily",
      now: new Date("2026-05-07T00:00:00.000Z"),
    });

    expect(findExistingInWindow).toHaveBeenCalledTimes(1);
    expect(insertPending).toHaveBeenCalledWith({
      user_id: "user-1",
      task_id: "task-1",
      status: "pending",
      completed_at: "2026-05-07T00:00:00.000Z",
    });
    expect(result).toEqual({
      taskLogId: "log-2",
      completedAtIso: "2026-05-07T00:00:00.000Z",
    });
  });

  it("rechaza conflicto weekly dentro de la misma semana ISO UTC", async () => {
    const findExistingInWindow = vi.fn(async () => true);

    const service = QuestServiceTestSeams.createQuestService({
      findExistingInWindow,
      insertPending: vi.fn(async () => ({ id: "log-3", completed_at: "2026-05-07T10:00:00.000Z" })),
    });

    await expect(
      service.completeTask({
        userId: "user-1",
        taskId: "task-1",
        frequency: "weekly",
        now: new Date("2026-05-07T10:00:00.000Z"),
      }),
    ).rejects.toMatchObject({
      code: "TASK_ALREADY_COMPLETED_IN_WINDOW",
    });

    expect(findExistingInWindow).toHaveBeenCalledWith({
      userId: "user-1",
      taskId: "task-1",
      startIso: "2026-05-04T00:00:00.000Z",
      endIso: "2026-05-11T00:00:00.000Z",
    });
  });

  it("rechaza conflicto monthly dentro del mismo mes UTC", async () => {
    const findExistingInWindow = vi.fn(async () => true);

    const service = QuestServiceTestSeams.createQuestService({
      findExistingInWindow,
      insertPending: vi.fn(async () => ({ id: "log-4", completed_at: "2026-05-20T10:00:00.000Z" })),
    });

    await expect(
      service.completeTask({
        userId: "user-1",
        taskId: "task-1",
        frequency: "monthly",
        now: new Date("2026-05-20T10:00:00.000Z"),
      }),
    ).rejects.toMatchObject({
      code: "TASK_ALREADY_COMPLETED_IN_WINDOW",
    });

    expect(findExistingInWindow).toHaveBeenCalledWith({
      userId: "user-1",
      taskId: "task-1",
      startIso: "2026-05-01T00:00:00.000Z",
      endIso: "2026-06-01T00:00:00.000Z",
    });
  });
});
