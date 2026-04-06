# Ranked Choices

An offline-first Nuxt 4 application for ranking items based on weighted criteria.

## Features

- **Weighted Ranking**: Define criteria with weights and rank items by weighted score.
- **Manual Ranking**: Drag and drop items to reorder them manually.
- **Criteria Management**: Full CRUD support for ranking criteria.
- **Local Persistence**: All data is saved locally in your browser using IndexedDB via Dexie.
- **PWA Support**: Installable app with offline-capable shell.

## Current Product Model

- Ranking modes use **weighted** and **manual** terminology.
- Item scores are embedded on each item as a local score map.
- The current implementation includes optional local profile personalization.
- The app remains offline-only with no backend, auth, or cloud sync.

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3)
- **UI**: Tailwind CSS
- **Database**: Dexie.js (IndexedDB wrapper)
- **Drag & Drop**: @formkit/drag-and-drop
- **PWA**: @vite-pwa/nuxt
- **Testing**: Vitest

## Setup

Install dependencies:

```bash
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Testing

Run the test suite:

```bash
bun test
```

## Production

Build the application for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```
