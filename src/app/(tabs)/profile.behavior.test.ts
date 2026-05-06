import { describe, expect, it } from "vitest";
import { getMonthlyProgressViewModel } from "@/features/profile/utils/profileProgress";

describe("ProfileTab behavior", () => {
  it("expone progreso mensual cuando hay métricas", () => {
    const model = getMonthlyProgressViewModel({
      completedThisMonth: 2,
      completionPercentage: 50,
    });

    expect(model).toEqual({ completedThisMonth: 2, completionPercentage: 50 });
  });

  it("mantiene visibilidad del bloque en zero-state si métricas existen", () => {
    const model = getMonthlyProgressViewModel({
      completedThisMonth: 0,
      completionPercentage: 0,
    });

    expect(model).not.toBeNull();
    expect(model).toEqual({ completedThisMonth: 0, completionPercentage: 0 });
  });
});
