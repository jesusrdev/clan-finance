# Proposal: Testing Foundation

## Intent

Establish a reliable testing baseline and CI quality gates for clan-finance, which currently has no test runner, no coverage, and no automated quality enforcement.

## Scope

### In Scope
- Add Vitest + React Native Testing Library foundation with TypeScript-compatible setup.
- Add shared test harness utilities for provider composition, QueryClient isolation, and Supabase mocking.
- Add CI workflow with baseline gates for typecheck, tests, and phased coverage threshold.

### Out of Scope
- E2E/device test infrastructure (Detox/Maestro).
- Broad feature-by-feature test backfill across all modules.

## Capabilities

### New Capabilities
- `test-foundation`: Standardized unit/integration test runtime, setup, and reusable harness utilities.
- `ci-quality-gates`: CI-enforced typecheck, test execution, and minimum coverage policy.

### Modified Capabilities
- None

## Approach

Adopt Vitest as default runner with RN Testing Library, then codify deterministic test utilities for async/stateful flows (React Query retries/timers and Supabase platform/env behavior). Introduce CI gates in phases so teams gain fast feedback without blocking delivery on unrealistic initial coverage.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add test/coverage/typecheck/CI scripts and dependencies. |
| `tsconfig.json` (or test config) | Modified | Enable test types/globals and isolated test compilation. |
| `src/test/**` (new) | New | Shared harness, provider wrappers, and common mocks. |
| `src/lib/query/client.ts` | Modified | Test-safe QueryClient defaults/utilities. |
| `src/lib/supabase/client.ts` | Modified | Deterministic mocking seams for env/storage behavior. |
| `.github/workflows/` | New | CI workflow for quality gates. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| RN/Expo module mock gaps delay setup | Med | Start with minimal supported mocks and document extension points. |
| Async flakiness from retries/timers | Med | Force test QueryClient defaults (`retry: false`, controlled timers). |
| Coverage gate blocks early adoption | Med | Use phased threshold with planned ratcheting. |

## Rollback Plan

Revert testing/CI config commits and disable the new workflow file to restore pre-change behavior; keep app runtime code untouched where possible so rollback is low-risk and isolated.

## Dependencies

- Compatible Node version pinning for local + CI parity.
- GitHub Actions availability for workflow execution.

## Success Criteria

- [ ] `npm` scripts exist for typecheck, test, and coverage and run in CI.
- [ ] CI fails on type errors or failing tests on pull requests.
- [ ] Coverage reporting is produced with an initial enforced threshold.
- [ ] At least one representative unit and one integration-style test pass using shared harness utilities.
