# Design: Profile Phase 2 Completion

## Technical Approach

Complete Phase 2 in-place within the existing profile module boundaries (`app tab → hook → service → supabase`). No refactor of auth, wallet, clan, or shared infra. Add: (1) display name edit flow, (2) month-scoped metrics query + percentage computation, (3) progress card UI bound to those metrics.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|---|---|---|---|
| Metric computation location | UI/hook/service | UI duplicates logic; hook still presentation-coupled; service keeps data semantics centralized | Compute in `ProfileService` |
| Monthly window semantics | Client-local month vs DB month window | Local month can drift by timezone; DB ISO boundaries are deterministic with existing query style | Build `[monthStart, nextMonthStart)` ISO range and query `completed_at` |
| Display name flow | Inline edit on profile tab vs dedicated route | Inline is faster but increases tab complexity; dedicated route is rollback-safe and reusable | Dedicated profile edit screen route |

### Decision Rationale
- Keeps current stack and layering intact (`useProfile` already composes service queries/mutations).
- Makes percentage semantics testable at one boundary and prevents formula drift across components.
- Dedicated edit route isolates risk: can remove route without touching metrics/progress blocks.

## Data Flow

### Metrics sequence
```text
ProfileTab
  -> useProfile()
    -> ProfileService.getMonthlyMetrics(userId, now?)
      -> supabase.task_logs
         filter user_id = ?
         filter completed_at >= monthStart
         filter completed_at < nextMonthStart
         filter status in (approved,rejected,pending)
      -> compute:
         completed_this_month = approved
         denominator = approved + rejected
         completion_percentage = denominator==0 ? 0 : round(approved/denominator*100)
    <- metrics object
  <- render StatsGrid + MonthlyProgressCard
```

### Identity edit sequence
```text
ProfileTab -> router.push('/profile/edit')
ProfileEditScreen -> validate display_name non-empty
  -> useProfile.updateProfile({ display_name })
    -> ProfileService.updateProfile(userId, updates)
      -> supabase.profiles.update
    -> React Query cache update/invalidate
<- navigate back -> ProfileHeader shows new display_name
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/services/ProfileService.ts` | Modify | Add `getMonthlyMetrics(userId, now?)`; month range builder; percentage computation helper/type. |
| `src/features/profile/hooks/useProfile.ts` | Modify | Add `monthlyMetricsQuery`; expose `monthlyMetrics`; keep existing profile/stats API compatible. |
| `src/app/(tabs)/profile.tsx` | Modify | Add entry CTA to edit identity route and render monthly progress card section. |
| `src/features/profile/components/MonthlyProgressCard.tsx` | Create | Presentational card for `completed_this_month` + `completion_percentage` including zero-state copy. |
| `src/app/profile/edit.tsx` | Create | Dedicated profile identity edit screen with local validation and submit through `useProfile`. |

## Interfaces / Contracts

```ts
export interface MonthlyProfileMetrics {
  completedThisMonth: number;      // approved only
  completionPercentage: number;    // 0..100 integer
  denominatorCount: number;        // approved + rejected
  monthStartIso: string;
  nextMonthStartIso: string;
}

getMonthlyMetrics(userId: string, now?: Date): Promise<MonthlyProfileMetrics>
```

Validation contract:
- `display_name` MUST be non-empty after trim.
- Invalid input MUST block mutation and surface error state.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit (logic-first) | Percentage formula, zero denominator, month window builder | Extract pure helper in `ProfileService.ts`; validate with deterministic `now` dates. |
| Integration (manual, current stack) | Profile tab shows card values for zero/non-zero states | Run app, seed task logs in Supabase, verify rendered values. |
| Integration (manual) | Edit display name persistence and cache refresh | Submit valid/empty names; verify rejection + persisted success after back navigation. |

## Migration / Rollout

No data migration required.

Rollback-safe sequencing:
1. **Metrics backend slice** (`ProfileService` + hook exposure) behind unused return field.
2. **Progress UI slice** (new card wired to exposed metrics).
3. **Identity edit slice** (new route + CTA) last, isolated by navigation.

Each slice is independently revertible with no schema or cross-domain impact.

## Open Questions

- [ ] Should denominator include only logs with non-null `completed_at` if historical rows are dirty, or treat DB constraint as trusted?
- [ ] Preferred route path: `/profile/edit` vs `/edit-profile` to match existing route naming conventions?
