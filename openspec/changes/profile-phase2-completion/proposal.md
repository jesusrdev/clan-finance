# Proposal: Profile Phase 2 Completion

## Intent

Complete only the remaining Phase 2 Profile items with low-risk increments: editable identity, missing progress metrics, and status alignment. This resolves checklist drift between roadmap docs and real implementation.

## Scope

### In Scope
- Add profile edit flow for `display_name` (using existing profile update path).
- Add monthly completion metrics: “completed this month” and “porcentaje de completado”.
- Add a simple profile progress chart/card based on existing profile/task data.
- Update Phase 2 status/checklist docs after implementation.

### Out of Scope
- Any quests implementation.
- Any wallet feature implementation (beyond read-only stats consumption already present).
- Any clan feature implementation (beyond read-only stats consumption already present).
- Profile image upload/media pipeline changes.

## Capabilities

### New Capabilities
- `profile-phase2-completion`: Finishes pending Phase 2 profile behaviors (identity edit, monthly completion metrics, progress visualization).

### Modified Capabilities
- None (no baseline `openspec/specs/*` capabilities exist yet to delta against).

## Approach

Use in-place completion on current profile module (no architecture refactor). Deliver in reviewable low-risk slices:
1. Identity slice: edit screen/form + `display_name` update.
2. Metrics slice: service/hook monthly queries and percentage computation.
3. UI/docs slice: progress chart/card + roadmap/status alignment.

### Completion Percentage Semantics
- Numerator: approved tasks completed in current calendar month (`task_logs.status = approved` and `completed_at` within month).
- Denominator: approved + rejected tasks completed in current month (excluding pending/in-review tasks).
- Result: `0%` when denominator is `0`; otherwise rounded integer percentage.
- Assumption: `task_logs` has reliable `status` and `completed_at` timestamps in DB timezone used by current app queries.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/(tabs)/profile.tsx` | Modified | Integrate navigation/action entry points and new metrics/chart UI blocks. |
| `src/services/ProfileService.ts` | Modified | Add monthly aggregation + completion percentage logic. |
| `src/features/profile/hooks/useProfile.ts` | Modified | Expose new computed metrics to UI. |
| `docs/DESARROLLO.md`, `docs/CURRENT-STATUS.md` | Modified | Align checklist with implemented state. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Ambiguous metric semantics | Med | Lock formula above in specs before implementation. |
| Scope drift into quests/wallet/clan | Med | Enforce out-of-scope guard in tasks and PR review. |
| Monthly boundary/timezone mismatch | Low | Reuse existing query timezone conventions and document assumption. |

## Rollback Plan

Revert the three slices independently: (1) edit flow UI/hooks, (2) monthly metric logic, (3) chart/docs updates. Keep existing profile header/stats behavior as fallback.

## Dependencies

- Supabase `task_logs` data quality (`status`, `completed_at`) and existing `profiles` update permissions.

## Success Criteria

- [ ] User can edit and persist `display_name` from profile flow.
- [ ] Profile shows “completed this month” and defined completion percentage.
- [ ] Profile includes a visible progress chart/card sourced from monthly metrics.
- [ ] Docs reflect true Phase 2 profile completion status and exclusions.
