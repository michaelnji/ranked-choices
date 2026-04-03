# Drift From Original Plan

This file records where the current code differs from earlier planning documents.

## 1. Naming Drift
### Planned
- computed
- manual

### Implemented
- weighted
- manual

## 2. Data Model Drift
### Planned
A dedicated `Score` entity/store.

### Implemented
Scores are embedded inside `Item.scores`.

## 3. Ranking State Drift
### Planned
Manual order becomes authoritative until explicit reset to computed ranking.

### Implemented
The user can switch ranking mode directly in settings between Manual and Weighted.

## 4. UX Drift
### Planned
A matrix-style scoring experience was expected as a primary scoring workflow.

### Implemented / Observed
The inspected add-item flow currently presents criteria as binary toggles, storing 0 or 10.

## 5. Scope Drift
### Planned
No profile-related feature was part of the locked MVP.

### Implemented
A `profile` store exists and is used for local username personalization on the homepage.

## Decision
The project should now favor:
- documentation alignment with code
- release readiness
- selective cleanup

It should not default to refactoring back toward the earlier architecture.
