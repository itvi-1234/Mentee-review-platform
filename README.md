# Mentee Review Console

A dark-themed dashboard for CNCF mentors to review mentee applications. Upload the mentee CSV export, browse applicants in a sortable table with clickable resume/cover-letter/inclusive-community links, toggle who's called for an interview, and export that shortlist as its own CSV.

Everything runs client-side — the CSV never leaves your browser. Uploaded data and interview decisions are kept in `localStorage`, so a page refresh doesn't lose your progress.

## Features

- **Drag-and-drop or click-to-upload** CSV import, parsed entirely in the browser
- Auto-detects `FirstName`, `LastName`, `Email` and any `File_1`, `File_2`, ... document columns, regardless of column order
- Sortable, searchable table with a live count of mentees called for interview
- Per-mentee **interview toggle** that persists across sessions (matched back to mentees by email)
- **Copy interview emails** to clipboard, or **download a CSV** containing just the mentees marked for interview
- Light and dark themes, defaulting to dark

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) and upload a mentee CSV to get started.

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.

## Tech stack

React, TypeScript, and Vite. No backend, no external API calls — the app parses and stores everything locally in the browser.
