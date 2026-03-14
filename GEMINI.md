# GEMINI.md

## Project Overview
**Ranked Choices** is an offline-first Nuxt 3 web application designed for ranking items based on weighted criteria or manual sorting. It uses IndexedDB (via Dexie.js) for local persistence, ensuring all user data remains private and accessible without an internet connection.

### Core Technologies
- **Framework:** [Nuxt 3](https://nuxt.com/) (running in Nuxt 4 compatibility mode)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [DaisyUI 5](https://daisyui.com/), and [Radix Vue](https://www.radix-vue.com/)
- **Database:** [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Interactions:** [@formkit/drag-and-drop](https://drag-and-drop.formkit.com/) for manual ranking, [anime.js](https://animejs.com/) for micro-interactions
- **Icons:** [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **Testing:** [Vitest](https://vitest.dev/)

### Key Architecture
- **Ranking Engine:** Logic for calculating weighted scores and deterministic sorting is located in `app/utils/rankingEngine.ts`.
- **Data Model:** IndexedDB schema and Dexie instance are defined in `app/utils/db.ts`.
- **State Management:** Handled via Vue 3 Composables (`app/composables/`) and direct database interactions.
- **Offline-First:** PWA support via `@vite-pwa/nuxt`.

## Building and Running

### Prerequisites
- [Bun](https://bun.sh/) (preferred package manager)

### Key Commands
- `bun install`: Install all project dependencies.
- `bun run dev`: Start the local development server at `http://localhost:3000`.
- `bun run build`: Build the application for production.
- `bun run generate`: Perform static site generation (SSG).
- `bun run preview`: Preview the production build locally.
- `bun test`: Execute the test suite using Vitest.
- `bun run lint`: Run ESLint for code quality checks.
- `bun run format`: Fix linting issues automatically.

## Development Conventions

### Code Style
- **ESLint:** Configured with `@antfu/eslint-config`.
- **Formatting:** Handled by ESLint and Biome.
- **Components:** Logic should reside in `app/composables/` when reusable; otherwise, keep it in the component setup block.
- **Types:** Define shared types in `app/types/index.ts`.

### Testing Practices
- **Unit Tests:** Place unit tests alongside the source files (e.g., `ComponentName.test.ts`) or in the `tests/` directory.
- **Database Testing:** Use `fake-indexeddb` for testing database-related logic (see `tests/db.test.ts`).

### Directory Structure
- `app/`: Main application source.
  - `components/`: UI components (CriteriaManager, ItemManager, RankingView, etc.).
  - `composables/`: Business logic and state (useLists, useListDetails).
  - `pages/`: File-based routing.
  - `utils/`: Core utilities (db, rankingEngine).
- `tests/`: Centralized test suite.
- `codebase-docs/`: Technical documentation and architecture overviews.
- `ranked-choices-full-docs/`: Product Requirements Document (PRD) and detailed specifications.

## TODOs & Roadmap
- [ ] Implement export/import functionality for ranking data.
- [ ] Add more visualization options for rankings (e.g., charts).
- [ ] Expand test coverage for edge cases in the ranking engine.
