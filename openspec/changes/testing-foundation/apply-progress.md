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

## Remaining Tasks

- None — all tasks in this change are complete.

## Workload / PR Boundary

- Mode: **stacked PR slice**
- Boundary start: WU3 baseline (verification tests completed)
- Boundary end: WU4 CI quality workflow + coverage threshold output + Node/docs policy published
- Estimated review budget impact: moderate; scoped to CI + docs + minimal compatibility fixes

## Status

15/15 tasks complete for `testing-foundation`. Ready for `sdd-verify`.
