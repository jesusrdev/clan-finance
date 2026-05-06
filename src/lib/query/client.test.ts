import { describe, expect, it } from "vitest";
import {
  createQueryClient,
  queryClientDefaultOptions,
} from "./client";
import { createTestQueryClient } from "../../test/queryClient";

describe("query client", () => {
  it("creates isolated instances with independent cache state", () => {
    const clientA = createTestQueryClient();
    const clientB = createTestQueryClient();

    clientA.setQueryData(["shared-key"], { value: "only-a" });

    expect(clientA.getQueryData(["shared-key"])).toEqual({ value: "only-a" });
    expect(clientB.getQueryData(["shared-key"])).toBeUndefined();
  });

  it("applies deterministic async defaults for tests", () => {
    const testClient = createTestQueryClient();
    const defaults = testClient.getDefaultOptions();

    expect(defaults.queries?.retry).toBe(false);
    expect(defaults.queries?.gcTime).toBe(0);
    expect(defaults.mutations?.retry).toBe(false);
  });

  it("keeps app defaults in runtime client factory", () => {
    const appClient = createQueryClient();
    const defaults = appClient.getDefaultOptions();

    expect(defaults).toEqual(queryClientDefaultOptions);
    expect(defaults.queries?.retry).toBe(2);
    expect(defaults.mutations?.retry).toBe(1);
  });
});
