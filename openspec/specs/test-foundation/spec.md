# Test Foundation Specification

## Purpose

Define a standardized, deterministic unit/integration test baseline for React Native/Expo modules in clan-finance.

## Requirements

### Requirement: Standard Test Runtime

The system MUST provide a single supported test runtime for local and CI execution with TypeScript compatibility.

#### Scenario: Run tests locally

- GIVEN a contributor with project dependencies installed
- WHEN the contributor executes the project test script
- THEN the test runtime SHALL execute all discoverable test files
- AND failures SHALL return a non-zero exit code

#### Scenario: Unsupported runtime configuration

- GIVEN test configuration references unavailable runtime plugins
- WHEN tests are executed
- THEN execution MUST fail with actionable configuration errors

### Requirement: Shared Test Harness

The system MUST provide reusable harness utilities for provider composition and deterministic module mocking.

#### Scenario: Render module with shared providers

- GIVEN a module that requires app providers
- WHEN a test uses the shared harness render utility
- THEN required providers SHALL be composed automatically

#### Scenario: Isolated data client per test

- GIVEN two tests that mutate cached query state
- WHEN tests run in sequence
- THEN each test MUST use an isolated query client instance
- AND state leakage between tests MUST NOT occur

### Requirement: Deterministic Async Behavior

The system SHOULD provide defaults and utilities that minimize flaky async behavior in tests.

#### Scenario: Retry-driven flakiness prevention

- GIVEN query operations under test
- WHEN test harness creates a query client
- THEN retry behavior SHOULD be disabled by default

#### Scenario: Timer-sensitive logic

- GIVEN logic dependent on timers
- WHEN tests run with controlled timer utilities
- THEN outcomes SHALL be deterministic across repeated runs
