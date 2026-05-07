import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Task } from "@/types/models";
import { QuestService } from "@/features/quests/services/QuestService";
import { isQuestDomainError, type QuestDomainErrorCode } from "@/features/quests/services/questErrors";

export function useCompleteTask() {
  const { user } = useAuth();
  const [lastErrorCode, setLastErrorCode] = useState<QuestDomainErrorCode | null>(null);

  const mutation = useMutation({
    mutationFn: async (task: Pick<Task, "id" | "frequency">) => {
      if (!user?.id) {
        throw new Error("No hay usuario autenticado");
      }

      return QuestService.completeTask({
        userId: user.id,
        taskId: task.id,
        frequency: task.frequency,
      });
    },
    onMutate: () => {
      setLastErrorCode(null);
    },
    onError: (error) => {
      if (isQuestDomainError(error)) {
        setLastErrorCode(error.code);
        return;
      }

      setLastErrorCode(null);
    },
  });

  return {
    completeTask: mutation.mutateAsync,
    isCompleting: mutation.isPending,
    lastErrorCode,
  };
}
