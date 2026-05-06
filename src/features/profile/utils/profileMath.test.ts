import { describe, expect, it } from "vitest";
import { getLevel, getLevelProgress, getRankTitle, getThemeMarker, getXpForNextLevel } from "./profileMath";

describe("profileMath", () => {
  it("calcula nivel base para XP no positivo", () => {
    expect(getLevel(0)).toBe(1);
    expect(getLevel(-100)).toBe(1);
  });

  it("calcula progreso del nivel en rango [0, 0.99]", () => {
    const progress = getLevelProgress(250);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(0.99);
  });

  it("resuelve fallback de rango y marcador para temas desconocidos", () => {
    expect(getRankTitle("tema-inexistente", 1)).toBe("Novato");
    expect(getThemeMarker("tema-inexistente")).toBe("✨");
  });

  it("calcula XP restante al siguiente nivel", () => {
    expect(getXpForNextLevel(0)).toBe(200);
    expect(getXpForNextLevel(200)).toBe(400);
  });
});
