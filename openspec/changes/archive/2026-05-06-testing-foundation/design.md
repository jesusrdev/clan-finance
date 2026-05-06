# Design: Testing Foundation

## Technical Approach

Introduce a Vitest-based test runtime for Expo/React Native, add a shared test harness that mirrors runtime providers from `src/app/_layout.tsx`, and enforce CI gates for `typecheck`, `test`, and `coverage`. The design maps directly to specs `test-foundation` and `ci-quality-gates`: deterministic local/CI execution, provider composition, QueryClient isolation, and baseline coverage enforcement.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice / Rationale |
|---|---|---|---|
| Test runner for RN/Expo | Jest vs Vitest | Jest has broader RN legacy docs; Vitest is faster and simpler with modern TS + ESM | **Vitest**. Keeps config minimal, fast feedback, and aligns with TypeScript-first workflow.
| Provider harness shape | Per-test manual wrappers vs shared `renderWithProviders` | Manual wrappers duplicate setup and drift from app composition | **Shared harness** in `src/test/` to centralize provider composition and reduce setup bugs.
| Query client in tests | Reuse global `queryClient` vs per-test factory | Global client leaks cache/retry state across tests | **Per-test factory** with test defaults (`retry: false`) to satisfy deterministic/isolated scenarios.
| Supabase test seam | Mock whole module ad-hoc vs explicit factory + env validation seam | Ad-hoc mocks are inconsistent and brittle | **Explicit seam**: export client factory/helpers from `src/lib/supabase/client.ts` for deterministic mocks.
| CI coverage policy | Hard high threshold now vs phased baseline | High initial threshold blocks adoption | **Phased baseline** (low initial threshold, ratchet later) to enforce quality without stalling delivery.

## Data Flow

```text
Developer/PR
   │
   ├─ npm run test
   │     └─ Vitest loads setup -> shared harness -> per-test QueryClient + mocked Supabase
   │
   └─ GitHub Actions workflow
         ├─ npm run typecheck  (fail-fast gate)
         ├─ npm run test       (runtime + discovery gate)
         └─ npm run coverage   (threshold gate, report artifact)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `package.json` | Modify | Add scripts: `typecheck`, `test`, `test:watch`, `coverage`; add Vitest/RNTL deps. |
| `tsconfig.json` | Modify | Add test typings and include test config/setup files. |
| `vitest.config.ts` | Create | Define RN-compatible runtime, test discovery, setup files, coverage thresholds/reporters. |
| `vitest.setup.ts` | Create | Global test setup, cleanup hooks, stable mocks for RN/Expo edges. |
| `src/test/renderWithProviders.tsx` | Create | Shared render utility composing providers based on app layout conventions. |
| `src/test/queryClient.ts` | Create | `createTestQueryClient()` factory with deterministic defaults and no shared cache leakage. |
| `src/test/mocks/supabase.ts` | Create | Reusable Supabase mock builders for auth/session/database responses. |
| `src/lib/query/client.ts` | Modify | Export query defaults/factory so app and tests can share contract but use different instances. |
| `src/lib/supabase/client.ts` | Modify | Introduce factory seams and guarded env resolution to enable deterministic tests. |
| `.github/workflows/ci-quality.yml` | Create | PR gates for typecheck, test execution, and coverage baseline enforcement. |
| `src/lib/query/client.test.ts` | Create | Unit test for query defaults and per-instance isolation behavior. |
| `src/lib/supabase/client.test.ts` | Create | Integration-style tests for storage/env behavior across platform branches. |

## Interfaces / Contracts

```ts
// src/test/queryClient.ts
export function createTestQueryClient(): QueryClient;

// src/test/renderWithProviders.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  options?: { queryClient?: QueryClient }
): RenderResult;

// src/lib/supabase/client.ts
export function createSupabaseClient(deps?: {
  platformOS?: "web" | "ios" | "android";
  storage?: { getItem: Function; setItem: Function; removeItem: Function };
  env?: { url?: string; anonKey?: string };
}): SupabaseClient<Database>;
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Query defaults (`retry`, stale/gc), harness helpers | Fast Vitest tests with per-test `createTestQueryClient()` |
| Integration | Supabase client env + storage branch selection (`web`/native/server) | Mock `Platform`, `window`, and storage adapters via reusable mocks |
| E2E | Not in scope | Deferred (explicitly out of scope in proposal) |

## Migration / Rollout

No data migration required. Rollout is additive and phased:
1. Land runtime + harness + seed tests.
2. Enable CI required checks for typecheck/test.
3. Enforce low initial coverage threshold; ratchet upward in later changes.

## Open Questions

- [ ] Confirm initial coverage threshold value (recommended: 20% statements/lines as bootstrap).
- [ ] Confirm Node version pinning source of truth (`.nvmrc` vs `package.json engines`) for CI parity.
