# Tasks: Testing Foundation

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 520–760 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (runtime+harness) → PR 2 (app seams+tests) → PR 3 (CI gates+docs) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Establish Vitest runtime + shared test harness | PR 1 | Base: main; includes setup smoke test |
| 2 | Add query/supabase seams + deterministic tests | PR 2 | Base: PR 1 branch; validates isolation + env branches |
| 3 | Add CI quality workflow + coverage gate + docs | PR 3 | Base: PR 2 branch; enforces required checks |

## Phase 1: Infrastructure Foundation

- [x] 1.1 Update `package.json` scripts/dependencies for `typecheck`, `test`, `test:watch`, `coverage`, and Vitest/RNTL tooling.
- [x] 1.2 Update `tsconfig.json` to include Vitest typings and test/setup files for TS compatibility.
- [x] 1.3 Create `vitest.config.ts` with RN-compatible environment, test discovery, fail-on-no-tests, and baseline coverage thresholds.
- [x] 1.4 Create `vitest.setup.ts` with global setup/cleanup hooks and stable Expo/RN edge mocks.

## Phase 2: Shared Harness and App Seams

- [x] 2.1 Create `src/test/queryClient.ts` with `createTestQueryClient()` using isolated cache and `retry: false` defaults.
- [x] 2.2 Create `src/test/renderWithProviders.tsx` that composes required app providers from `src/app/_layout.tsx` conventions.
- [x] 2.3 Create `src/test/mocks/supabase.ts` reusable auth/session/database mock builders.
- [x] 2.4 Modify `src/lib/query/client.ts` to export factory/defaults usable by app and tests with separate instances.
- [x] 2.5 Modify `src/lib/supabase/client.ts` to expose `createSupabaseClient(...)` seam with guarded env resolution.

## Phase 3: Verification Tests

- [x] 3.1 Create `src/lib/query/client.test.ts` covering isolated client instances and deterministic async defaults.
- [x] 3.2 Create `src/lib/supabase/client.test.ts` covering web/native/server storage-env branch behavior.
- [x] 3.3 Add harness-focused tests that prove provider auto-composition and no query-state leakage across sequential tests.

## Phase 4: CI Quality Gates and Documentation

- [x] 4.1 Create `.github/workflows/ci-quality.yml` running `npm run typecheck`, `npm run test`, and `npm run coverage` as required PR gates.
- [x] 4.2 Configure CI coverage output to show measured vs required threshold values on failure.
- [x] 4.3 Document initial threshold and ratchet plan in project docs/change notes, including chosen Node-version source of truth.
