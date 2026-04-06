# Ranked Choices - Codebase Truth Overview

This document replaces earlier planning assumptions where they no longer match the implemented repository.

## Status
The project is implemented as a working offline-first Nuxt application with:
- local persistence via Dexie + IndexedDB
- weighted ranking
- manual ranking
- PWA support
- test coverage for ranking logic, DB behavior, and constraints

## Current Build Reality
This is an implemented MVP that now needs:
1. architecture normalization at the documentation level
2. release gating
3. spec cleanup
4. selective audit of remaining product assumptions

## Current Product Position
The current app is best described as:

> An offline-first ranked-list app where users define weighted criteria, add items, and switch between weighted ranking and manual ordering.

## Important Shift From Earlier Planning
Earlier planning assumed:
- computed/manual naming
- separate score entities
- strict manual-until-reset behavior
- matrix-style numeric scoring as the primary UI

The current implementation instead uses:
- weighted/manual naming
- scores embedded on each item
- direct ranking mode switching
- an inspected add-item flow that currently writes binary 0 or 10 criterion matches

## Recommended Project Stance
Freeze the current codebase as the source of truth.
Do not refactor toward the earlier design unless a concrete product need justifies it.
Update all project docs to match the implementation.
