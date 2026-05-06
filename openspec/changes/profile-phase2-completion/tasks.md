# Tasks: Profile Phase 2 Completion

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 220-360 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR (or 2 work units if scope grows) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Monthly metrics backend + hook exposure | PR 1 | `ProfileService` + `useProfile`; no UI behavior change yet |
| 2 | Progress card UI + identity edit route/CTA | PR 1 (or PR 2 if diff grows) | Keep profile-only scope; include manual verification notes |

## Phase 1: Foundation (profile service contracts)

- [x] 1.1 Update `src/services/ProfileService.ts` with `MonthlyProfileMetrics` interface and `getMonthlyMetrics(userId, now?)` contract.
- [x] 1.2 Implement month window builder (`monthStart`, `nextMonthStart`) and query `task_logs` by `user_id`, `completed_at` range, `status in (approved,rejected,pending)`.
- [x] 1.3 Implement deterministic computation helpers: `completedThisMonth=approved`, `denominator=approved+rejected`, `completionPercentage=denominator===0?0:round(...)`.

## Phase 2: Core implementation (profile hook + UI)

- [x] 2.1 Modify `src/features/profile/hooks/useProfile.ts` to add `monthlyMetricsQuery` and expose `monthlyMetrics` without breaking current consumers.
- [x] 2.2 Create `src/features/profile/components/MonthlyProgressCard.tsx` to show `completed_this_month` and `completion_percentage`, including explicit zero-state copy.
- [x] 2.3 Modify `src/app/(tabs)/profile.tsx` to render the new progress card section whenever metrics are present (including zero values).

## Phase 3: Identity edit flow (profile-only route)

- [x] 3.1 Create `src/app/profile/edit.tsx` with local form state, trim validation, and inline error for empty `display_name`.
- [x] 3.2 Wire submit to `useProfile.updateProfile({ display_name })`; block mutation on invalid input; navigate back on success.
- [x] 3.3 Add/adjust CTA in `src/app/(tabs)/profile.tsx` to open `/profile/edit` and confirm refreshed profile header value after return.

## Phase 4: Verification and docs alignment

- [x] 4.1 Add logic-level checks in `src/services/ProfileService.ts` (or colocated helper tests if available) for zero denominator, 3/4=>75%, and month-boundary filtering.
- [x] 4.2 Perform manual integration verification: valid/empty display name behavior, progress card visible for non-zero and zero-state metrics.
- [x] 4.3 Update Phase 2 status/checklist docs under `openspec/changes/profile-phase2-completion/` to mark completed items and retain non-goals (quests/wallet/clan/image pipeline) as out of scope.
