export function evaluateCommandGate({
  gateName,
  exitCode,
  stdout = "",
  stderr = "",
}) {
  if (exitCode === 0) {
    return { passed: true, reason: `${gateName} passed` };
  }

  const output = `${stdout}\n${stderr}`;
  if (/No test files found|No test files/i.test(output)) {
    return {
      passed: false,
      reason:
        "Test runtime reported no tests discovered. Check test include globs and runtime plugin/configuration.",
    };
  }

  return {
    passed: false,
    reason: `${gateName} failed with exit code ${exitCode}`,
  };
}

export function evaluateCoverageGate(summary, requiredMinimum) {
  const required = Number(requiredMinimum || 0);
  const keys = ["lines", "statements", "functions", "branches"];
  const rows = keys.map((metric) => ({
    metric,
    measured: Number(summary?.[metric]?.pct ?? 0),
    required,
  }));

  const failed = rows.filter((row) => row.measured < row.required);

  return {
    rows,
    passed: failed.length === 0,
    failed,
  };
}

export function formatCoverageRows(rows) {
  return [
    "Coverage baseline check (measured vs required):",
    ...rows.map(
      (row) =>
        `- ${row.metric}: measured=${row.measured.toFixed(2)}%, required=${row.required.toFixed(2)}%`,
    ),
  ];
}

export function readCoverageSummaryFromFile(filePath, fsModule) {
  const fs = fsModule;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Coverage summary not found at ${filePath}`);
  }

  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return payload.total;
}

export function runCoverageGateCli({
  filePath,
  requiredMinimum,
  fsModule,
  consoleModule,
}) {
  const summary = readCoverageSummaryFromFile(filePath, fsModule);
  const result = evaluateCoverageGate(summary, requiredMinimum);
  const lines = formatCoverageRows(result.rows);

  lines.forEach((line) => consoleModule.log(line));

  if (!result.passed) {
    consoleModule.error(
      "Coverage gate failed: one or more metrics are below required baseline.",
    );
    return 1;
  }

  return 0;
}
