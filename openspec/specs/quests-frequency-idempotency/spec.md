# quests-frequency-idempotency Specification

## Purpose

Definir la regla de una completitud por ventana de frecuencia en Quests y el contrato de conflicto/UX asociado.

## Requirements

### Requirement: Frequency window idempotency guard

The system MUST reject a completion attempt when the same user already completed the same task inside the active UTC window for that task frequency.

#### Scenario: Daily duplicate in same UTC day

- GIVEN a task with `frequency = daily` and an existing completion for user U in the current UTC day
- WHEN user U attempts to complete the same task again before the next UTC day starts
- THEN the completion MUST be rejected as conflict

#### Scenario: Daily completion in next UTC day

- GIVEN a task with `frequency = daily` and a completion from the previous UTC day
- WHEN user U attempts completion after 00:00:00 UTC of the new day
- THEN the completion MUST be accepted (no frequency conflict)

### Requirement: Weekly and monthly window boundaries

The system SHALL evaluate frequency windows using explicit UTC boundaries: weekly starts Monday 00:00:00 UTC (ISO week), monthly starts day 1 at 00:00:00 UTC.

#### Scenario: Weekly duplicate in same ISO week

- GIVEN a task with `frequency = weekly` and an existing completion for user U after Monday 00:00:00 UTC of the current ISO week
- WHEN user U retries completion before the next ISO week starts
- THEN the completion MUST be rejected as conflict

#### Scenario: Monthly duplicate in same UTC month

- GIVEN a task with `frequency = monthly` and an existing completion for user U in the current UTC month
- WHEN user U retries completion before day 1 00:00:00 UTC of the next month
- THEN the completion MUST be rejected as conflict

### Requirement: Conflict error contract

When a frequency conflict occurs, the system MUST return the domain error code `TASK_ALREADY_COMPLETED_IN_WINDOW` and MUST NOT return a generic/unknown error for this condition.

#### Scenario: Domain conflict mapping

- GIVEN a completion attempt that violates daily/weekly/monthly idempotency
- WHEN the domain result is produced
- THEN the error code MUST be `TASK_ALREADY_COMPLETED_IN_WINDOW`

### Requirement: UX behavior for conflict and double-submit mitigation

The client MUST present conflict feedback as a non-blocking, actionable message: "Ya completaste esta tarea en este período." and SHOULD disable repeated submit while a completion request is in progress.

#### Scenario: Conflict feedback copy

- GIVEN a completion attempt rejected with `TASK_ALREADY_COMPLETED_IN_WINDOW`
- WHEN the UI renders the result
- THEN the user MUST see "Ya completaste esta tarea en este período." instead of a generic failure

#### Scenario: Submit disabled during in-flight request

- GIVEN a user initiated task completion request
- WHEN the request is still in progress
- THEN the completion action control SHOULD remain disabled until the request resolves
