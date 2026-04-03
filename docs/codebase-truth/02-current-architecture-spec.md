# Current Architecture Spec (Implementation-Aligned)

## Stack
- Nuxt 4
- Vue 3
- Tailwind CSS
- Dexie for IndexedDB
- @vite-pwa/nuxt for PWA
- Vitest for tests
- @formkit/drag-and-drop for manual ordering

## Runtime Model
- SSR disabled
- local-first SPA
- PWA with service worker generation
- offline-capable app shell

## Persistence Model

### Stores
The current Dexie database contains:
- `lists`
- `criteria`
- `items`
- `profile`

### List
- id
- name
- rankingMode: "manual" | "weighted"
- createdAt
- updatedAt

### Criteria
- id
- listId
- name
- weight

### Item
- id
- listId
- name
- manualRankIndex
- scores: Record<number, number>

### UserProfile
- id
- username
- createdAt

## Architectural Decision: Embedded Scores
Scores are not stored in a separate `scores` table.
They are embedded in `Item.scores`.

### Why this is acceptable for the current app
Given the current limits:
- 100 items max per list
- 20 criteria max per list

The maximum score surface is small enough that embedded score maps are operationally acceptable.

### Benefits
- simpler read model
- simpler ranking engine input
- simpler tests
- fewer stores and joins

### Tradeoffs
- less normalized than a dedicated score entity
- harder to query scores independently
- future migrations will be more involved if score rows become first-class entities

## Ranking Engine
The ranking engine is implemented as a pure utility layer.

### Weighted formula
For each criterion:
- item score is read from `item.scores[criterion.id]`, default 0
- score is normalized by dividing by 10
- normalized score is multiplied by criterion weight

Total score:
- sum of all normalized weighted contributions

## Manual Ordering
Manual order is persisted via `manualRankIndex` on each item.

## Current Transition Model
The current implementation supports explicit switching between:
- manual
- weighted

This differs from the earlier "manual until reset" contract and should now be treated as the official current behavior unless intentionally changed later.
