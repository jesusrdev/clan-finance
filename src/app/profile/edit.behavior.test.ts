import { describe, expect, it } from "vitest";
import {
  isDisplayNameValid,
  normalizeDisplayNameInput,
} from "@/features/profile/utils/profileIdentity";

describe("ProfileEdit behavior", () => {
  it("rechaza display_name vacío después de trim", () => {
    expect(isDisplayNameValid("   ")).toBe(false);
    expect(isDisplayNameValid("\n\t ")).toBe(false);
  });

  it("acepta display_name válido y preserva valor normalizado", () => {
    expect(isDisplayNameValid("  Nuevo Nombre  ")).toBe(true);
    expect(normalizeDisplayNameInput("  Nuevo Nombre  ")).toBe("Nuevo Nombre");
  });
});
