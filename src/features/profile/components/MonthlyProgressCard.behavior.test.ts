import { describe, expect, it } from "vitest";
import { isMonthlyProgressZeroState } from "@/features/profile/utils/profileProgress";

describe("MonthlyProgressCard behavior", () => {
  it("detecta zero-state cuando completed y porcentaje son cero", () => {
    expect(isMonthlyProgressZeroState(0, 0)).toBe(true);
  });

  it("no marca zero-state cuando hay progreso", () => {
    expect(isMonthlyProgressZeroState(1, 0)).toBe(false);
    expect(isMonthlyProgressZeroState(0, 10)).toBe(false);
  });
});
