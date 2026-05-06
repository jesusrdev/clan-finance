## Exploration: profile-phase2-completion

### Current State
Profile is already the most advanced module and includes: profile tab screen, header with XP/level/rank progress visualization, stats cards, avatar emoji picker/update, theme selection flow, and logout. Data is fetched via `useProfile` + `ProfileService` from Supabase (`profiles`, `task_logs`, `wallets`, `clans`).

Against the explicit Phase 2 checklist in `docs/DESARROLLO.md`, some items marked unchecked are actually implemented (profile screen, XP display/progress math, and part of stats). Remaining work is concentrated on editing identity and completing the missing stats/metrics pieces.

### Affected Areas
- `docs/DESARROLLO.md` — source checklist for Phase 2 scope and pending items.
- `docs/CURRENT-STATUS.md` — confirms real baseline already implemented in profile.
- `src/app/(tabs)/profile.tsx` — current profile screen; contains header, stats, avatar and settings actions.
- `src/features/profile/hooks/useProfile.ts` — profile and stats query orchestration.
- `src/services/ProfileService.ts` — Supabase reads/writes for profile + stats; stats currently count approved tasks globally.
- `src/features/profile/components/StatsGrid.tsx` — current stat cards (Clan, Missions, Balance).
- `src/features/profile/components/ProfileHeader.tsx` — XP/level/progress display and progression calculations.
- `src/features/profile/utils/profileMath.ts` — level/progress formulas (already active).
- `src/types/database.types.ts` — confirms available columns (`display_name`, `avatar_url`, `xp`, `task_logs.completed_at`, etc.) for remaining scope.

### Approaches
1. **Finish Phase 2 in-place on current profile tab** — Add missing edit and stats capabilities directly in existing profile domain.
   - Pros: Smallest change set, preserves current UX baseline, low integration risk.
   - Cons: Profile tab may grow in responsibility if edit flows are not cleanly separated.
   - Effort: Medium.

2. **Introduce a dedicated profile application layer first, then complete UI** — Refactor service/hook boundaries before feature completion.
   - Pros: Cleaner long-term structure for future profile growth.
   - Cons: Adds refactor scope not required by Phase 2 checklist; higher review and regression risk.
   - Effort: High.

### Recommendation
Use **Approach 1**. It satisfies the user goal of completing Phase 2 without inventing scope and keeps work constrained to profile-only outcomes.

Exact remaining Phase 2 scope (based on checklist + real code):
1) **Create/edit profile flow**: add dedicated edit screen/form for `display_name` (avatar emoji update is already present; optional image upload can remain out of scope unless explicitly requested).
2) **Stats completion**: implement “completed this month” and “completion percentage” metrics (current count is lifetime approved tasks), and add a simple progress chart/card to satisfy “gráfica de progreso”.
3) **Alignment pass**: update checklist/status docs to reflect implemented vs truly pending items after code completion.

### Risks
- Scope drift risk: adding non-profile concerns (quests/wallet/clan logic) while implementing profile metrics.
- Data semantics risk: “porcentaje de completado” denominator is not explicitly defined in docs; needs precise definition before implementation.
- Baseline mismatch risk: roadmap checklist currently diverges from implemented state, which can cause duplicate or unnecessary work.

### Ready for Proposal
Yes — the scope is clear enough to proceed to proposal/spec with a constrained profile-only slice plan.

Suggested reviewable slice sequence:
1) Slice A: Edit profile screen + `display_name` update (reuse existing `updateProfile`).
2) Slice B: Monthly stats query + completion percentage logic in `ProfileService`/`useProfile`.
3) Slice C: Progress chart/card UI in profile stats area + docs status alignment.
