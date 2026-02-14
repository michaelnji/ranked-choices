# Ranked Choices

A Nuxt 3 application for ranking items based on weighted criteria.

## Features

- **Weighted Ranking**: Define criteria with weights and score items. The system calculates scores based on how well items match criteria.
- **Manual Ranking**: Drag and drop items to reorder them manually when in "Manual" mode.
- **Criteria Management**: Full CRUD support for ranking criteria.
- **Local Persistence**: All data is saved locally in your browser using IndexedDB.

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3)
- **UI**: Tailwind CSS + DaisyUI
- **Database**: Dexie.js (IndexedDB wrapper)
- **Drag & Drop**: @formkit/drag-and-drop
- **Testing**: Vitest

## Setup

Make sure to install dependencies:

```bash
# bun
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

Locally preview production build:

```bash
bun run preview
```
