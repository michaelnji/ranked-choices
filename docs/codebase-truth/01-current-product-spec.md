# Current Product Spec (Implementation-Aligned)

## Product Definition
Ranked Choices is an offline-first web app for building ranked lists from weighted criteria.

## Core User Capabilities
A user can:
- create unlimited lists
- rename and delete lists
- define up to 20 criteria per list
- assign each criterion a weight from 0 to 10
- add up to 100 items per list
- persist all data locally in IndexedDB
- switch between weighted ranking and manual ranking
- reorder items manually with drag and drop

## Current Ranking Modes

### Weighted Mode
- items are sorted by weighted score descending
- tie-breaks are deterministic by item name ascending

### Manual Mode
- items are sorted by `manualRankIndex`
- drag-and-drop updates persisted item order

## Current Scoring Model
The domain model supports numeric scores per criterion on an item.
However, the inspected add-item UI currently behaves as a binary criterion match selector:
- criterion off = 0
- criterion on = 10

This should be treated as the observed product behavior unless another item-edit flow is verified to support more granular scoring.

## Profile / Personalization
The current codebase includes a local `profile` store and homepage personalization using a username.
This should be treated as:

> Optional local personalization only

It is not:
- authentication
- cloud identity
- account ownership
- multi-user support

## Constraints
- lists: unlimited
- criteria per list: 20 max
- items per list: 100 max
- criterion weight: clamped to 0-10
- scores: clamped to 0-10

## Out of Scope
Still out of scope:
- cloud sync
- backend APIs
- authentication
- collaboration
- server-side data ownership
- analytics as a core product requirement
