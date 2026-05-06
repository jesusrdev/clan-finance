# Profile Phase 2 Completion Specification

## Purpose

Define the remaining Phase 2 profile behaviors with verifiable outcomes, fixed completion-percentage semantics, and explicit non-goals to avoid scope drift.

## Non-Goals

- The system MUST NOT add quests implementation.
- The system MUST NOT add wallet feature implementation beyond existing read-only stats usage.
- The system MUST NOT add clan feature implementation beyond existing read-only stats usage.
- The system MUST NOT add profile image upload or media pipeline changes.

## Requirements

### Requirement: Editable Profile Identity

The system MUST allow a signed-in user to edit and persist `display_name` through the profile flow using existing profile update permissions.

#### Scenario: User updates display name successfully

- GIVEN an authenticated user on the profile edit flow
- WHEN the user submits a valid `display_name`
- THEN the system persists the new `display_name`
- AND the updated value is shown when the profile view reloads

#### Scenario: Empty display name is rejected

- GIVEN an authenticated user on the profile edit flow
- WHEN the user submits an empty `display_name`
- THEN the system MUST NOT persist the value
- AND the user receives a validation error state

### Requirement: Monthly Completion Metrics

The system MUST expose monthly profile metrics for the current calendar month: `completed_this_month` and `completion_percentage`.

#### Scenario: Metrics are computed with defined status filters

- GIVEN task logs in the current month with statuses `approved`, `rejected`, and `pending`
- WHEN monthly metrics are computed
- THEN `completed_this_month` equals count of logs where status is `approved`
- AND denominator for percentage equals count of logs where status is `approved` or `rejected`

#### Scenario: Zero-denominator returns zero percent

- GIVEN no current-month logs with status `approved` or `rejected`
- WHEN monthly metrics are computed
- THEN `completion_percentage` is `0%`

#### Scenario: Non-zero denominator rounds to integer percent

- GIVEN current-month logs where approved count is 3 and approved+rejected count is 4
- WHEN monthly metrics are computed
- THEN `completion_percentage` is `75%` as a rounded integer

### Requirement: Profile Progress Visualization

The system MUST render a visible profile progress chart/card sourced from the monthly metrics values.

#### Scenario: Progress UI renders when metrics are available

- GIVEN the profile screen has monthly metrics data
- WHEN the profile screen is displayed
- THEN a progress chart/card is visible
- AND it shows `completed_this_month` and `completion_percentage`

#### Scenario: Progress UI remains visible in zero state

- GIVEN `completed_this_month` is 0 and `completion_percentage` is `0%`
- WHEN the profile screen is displayed
- THEN the progress chart/card remains visible
- AND it communicates the zero-progress state without errors

### Requirement: Phase 2 Status Documentation Alignment

The system SHALL keep Phase 2 profile status/checklist documentation aligned with implemented behavior and exclusions.

#### Scenario: Docs reflect implemented profile scope

- GIVEN profile Phase 2 behavior is implemented
- WHEN project status docs are updated
- THEN docs list identity edit, monthly metrics, and progress visualization as completed
- AND docs explicitly retain quests/wallet/clan/image pipeline as out of scope

### Requirement: Acceptance Criteria Gate

The system MUST treat the change as complete only when all acceptance criteria are satisfied.

#### Scenario: Completion gate passes

- GIVEN the implementation and documentation are reviewed
- WHEN acceptance is evaluated
- THEN all criteria are true: display name persistence, monthly metrics shown, progress chart/card visible, and docs aligned
