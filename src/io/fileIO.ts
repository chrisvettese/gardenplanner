import type { GardenPlan } from '../types';

/** Minimal shape of the File System Access API handle we rely on.
 *  Typed loosely so we don't need to pull in a types package just for
 *  a feature-detected, progressively-enhanced API. */
export interface PlanFileHandle {
  name: string;
  getFile: () => Promise<File>;
  createWritable: () => Promise<{ write: (data: BlobPart) => Promise<void>; close: () => Promise<void> }>;
}

export interface SaveResult {
  handle: PlanFileHandle | null;
  fileName: string | null;
  /** false only when the user cancelled a save/open dialog. */
  saved: boolean;
}

function fsAccessSupported(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).showOpenFilePicker === 'function';
}

export function parsePlan(data: unknown): GardenPlan {
  if (!data || typeof data !== 'object') throw new Error('Not a valid garden plan file.');
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.cells) || !Array.isArray(d.notes)) {
    throw new Error('Not a valid garden plan file (missing cells/notes).');
  }
  return {
    version: 1,
    name: typeof d.name === 'string' ? d.name : 'Untitled garden',
    cells: d.cells as GardenPlan['cells'],
    notes: d.notes as GardenPlan['notes'],
  };
}

const PICKER_OPTIONS = {
  types: [{ description: 'Garden plan', accept: { 'application/json': ['.json'] } }],
};

/** Opens a plan file. Returns null if the user cancelled. */
export async function openPlanFile(): Promise<{ plan: GardenPlan; handle: PlanFileHandle | null; fileName: string } | null> {
  if (fsAccessSupported()) {
    try {
      const [handle] = await (window as any).showOpenFilePicker(PICKER_OPTIONS);
      const file = await handle.getFile();
      const plan = parsePlan(JSON.parse(await file.text()));
      return { plan, handle, fileName: handle.name };
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return null;
      throw err;
    }
  }
  return openPlanFileFallback();
}

function openPlanFileFallback(): Promise<{ plan: GardenPlan; handle: null; fileName: string } | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      file
        .text()
        .then((text) => resolve({ plan: parsePlan(JSON.parse(text)), handle: null, fileName: file.name }))
        .catch(reject);
    };
    input.click();
  });
}

/** Saves in place when `handle` is given, otherwise behaves like savePlanAs. */
export async function savePlan(plan: GardenPlan, handle: PlanFileHandle | null): Promise<SaveResult> {
  if (handle) {
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(plan, null, 2));
    await writable.close();
    return { handle, fileName: handle.name, saved: true };
  }
  return savePlanAs(plan);
}

/** Always prompts for a new location/file (or triggers a download as fallback). */
export async function savePlanAs(plan: GardenPlan): Promise<SaveResult> {
  const json = JSON.stringify(plan, null, 2);

  if (fsAccessSupported()) {
    try {
      const newHandle = await (window as any).showSaveFilePicker({ ...PICKER_OPTIONS, suggestedName: suggestedFileName(plan.name) });
      const writable = await newHandle.createWritable();
      await writable.write(json);
      await writable.close();
      return { handle: newHandle, fileName: newHandle.name, saved: true };
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return { handle: null, fileName: null, saved: false };
      throw err;
    }
  }

  const fileName = suggestedFileName(plan.name);
  downloadJson(json, fileName);
  return { handle: null, fileName, saved: true };
}

function suggestedFileName(planName: string): string {
  const slug = planName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'garden-plan';
  return `${slug}.json`;
}

function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
