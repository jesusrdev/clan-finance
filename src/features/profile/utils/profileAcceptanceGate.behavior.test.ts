import { describe, expect, it } from "vitest";
import { passesProfilePhase2AcceptanceGate } from "./profileAcceptanceGate";

describe("Profile acceptance gate behavior", () => {
  it("pasa cuando todos los criterios están en true", () => {
    expect(
      passesProfilePhase2AcceptanceGate({
        displayNamePersistence: true,
        monthlyMetricsShown: true,
        progressVisible: true,
        docsAligned: true,
      }),
    ).toBe(true);
  });

  it("falla si algún criterio requerido está en false", () => {
    expect(
      passesProfilePhase2AcceptanceGate({
        displayNamePersistence: true,
        monthlyMetricsShown: true,
        progressVisible: true,
        docsAligned: false,
      }),
    ).toBe(false);
  });
});
