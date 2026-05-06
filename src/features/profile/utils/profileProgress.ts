export interface MonthlyProgressViewModel {
  completedThisMonth: number;
  completionPercentage: number;
}

export function getMonthlyProgressViewModel(
  monthlyMetrics:
    | {
        completedThisMonth: number;
        completionPercentage: number;
      }
    | null
    | undefined,
): MonthlyProgressViewModel | null {
  if (!monthlyMetrics) return null;
  return {
    completedThisMonth: monthlyMetrics.completedThisMonth,
    completionPercentage: monthlyMetrics.completionPercentage,
  };
}

export function isMonthlyProgressZeroState(
  completedThisMonth: number,
  completionPercentage: number,
): boolean {
  return completedThisMonth === 0 && completionPercentage === 0;
}
