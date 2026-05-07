import { describe, expect, it } from "vitest";
import { buildFrequencyWindowUtc } from "./questFrequencyWindow";

describe("buildFrequencyWindowUtc", () => {
  it("daily: acepta próximo día UTC después de 00:00", () => {
    const currentDay = buildFrequencyWindowUtc("daily", new Date("2026-05-06T23:59:59.000Z"));
    const nextDay = buildFrequencyWindowUtc("daily", new Date("2026-05-07T00:00:00.000Z"));

    expect(currentDay).toEqual({
      startIso: "2026-05-06T00:00:00.000Z",
      endIso: "2026-05-07T00:00:00.000Z",
    });
    expect(nextDay).toEqual({
      startIso: "2026-05-07T00:00:00.000Z",
      endIso: "2026-05-08T00:00:00.000Z",
    });
  });

  it("weekly: usa semana ISO con inicio lunes UTC", () => {
    const sunday = buildFrequencyWindowUtc("weekly", new Date("2026-05-10T23:59:59.000Z"));
    const monday = buildFrequencyWindowUtc("weekly", new Date("2026-05-11T00:00:00.000Z"));

    expect(sunday).toEqual({
      startIso: "2026-05-04T00:00:00.000Z",
      endIso: "2026-05-11T00:00:00.000Z",
    });
    expect(monday).toEqual({
      startIso: "2026-05-11T00:00:00.000Z",
      endIso: "2026-05-18T00:00:00.000Z",
    });
  });

  it("monthly: cambia en día 1 UTC", () => {
    const endOfMonth = buildFrequencyWindowUtc("monthly", new Date("2026-05-31T23:59:59.000Z"));
    const nextMonth = buildFrequencyWindowUtc("monthly", new Date("2026-06-01T00:00:00.000Z"));

    expect(endOfMonth).toEqual({
      startIso: "2026-05-01T00:00:00.000Z",
      endIso: "2026-06-01T00:00:00.000Z",
    });
    expect(nextMonth).toEqual({
      startIso: "2026-06-01T00:00:00.000Z",
      endIso: "2026-07-01T00:00:00.000Z",
    });
  });

  it("once: no define ventana", () => {
    expect(buildFrequencyWindowUtc("once", new Date("2026-05-06T08:00:00.000Z"))).toBeNull();
  });
});
