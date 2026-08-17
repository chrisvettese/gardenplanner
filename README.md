# Garden Planner

A garden bed planner: a static React app with no server or account,
that reads and writes its own `.gardenplan` files. Lay out any shape
of garden square-by-square, color and label each square, pin freeform
notes (including pasted photos) anywhere on the canvas, and
save/reload to continue a plan later.

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
  square. Drag it by its body to reposition it, or drag the handle at
  its bottom-right corner (visible when selected) to resize it. Check
  "Render as Markdown" in its editor to format the text (headings,
  bold/italic, lists, links, code, blockquotes) instead of showing it
  as plain text — off by default. Cell labels don't support this.
- **Paste an image (Ctrl+V / Cmd+V)** anywhere (not while typing in a
  text field) to drop it as a new note, sized to its own aspect ratio
  and centered in the current view. Stored byte-for-byte as pasted —
  no downscaling or recompression — so a big screenshot means a
  bigger `.gardenplan` file, but nothing about the image is touched.
  Give it a caption by typing in its editor like any other note; the
  label renders on top of the photo instead of replacing it.
- **Pan**: click-drag empty canvas, or the arrow keys.
- **Zoom**: mouse wheel / trackpad pinch, or the +/− buttons. "Fit"
  frames every square and every note, including ones sitting well
  outside the grid.
- **Delete**: select a square/note and press Delete/Backspace, or use
  the delete button in its editor.
- **Open / Save / Save As**: in Chrome/Edge these save straight back to
  the file you opened (the File System Access API). In other browsers
  it falls back to a file picker for opening and a download for
  saving.

Everything lives in the plan's `.gardenplan` file — there's no hidden
state. Loading a file fully restores where you left off; "New" just
clears the in-memory plan.

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

A `.gardenplan` file is a zip archive (same trick `.docx`/`.pptx` use —
rename it to `.zip` and any archive tool will happily open it) containing:

- `plan.json` — the plan itself
- `images/<note-id>.<ext>` — one file per note with a pasted image,
  stored exactly as pasted (whatever format/extension the clipboard
  gave it — PNG, JPEG, WebP, GIF, …)

```json
{
  "version": 1,
  "name": "2026 Plants - June Update",
  "cells": [{ "id": "…", "x": 0, "y": 0, "color": "#d7ecc8", "text": "Melon", "fontSize": 11, "plants": ["tomato", "tomato", "pepper"] }],
  "notes": [
    { "id": "…", "x": 820, "y": 40, "width": 220, "height": 140, "color": "#fff8d6", "text": "**Koppert** biweekly…", "markdown": true },
    { "id": "abc123", "x": 300, "y": 500, "width": 240, "height": 160, "color": "#fff8d6", "text": "", "image": "images/abc123.jpg" }
  ]
}
```

`cells` use integer grid coordinates; `notes` use free pixel-space
coordinates, independent of the grid. A note's `image` is a path
relative to the archive root, not embedded data — that's what the
`images/` folder is for. Files saved before this existed are plain
JSON with no image support; opening one still works (detected
automatically), it just won't have any `images/` folder to draw from.

## Plant catalog

19 plants so far ([src/plants/catalog.ts](src/plants/catalog.ts), icons
in [src/plants/icons.tsx](src/plants/icons.tsx)): tomato, pepper, melon,
watermelon, fig, clementine, raspberry, bean, carrot, celery, onion,
Genovese basil, Thai basil, rosemary, sunflower, morning glory,
mandevilla, heliotrope, pelargonium. Adding more later is just adding
a catalog entry + icon component.

## Not in the MVP yet

Cell spanning/merging, undo/redo, PNG export, and a multi-plan
library. All straightforward to add later if useful.
