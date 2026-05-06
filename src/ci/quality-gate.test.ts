import { describe, expect, it, vi } from "vitest";
import {
  evaluateCommandGate,
  evaluateCoverageGate,
  formatCoverageRows,
  readCoverageSummaryFromFile,
  runCoverageGateCli,
} from "./quality-gate.mjs";

describe("ci quality gate helpers", () => {
  it("fails typecheck gate when command exits non-zero", () => {
    const result = evaluateCommandGate({
      gateName: "typecheck",
      exitCode: 2,
      stderr: "error TS2322: Type 'string' is not assignable to type 'number'",
    });

    expect(result.passed).toBe(false);
    expect(result.reason).toContain("typecheck failed");
  });

  it("fails test gate with actionable message when no tests are discovered", () => {
    const result = evaluateCommandGate({
      gateName: "test",
      exitCode: 1,
      stdout: "No test files found, exiting with code 1",
    });

    expect(result.passed).toBe(false);
    expect(result.reason).toContain("no tests discovered");
  });

  it("fails test gate when underlying test command exits non-zero", () => {
    const result = evaluateCommandGate({
      gateName: "test",
      exitCode: 1,
      stdout: "⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯",
      stderr: "AssertionError: expected true to be false",
    });

    expect(result.passed).toBe(false);
    expect(result.reason).toBe("test failed with exit code 1");
  });

  it("evaluates coverage below-baseline as failing", () => {
    const result = evaluateCoverageGate(
      {
        lines: { pct: 13.72 },
        statements: { pct: 13.72 },
        functions: { pct: 35.71 },
        branches: { pct: 52.42 },
      },
      20,
    );

    expect(result.passed).toBe(false);
    expect(result.failed.map((row) => row.metric)).toEqual(["lines", "statements"]);
  });

  it("evaluates coverage at baseline as passing", () => {
    const result = evaluateCoverageGate(
      {
        lines: { pct: 12 },
        statements: { pct: 12 },
        functions: { pct: 20 },
        branches: { pct: 25 },
      },
      12,
    );

    expect(result.passed).toBe(true);
    expect(result.failed).toHaveLength(0);
  });

  it("prints measured-vs-required rows in deterministic format", () => {
    const lines = formatCoverageRows([
      { metric: "lines", measured: 13.7234, required: 12 },
    ]);

    expect(lines[0]).toContain("measured vs required");
    expect(lines[1]).toBe("- lines: measured=13.72%, required=12.00%");
  });

  it("returns exit code 1 when coverage summary file is missing", () => {
    const fakeConsole = { log: vi.fn(), error: vi.fn() };

    expect(() =>
      runCoverageGateCli({
        filePath: "missing.json",
        requiredMinimum: "12",
        fsModule: {
          existsSync: () => false,
          readFileSync: () => "",
        },
        consoleModule: fakeConsole,
      }),
    ).toThrow("Coverage summary not found");
  });

  it("reads total summary from coverage file payload", () => {
    const summary = readCoverageSummaryFromFile("coverage-summary.json", {
      existsSync: () => true,
      readFileSync: () =>
        JSON.stringify({ total: { lines: { pct: 14 }, statements: { pct: 14 } } }),
    });

    expect(summary.lines.pct).toBe(14);
  });
});
