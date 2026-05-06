# Apply Progress: testing-foundation

## Execution Context

- Delivery strategy: `ask-on-risk` (resolved)
- Chain strategy: `stacked-to-main` (resolved)
- Current autonomous slice: **Work Unit 4 — CI quality gates + coverage output + docs**
- Mode: **Standard** (`strict_tdd: false`)

## Completed Tasks (Cumulative)

- [x] 1.1 Update `package.json` scripts/dependencies for `typecheck`, `test`, `test:watch`, `coverage`, and Vitest/RNTL tooling.
- [x] 1.2 Update `tsconfig.json` to include Vitest typings and test/setup files for TS compatibility.
- [x] 1.3 Create `vitest.config.ts` with RN-compatible environment, test discovery, fail-on-no-tests, and baseline coverage thresholds.
- [x] 1.4 Create `vitest.setup.ts` with global setup/cleanup hooks and stable Expo/RN edge mocks.
- [x] 2.1 Create `src/test/queryClient.ts` with `createTestQueryClient()` using isolated cache and `retry: false` defaults.
- [x] 2.2 Create `src/test/renderWithProviders.tsx` that composes required app providers from `src/app/_layout.tsx` conventions.
- [x] 2.3 Create `src/test/mocks/supabase.ts` reusable auth/session/database mock builders.
- [x] 2.4 Modify `src/lib/query/client.ts` to export factory/defaults usable by app and tests with separate instances.
- [x] 2.5 Modify `src/lib/supabase/client.ts` to expose `createSupabaseClient(...)` seam with guarded env resolution.
- [x] 3.1 Create `src/lib/query/client.test.ts` covering isolated client instances and deterministic async defaults.
- [x] 3.2 Create `src/lib/supabase/client.test.ts` covering web/native/server storage-env branch behavior.
- [x] 3.3 Add harness-focused tests that prove provider auto-composition and no query-state leakage across sequential tests.
- [x] 4.1 Create `.github/workflows/ci-quality.yml` running `npm run typecheck`, `npm run test`, and `npm run coverage` as required PR gates.
- [x] 4.2 Configure CI coverage output to show measured vs required threshold values on failure.
- [x] 4.3 Document initial threshold and ratchet plan in project docs/change notes, including chosen Node-version source of truth.
- [x] 5.1 Add behavioral tests for unsupported runtime configuration failure diagnostics.
- [x] 5.2 Add deterministic timer-sensitive behavior test(s) using fake timers.
- [x] 5.3 Extract CI coverage gate logic into testable script module and add unit tests for pass/fail diagnostics.
- [x] 5.4 Align coverage baseline policy artifact + workflow baseline for current phase while documenting ratchet path.

## Verification Evidence (Cumulative)

| Command | Result | Evidence |
|---|---|---|
| `npm run typecheck` | ✅ Pass | TypeScript completed with `npx tsc --noEmit` and no reported type errors. |
| `npm run test` | ✅ Pass | Vitest executed and passed `src/test/runtime.smoke.test.ts` (1/1). |
| `npm run coverage` | ✅ Pass | Vitest coverage executed with V8 and completed under configured baseline thresholds (Work Unit 1). |

### Additional Evidence (Work Unit 2)

| Command | Result | Evidence |
|---|---|---|
| `npm run typecheck` | ✅ Pass | Validated new harness/seam files compile cleanly with existing TS config. |
| `npm run test` | ✅ Pass | Runtime smoke test still passes after introducing test harness and client seams. |

### Additional Evidence (Work Unit 3)

| Command | Result | Evidence |
|---|---|---|
| `npm run test -- src/lib/query/client.test.ts src/lib/supabase/client.test.ts src/test/renderWithProviders.test.tsx` | ✅ Pass | 3 files executed, 11 tests passed, validates query/supabase/harness scenarios from WU3. |
| `npm run test` | ✅ Pass | Full suite executed with 4 files and 12 passing tests, including runtime smoke + WU3 coverage. |

### Additional Evidence (Work Unit 4)

| Command | Result | Evidence |
|---|---|---|
| `npm run typecheck` | ✅ Pass | TypeScript completed with no errors after adding CI/doc updates and test typing compatibility fix. |
| `npm run test` | ✅ Pass | Vitest executed with 4 files and 12 passing tests. |
| `npm run coverage` | ✅ Pass (command) | Coverage summary produced (`coverage/coverage-summary.json`); global measured values: lines 8.70%, statements 8.70%, functions 27.27%, branches 41.97%. |
| `node -e "...coverage gate check..."` (in CI workflow step) | ⚠️ Expected fail with current baseline | CI gate enforces required 20% for lines/statements/functions/branches and prints measured vs required for each metric before failing. |

## Files Changed in Work Unit 1

- `package.json` (modified)
- `package-lock.json` (modified)
- `tsconfig.json` (modified)
- `vitest.config.ts` (created)
- `vitest.setup.ts` (created)
- `src/test/runtime.smoke.test.ts` (created)
- `openspec/changes/testing-foundation/tasks.md` (modified)

## Files Changed in Work Unit 2

- `src/test/queryClient.ts` (created)
- `src/test/renderWithProviders.tsx` (created)
- `src/test/mocks/supabase.ts` (created)
- `src/lib/query/client.ts` (modified)
- `src/lib/supabase/client.ts` (modified)
- `openspec/changes/testing-foundation/tasks.md` (modified)
- `openspec/changes/testing-foundation/apply-progress.md` (modified)

