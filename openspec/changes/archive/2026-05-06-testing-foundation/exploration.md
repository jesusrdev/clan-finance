## Exploration: testing-foundation

### Current State
The project is an Expo 54 + React Native 0.81 + TypeScript app with Supabase and React Query already in production code (`src/lib/supabase/client.ts`, `src/lib/query/client.ts`). There is currently no testing stack configured: `package.json` has no test scripts and no test dependencies, and `openspec/config.yaml` explicitly marks test runner, coverage, and linting as unavailable. CI quality gates are therefore absent.

### Affected Areas
- `package.json` — needs test/coverage/typecheck/CI scripts and test dependencies.
- `tsconfig.json` (or test tsconfig) — required for test globals/types and isolated test compilation.
- `src/app/_layout.tsx` — central provider composition (`QueryClientProvider`, auth routing) that should drive integration harness design.
- `src/lib/query/client.ts` — React Query defaults impact retry/timing behavior in tests.
- `src/lib/supabase/client.ts` — env + platform-dependent storage behavior requires deterministic mocking strategy.
- `src/features/**` and `src/services/**` — first adopters for unit/integration test patterns (hooks/services).
- `.github/workflows/` (new) — baseline CI workflow for typecheck + tests + coverage gate.
- `openspec/config.yaml` — should be updated in later phases to reflect available test tooling once foundation lands.

### Approaches
1. **Vitest + Testing Library (Expo-aligned) baseline** — Use Vitest for runner/assertions/mocks with React Native Testing Library and a shared test harness.
   - Pros: Fast startup, modern TS/ESM support, simple per-test mocking for Supabase/React Query, good fit for incremental adoption.
   - Cons: Expo-native edge APIs may need extra setup/mocks; some community examples still skew Jest-first.
   - Effort: Medium

2. **Jest + jest-expo baseline** — Use Jest ecosystem with Expo preset and React Native Testing Library.
   - Pros: Mature Expo docs/examples, broad community familiarity, stable native module mocking patterns.
   - Cons: Slower feedback loops, more config surface, higher maintenance friction for ESM-heavy dependencies.
   - Effort: Medium

### Recommendation
Adopt **Vitest + React Native Testing Library** as the default testing foundation, with explicit test harness utilities for QueryClient and Supabase mocking. This gives faster local/CI execution and cleaner TypeScript ergonomics while keeping scope focused on foundational quality gates. Reserve E2E/mobile device testing for a later change to avoid overloading this foundation scope.

### Risks
- Expo/native module compatibility gaps can stall initial setup if baseline mocks are incomplete.
- Flaky async tests from React Query retries/timers unless test-specific QueryClient defaults are isolated.
- Overly strict initial coverage gates can block delivery; phased thresholds are required.
- CI runtime drift (Node/Expo/toolchain mismatch) can produce false failures without pinned versions.

### Ready for Proposal
Yes — proceed to `sdd-propose` with strict scope: testing foundation + CI quality gates, phased adoption, and risk controls.
