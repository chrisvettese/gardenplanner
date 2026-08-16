/** World-space size (px, at scale=1) of one grid cell. */
export const CELL_SIZE = 56;

export const MIN_SCALE = 0.2;
export const MAX_SCALE = 3;

/** Below this zoom level, grid cells are too small to reliably click on, so
 * clicking empty space just pans/deselects instead of adding a cell. */
export const ADD_CELL_MIN_SCALE = 0.4;

/** Pixels the viewport shifts per arrow-key press. */
export const ARROW_PAN_STEP = 64;

export interface Viewport {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export function worldToScreen(worldX: number, worldY: number, viewport: Viewport) {
  return {
    x: viewport.offsetX + worldX * viewport.scale,
    y: viewport.offsetY + worldY * viewport.scale,
  };
}

export function screenToWorld(screenX: number, screenY: number, viewport: Viewport) {
  return {
    x: (screenX - viewport.offsetX) / viewport.scale,
    y: (screenY - viewport.offsetY) / viewport.scale,
  };
}
