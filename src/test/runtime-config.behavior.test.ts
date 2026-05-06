import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const VITEST_BIN = require.resolve("vitest/vitest.mjs");

describe("standard test runtime behavior", () => {
  it(
    "fails with actionable error for unsupported runtime configuration",
    () => {
      const root = mkdtempSync(join(tmpdir(), "vitest-bad-config-"));

      try {
        const configPath = join(root, "vitest.invalid.config.ts");
        const testPath = join(root, "sample.test.ts");

        writeFileSync(
          configPath,
          `import { defineConfig } from "vitest/config";\nexport default defineConfig({ plugins: [__UNKNOWN_PLUGIN__], test: { include: ["${testPath.replace(/\\/g, "\\\\")}"] } });\n`,
          "utf8",
        );
        writeFileSync(testPath, `import { it, expect } from "vitest"; it("ok", () => expect(1).toBe(1));`, "utf8");

        const result = spawnSync(
          process.execPath,
          [VITEST_BIN, "run", "--config", configPath, "--pool", "forks"],
          {
            cwd: root,
            encoding: "utf8",
            timeout: 15000,
            env: { ...process.env, CI: "1", FORCE_COLOR: "0" },
          },
        );

        expect(result.error).toBeUndefined();
        expect(result.signal).toBeNull();
        expect(result.status).not.toBe(0);
        expect(`${result.stderr}\n${result.stdout}`).toMatch(
          /UNKNOWN_PLUGIN|failed to load config|ReferenceError/i,
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
    15000,
  );
});
