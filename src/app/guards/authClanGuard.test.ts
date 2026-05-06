import { describe, expect, it } from "vitest";
import { resolveAuthClanRedirect, shouldHoldNavigation } from "./authClanGuard";

describe("resolveAuthClanRedirect", () => {
  const base = {
    loading: false,
    isReady: true,
    isResolvingClan: false,
    hasSession: false,
    hasClan: null as boolean | null,
    clanResolutionStatus: "idle" as const,
    segments: [] as string[],
  };

  it("redirecciona invitados fuera de tabs/onboarding", () => {
    expect(
      resolveAuthClanRedirect({ ...base, segments: ["(tabs)", "profile"] }),
    ).toBe("/");
    expect(resolveAuthClanRedirect({ ...base, segments: ["onboarding"] })).toBe(
      "/",
    );
  });

  it("envía a onboarding cuando usuario autenticado no tiene clan", () => {
    expect(
      resolveAuthClanRedirect({
        ...base,
        hasSession: true,
        hasClan: false,
        clanResolutionStatus: "resolved",
        segments: ["(tabs)", "index"],
      }),
    ).toBe("/onboarding");
  });

  it("envía a tabs cuando usuario autenticado sí tiene clan", () => {
    expect(
      resolveAuthClanRedirect({
        ...base,
        hasSession: true,
        hasClan: true,
        clanResolutionStatus: "resolved",
        segments: ["(auth)", "login"],
      }),
    ).toBe("/(tabs)");
  });

  it("no fuerza onboarding cuando falla la consulta de perfil", () => {
    expect(
      resolveAuthClanRedirect({
        ...base,
        hasSession: true,
        hasClan: null,
        clanResolutionStatus: "error",
        segments: ["onboarding"],
      }),
    ).toBe("/(tabs)");
  });
});

describe("shouldHoldNavigation", () => {
  it("mantiene loader mientras resuelve clan al restaurar sesión", () => {
    expect(
      shouldHoldNavigation({
        loading: false,
        isReady: true,
        hasSession: true,
        hasClan: null,
        clanResolutionStatus: "loading",
        isRootSegment: false,
        isWeb: true,
      }),
    ).toBe(true);
  });

  it("libera navegación si resolución de clan falla", () => {
    expect(
      shouldHoldNavigation({
        loading: false,
        isReady: true,
        hasSession: true,
        hasClan: null,
        clanResolutionStatus: "error",
        isRootSegment: false,
        isWeb: true,
      }),
    ).toBe(false);
  });
});
