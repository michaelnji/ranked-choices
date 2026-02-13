# Ranked Choices – AI Code-Generation Protocol
Version: 1.0
Purpose: Step-locked execution system for AI cloud agent development

============================================================
CORE PRINCIPLES
============================================================

1. The AI agent must execute ONE phase at a time.
2. The AI agent must NOT modify architecture unless explicitly instructed.
3. The AI agent must NOT introduce new dependencies without approval.
4. The AI agent must complete exit criteria before moving forward.
5. The AI agent must output:
   - Files created/modified
   - Explanation of implementation decisions
   - Test coverage added
6. No assumptions. If undefined, stop and request clarification.

============================================================
GLOBAL CONSTRAINTS
============================================================

Framework: Nuxt 4
UI Stack: TailwindCSS + DaisyUI + Shadcn
Persistence: IndexedDB only
PWA: Required from day 1
Offline-first: Mandatory
No backend.
No authentication.
No cloud services.
Max 100 items per list.
Max 20 criteria per list.
Criteria weight range: 0–10.

============================================================
EXECUTION PHASE LOCK SYSTEM
============================================================

The AI may ONLY execute the currently unlocked phase.

To begin a phase, supervisor must issue:

> START PHASE X

To approve completion:

> PHASE X APPROVED

To reject:

> PHASE X REVISE

============================================================
PHASE 0 – FOUNDATION
============================================================

Objective:
Initialize project structure and core dependencies.

Deliverables:
- Nuxt 4 initialized
- Tailwind configured
- DaisyUI configured
- Shadcn configured
- PWA module configured
- IndexedDB abstraction scaffolded

Exit Criteria:
- App runs locally
- PWA installable
- IndexedDB helper loads without error
- No ranking logic implemented yet

Prompt Template for AI:
----------------------------------
You are executing PHASE 0 of Ranked Choices.
Follow architecture strictly.
Do not implement ranking logic.
Produce file tree and configuration code only.
----------------------------------

============================================================
PHASE 1 – DATA MODEL + STORAGE
============================================================

Objective:
Define models and persistence.

Models:
List:
- id
- name
- rankingMode ("manual" | "weighted")
- createdAt
- updatedAt

Criteria:
- id
- listId
- name
- weight (0–10)

Item:
- id
- listId
- name
- manualRankIndex
- scores: { [criteriaId]: number }

Deliverables:
- Type definitions
- IndexedDB schema
- CRUD composables

Exit Criteria:
- Create list
- Add criteria
- Add items
- Persist + reload successfully

Prompt Template:
----------------------------------
You are executing PHASE 1.
Implement data models exactly as defined.
Add IndexedDB persistence.
Add unit tests for CRUD.
Do not implement ranking yet.
----------------------------------

============================================================
PHASE 2 – RANKING ENGINE
============================================================

Objective:
Implement deterministic ranking logic.

Weighted Algorithm:
score = SUM(item_score_for_criterion × criterion_weight)

Rules:
- Sorting must be stable
- Deterministic output
- No mutation of source arrays
- Pure function implementation

Deliverables:
- rankingEngine.ts
- Manual reorder logic
- Mode toggle logic
- Unit tests covering:
  - empty criteria
  - zero weights
  - max weights
  - tie scores

Exit Criteria:
- All tests pass
- Deterministic ranking confirmed

Prompt Template:
----------------------------------
You are executing PHASE 2.
Implement rankingEngine as a pure function.
Add comprehensive unit tests.
Do not implement UI.
----------------------------------

============================================================
PHASE 3 – UI IMPLEMENTATION
============================================================

Objective:
Implement full UI flows.

Pages:
- Dashboard
- List View
- List Editor
- Ranking View

Requirements:
- Clear mode toggle
- Criteria weight sliders (0–10)
- Drag-and-drop manual reordering
- Responsive layout

Exit Criteria:
- Create → edit → rank → persist flow works
- No console errors
- Works offline

Prompt Template:
----------------------------------
You are executing PHASE 3.
Use Tailwind + DaisyUI + Shadcn only.
Follow component separation.
No business logic inside components.
----------------------------------

============================================================
PHASE 4 – TEST HARDENING
============================================================

Objective:
Edge case validation.

Required Tests:
- 100 items max constraint
- 20 criteria max constraint
- Weight bounds enforcement
- Mode switching integrity
- Offline persistence validation

Exit Criteria:
- All tests pass
- No state inconsistency
- No race conditions

Prompt Template:
----------------------------------
You are executing PHASE 4.
Add validation guards.
Add constraint enforcement.
Write tests for all constraints.
----------------------------------

============================================================
REVIEW PROTOCOL (Supervisor)
============================================================

When reviewing AI output, verify:

□ Architecture unchanged
□ No unauthorized dependencies
□ No backend usage
□ IndexedDB only
□ Deterministic ranking
□ Clean separation of concerns
□ Tests present and meaningful
□ No hidden global state

If violation found:
> PHASE X REVISE: [specific issue]

============================================================
FAILURE CONDITIONS
============================================================

Immediate halt if AI:
- Introduces server/API calls
- Changes data model
- Adds authentication
- Adds analytics
- Skips writing tests
- Violates max constraints

============================================================
END OF PROTOCOL
============================================================
