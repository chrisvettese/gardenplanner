/** A single garden-bed square. Existing = "in the garden"; absent grid
 *  positions are simply out of bounds. */
export interface Cell {
  id: string;
  /** Integer grid coordinates. */
  x: number;
  y: number;
  color: string;
  text: string;
  /** Label font size in px. */
  fontSize: number;
  /** Up to 9 plant catalog ids; duplicates allowed (e.g. 2 tomatoes + 2 peppers). */
  plants: string[];
}

/** A freeform text note, positioned anywhere on the canvas (not grid-snapped). */
export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  /** A blob: URL while the app is open (see io/imageAssets.ts); a relative
   * path like "images/<id>.jpg" inside a saved .gardenplan zip. */
  image?: string;
  /** Render `text` as Markdown instead of plain text. Off by default —
   * only notes opt in, cell labels never support it. */
  markdown?: boolean;
}

export interface GardenPlan {
  version: 1;
  name: string;
  cells: Cell[];
  notes: Note[];
}

export function createEmptyPlan(name = 'Untitled garden'): GardenPlan {
  return { version: 1, name, cells: [], notes: [] };
}