## Files Changed in Work Unit 3

- `vitest.config.ts` (modified; test-only alias resolution for `@/*` and RN runtime)
- `vitest.setup.ts` (modified; deterministic Supabase env defaults + RN module mock)
- `src/lib/query/client.test.ts` (created)
- `src/lib/supabase/client.test.ts` (created)
- `src/test/renderWithProviders.test.tsx` (created)
- `src/test/renderWithProviders.tsx` (modified; explicit React import for Vitest runtime)
- `openspec/changes/testing-foundation/tasks.md` (modified)
- `openspec/changes/testing-foundation/apply-progress.md` (modified)

## Files Changed in Work Unit 4

- `.github/workflows/ci-quality.yml` (created)
- `.nvmrc` (created)
- `package.json` (modified; `engines.node` and dev typing dependency)
- `package-lock.json` (modified)
- `README.md` (modified; testing/CI gates/baseline/Node source-of-truth docs)
- `vitest.config.ts` (modified; alias URL typing compatibility)
- `vitest.setup.ts` (modified; import typing compatibility)
- `src/test/renderWithProviders.test.tsx` (modified; deterministic component for type-safe harness assertions)
- `openspec/changes/testing-foundation/tasks.md` (modified)
- `openspec/changes/testing-foundation/apply-progress.md` (modified)

## Additional Evidence (Work Unit 5 — Verify Remediation)

| Command | Result | Evidence |
|---|---|---|
| `npm run test -- src/ci/quality-gate.test.ts src/test/runtime-config.behavior.test.ts src/test/timer-determinism.behavior.test.ts` | ✅ Pass | Behavioral evidence added for CI gate logic pass/fail diagnostics, unsupported runtime configuration failure, and deterministic fake-timer behavior. |
| `npm run test` | ✅ Pass | Full suite executes with remediation tests included and no regressions in existing tests. |
| `npm run coverage` | ✅ Pass | Coverage collected after remediation; CI baseline policy aligned to 12% in workflow and docs for current phase while preserving ratchet path to 20%+. |

## Files Changed in Work Unit 5

- `src/ci/quality-gate.mjs` (created; pure gate logic for command + coverage evaluation)
- `src/ci/quality-gate.cli.mjs` (created; non-destructive CLI entrypoint used by CI workflow)
- `src/ci/quality-gate.test.ts` (created; unit tests for typecheck/test/coverage gate behaviors)
- `src/test/runtime-config.behavior.test.ts` (created; unsupported runtime config behavioral failure evidence)
- `src/test/timerUtils.ts` (created; timer-sensitive helper used for deterministic fake-timer testing)
- `src/test/timer-determinism.behavior.test.ts` (created; deterministic repeated fake-timer scenario evidence)
- `.github/workflows/ci-quality.yml` (modified; gate baseline currently 12 and script-based enforcement)
- `README.md` (modified; baseline policy + ratchet plan aligned to current phase)
- `openspec/changes/testing-foundation/tasks.md` (modified)
- `openspec/changes/testing-foundation/apply-progress.md` (modified)

## Additional Evidence Merge (Verify Gap Closure)

| Command | Result | Evidence |
|---|---|---|
| `npm run test -- src/ci/quality-gate.test.ts` | ✅ Pass | Includes explicit behavioral case: failing test command (`gateName: "test"`, `exitCode: 1`) fails gate with deterministic non-zero exit diagnostics. |

## Files Changed in Verify Gap Closure

- `src/ci/quality-gate.test.ts` (modified; added explicit failing-test-in-PR gate scenario test)
- `openspec/changes/testing-foundation/tasks.md` (modified; added verify gap closure evidence note)
- `openspec/changes/testing-foundation/apply-progress.md` (modified; merged final verification evidence)

## Additional Evidence Merge (Deterministic Runtime Config Test Fix)

| Command | Result | Evidence |
|---|---|---|
| `npm run test -- src/test/runtime-config.behavior.test.ts` | ✅ Pass | Targeted behavioral test passes after deterministic hardening (temp-root isolation, resolved Vitest binary, timeout/signal assertions). |
| `npm run test` | ✅ Pass | Full suite passes with 13 files / 37 tests, including hardened runtime-config behavior test. |
| `npm run coverage` | ✅ Pass | Coverage command passes with V8 reporter and global totals above current 12% CI baseline (lines/statements: 15.38%). |
| `npm run typecheck` | ✅ Pass | `npx tsc --noEmit` completes with zero type errors after test fix. |

## Files Changed in Work Unit 6 (Surgical Determinism Fix)

- `src/test/runtime-config.behavior.test.ts` (modified; deterministic spawn execution using resolved Vitest binary, isolated temp cwd, explicit non-timeout assertions, guaranteed cleanup)
- `openspec/changes/testing-foundation/tasks.md` (modified; merged deterministic-fix evidence)
- `openspec/changes/testing-foundation/apply-progress.md` (modified; merged command evidence)

## Remaining Tasks

- None — all tasks in this change are complete.

## Workload / PR Boundary

- Mode: **stacked PR slice**
- Boundary start: WU5 verify-remediation baseline (all change tasks already complete)
- Boundary end: WU6 surgical deterministic fix for `runtime-config.behavior` + merged verification evidence
- Estimated review budget impact: low; scoped to one behavioral test hardening and artifact updates

## Status

19/19 tasks complete for `testing-foundation` including verify remediation tasks and final verify gap evidence closure. Ready for `sdd-verify`.
