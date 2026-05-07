import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/constants";
import type { TaskLogInsert } from "@/types/models";
import { buildFrequencyWindowUtc, type QuestFrequency } from "./questFrequencyWindow";
import { QuestDomainError } from "./questErrors";

export type CompleteTaskInput = {
  userId: string;
  taskId: string;
  frequency: QuestFrequency;
  now?: Date;
};

export type CompleteTaskResult = {
  taskLogId: string;
  completedAtIso: string;
};

type TaskLogsGateway = {
  findExistingInWindow: (args: {
    userId: string;
    taskId: string;
    startIso: string;
    endIso: string;
  }) => Promise<boolean>;
  insertPending: (row: TaskLogInsert) => Promise<{ id: string; completed_at: string }>;
};

const supabaseTaskLogsGateway: TaskLogsGateway = {
  async findExistingInWindow({ userId, taskId, startIso, endIso }) {
    const { data, error } = await supabase
      .from(TABLES.TASK_LOGS)
      .select("id")
      .eq("user_id", userId)
      .eq("task_id", taskId)
      .gte("completed_at", startIso)
      .lt("completed_at", endIso)
      .limit(1);

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  },

  async insertPending(row) {
    const { data, error } = await supabase
      .from(TABLES.TASK_LOGS)
      .insert(row)
      .select("id, completed_at")
      .single();

    if (error) throw error;
    return data;
  },
};

function createQuestService(taskLogsGateway: TaskLogsGateway) {
  return {
    async completeTask(input: CompleteTaskInput): Promise<CompleteTaskResult> {
      const now = input.now ?? new Date();
      const nowIso = now.toISOString();
      const window = buildFrequencyWindowUtc(input.frequency, now);

      if (window) {
        const alreadyCompleted = await taskLogsGateway.findExistingInWindow({
          userId: input.userId,
          taskId: input.taskId,
          startIso: window.startIso,
          endIso: window.endIso,
        });

        if (alreadyCompleted) {
          throw new QuestDomainError(
            "TASK_ALREADY_COMPLETED_IN_WINDOW",
            "Task already completed in active frequency window",
          );
        }
      }

      const inserted = await taskLogsGateway.insertPending({
        user_id: input.userId,
        task_id: input.taskId,
        status: "pending",
        completed_at: nowIso,
      });

      return {
        taskLogId: inserted.id,
        completedAtIso: inserted.completed_at,
      };
    },
  };
}

export const QuestService = createQuestService(supabaseTaskLogsGateway);
export const QuestServiceTestSeams = { createQuestService };
