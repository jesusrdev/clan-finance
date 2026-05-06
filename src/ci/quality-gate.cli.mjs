import fs from "node:fs";
import { runCoverageGateCli } from "./quality-gate.mjs";

const filePath = process.argv[2] ?? "coverage/coverage-summary.json";
const requiredMinimum = process.argv[3] ?? process.env.COVERAGE_MINIMUM ?? "12";

const code = runCoverageGateCli({
  filePath,
  requiredMinimum,
  fsModule: fs,
  consoleModule: console,
});

process.exit(code);
