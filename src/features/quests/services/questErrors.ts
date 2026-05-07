export type QuestDomainErrorCode = "TASK_ALREADY_COMPLETED_IN_WINDOW";

export class QuestDomainError extends Error {
  constructor(
    public readonly code: QuestDomainErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "QuestDomainError";
  }
}

export function isQuestDomainError(error: unknown): error is QuestDomainError {
  return error instanceof QuestDomainError;
}
