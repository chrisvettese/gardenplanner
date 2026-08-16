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
