# Garden Planner

A tiny, local-first garden bed planner. No account, no server, no
subscription — just a React app that reads and writes plain `.json`
plan files. Lay out any shape of garden square-by-square, color and
label each square, pin freeform notes anywhere on the canvas, and
save/reload whenever you want to keep working on a plan.

## Using it

- **Click empty space** on the grid to add a square there. Squares can
  form any shape — there's no fixed rectangle, just the squares you've
  added. Anywhere you haven't added a square is simply out of bounds.
- **Click a square** (or note) to open its editor: type a label, pick
  plants from the catalog (up to 9 per square, repeats allowed — e.g.
  2 tomatoes + 2 peppers), pick a color (recently-used colors show up
  first for quick reuse), adjust the label's font size (squares only),
  or delete it.
- **Plants**: a square with plants selected shows their icons instead
  of its text label, arranged in a grid that gets denser as you add
  more (1 big icon, up to a 3x3 of small ones for 9). Click the square
  to see each one paired with its name again if it's not obvious at a
  glance.
- **+ Note** adds a freeform text box anywhere on the canvas — for
  things like a spray schedule or a legend that isn't tied to one
  square. Drag it by its body to reposition it.
- **Pan**: click-drag empty canvas, or the arrow keys.
- **Zoom**: mouse wheel / trackpad pinch, or the +/− buttons. "Fit"
  frames the whole garden.
- **Delete**: select a square/note and press Delete/Backspace, or use
  the delete button in its editor.
- **Open / Save / Save As**: in Chrome/Edge these save straight back to
  the file you opened (the File System Access API). In other browsers
  it falls back to a file picker for opening and a download for
  saving.

Everything lives in the plan's `.json` file — there's no hidden state.
Loading a file fully restores where you left off; "New" just clears
the in-memory plan.

## Development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

One-time setup: in the repo's GitHub settings, under **Pages**, set the
source to **Deploy from a branch → `gh-pages`**.

Then, any time you want to publish:

```bash
npm run deploy
```

This builds the app and pushes `dist/` to the `gh-pages` branch via the
[`gh-pages`](https://www.npmjs.com/package/gh-pages) package.

## Plan file format

```json
{
  "version": 1,
  "name": "2026 Plants - June Update",
  "cells": [{ "id": "…", "x": 0, "y": 0, "color": "#d7ecc8", "text": "Melon", "fontSize": 11, "plants": ["tomato", "tomato", "pepper"] }],
  "notes": [{ "id": "…", "x": 820, "y": 40, "width": 220, "height": 140, "color": "#fff8d6", "text": "Koppert biweekly…" }]
}
```

`cells` use integer grid coordinates; `notes` use free pixel-space
coordinates, independent of the grid.

## Plant catalog

19 plants so far ([src/plants/catalog.ts](src/plants/catalog.ts), icons
in [src/plants/icons.tsx](src/plants/icons.tsx)): tomato, pepper, melon,
watermelon, fig, clementine, raspberry, bean, carrot, celery, onion,
Genovese basil, Thai basil, rosemary, sunflower, morning glory,
mandevilla, heliotrope, pelargonium. Adding more later is just adding
a catalog entry + icon component.

## Not in the MVP yet

Cell spanning/merging, undo/redo, PNG export, a multi-plan library, and
resizable notes. All straightforward to add later if useful.
