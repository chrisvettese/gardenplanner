import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import type { Cell, GardenPlan, Note } from '../types';
import { DEFAULT_CELL_FONT_SIZE } from '../state/useGardenPlan';
import { MAX_PLANTS_PER_CELL } from '../plants/catalog';
import type { ImageAssets } from './imageAssets';

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

const PLAN_ENTRY = 'plan.json';
const FILE_EXTENSION = '.gardenplan';

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
    // Older files predate per-cell font size / plants; default them in
    // rather than rendering an invalid CSS value or crashing on .length.
    cells: (d.cells as Cell[]).map((c) => ({
      fontSize: DEFAULT_CELL_FONT_SIZE,
      ...c,
      plants: Array.isArray(c.plants) ? c.plants.slice(0, MAX_PLANTS_PER_CELL) : [],
    })),
    notes: d.notes as GardenPlan['notes'],
  };
}

function extensionFor(mimeType: string): string {
  return mimeType === 'image/png' ? 'png' : 'jpg';
}

/** Packs the plan + any pasted images into a single zip archive (given a
 * custom extension so it reads as this app's own file type, the same trick
 * .docx/.pptx use). Image note fields go from a live blob: URL to a
 * relative path inside the archive. */
async function buildArchive(plan: GardenPlan, assets: ImageAssets): Promise<Uint8Array> {
  const files: Record<string, Uint8Array> = {};

  const notes: Note[] = [];
  for (const note of plan.notes) {
    if (note.image && assets.has(note.image)) {
      const blob = assets.get(note.image)!;
      const path = `images/${note.id}.${extensionFor(blob.type)}`;
      files[path] = new Uint8Array(await blob.arrayBuffer());
      notes.push({ ...note, image: path });
    } else {
      notes.push(note);
    }
  }

  files[PLAN_ENTRY] = strToU8(JSON.stringify({ ...plan, notes }, null, 2));
  return zipSync(files);
}

/** Unpacks an archive built by buildArchive, hydrating each referenced
 * image into a fresh blob: URL registered in `assets` for immediate use. */
function parseArchive(bytes: Uint8Array): { plan: GardenPlan; assets: ImageAssets } {
  const files = unzipSync(bytes);
  const planEntry = files[PLAN_ENTRY];
  if (!planEntry) throw new Error('Not a valid garden plan file.');

  const plan = parsePlan(JSON.parse(strFromU8(planEntry)));
  const assets: ImageAssets = new Map();
  const notes = plan.notes.map((note) => {
    if (note.image && files[note.image]) {
      const blob = new Blob([files[note.image] as BlobPart], { type: note.image.endsWith('.png') ? 'image/png' : 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      assets.set(url, blob);
      return { ...note, image: url };
    }
    return { ...note, image: undefined };
  });

  return { plan: { ...plan, notes }, assets };
}

/** Parses file bytes as a .gardenplan archive, falling back to treating them
 * as a plain-JSON plan (no images) from before this format existed. */
function parseFileBytes(bytes: Uint8Array): { plan: GardenPlan; assets: ImageAssets } {
  try {
    return parseArchive(bytes);
  } catch {
    return { plan: parsePlan(JSON.parse(strFromU8(bytes))), assets: new Map() };
  }
}

const PICKER_OPTIONS = {
  types: [{ description: 'Garden plan', accept: { 'application/zip': [FILE_EXTENSION] } }],
};

/** Opens a plan file. Returns null if the user cancelled. */
export async function openPlanFile(): Promise<{ plan: GardenPlan; handle: PlanFileHandle | null; fileName: string; assets: ImageAssets } | null> {
  if (fsAccessSupported()) {
    try {
      const [handle] = await (window as any).showOpenFilePicker(PICKER_OPTIONS);
      const file = await handle.getFile();
      const { plan, assets } = parseFileBytes(new Uint8Array(await file.arrayBuffer()));
      return { plan, handle, fileName: handle.name, assets };
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return null;
      throw err;
    }
  }
  return openPlanFileFallback();
}

function openPlanFileFallback(): Promise<{ plan: GardenPlan; handle: null; fileName: string; assets: ImageAssets } | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `${FILE_EXTENSION},application/zip,application/json`;
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      file
        .arrayBuffer()
        .then((buf) => {
          const { plan, assets } = parseFileBytes(new Uint8Array(buf));
          resolve({ plan, handle: null, fileName: file.name, assets });
        })
        .catch(reject);
    };
    input.click();
  });
}

/** Saves in place when `handle` is given, otherwise behaves like savePlanAs. */
export async function savePlan(plan: GardenPlan, assets: ImageAssets, handle: PlanFileHandle | null): Promise<SaveResult> {
  if (handle) {
    const bytes = await buildArchive(plan, assets);
    const writable = await handle.createWritable();
    await writable.write(bytes);
    await writable.close();
    return { handle, fileName: handle.name, saved: true };
  }
  return savePlanAs(plan, assets);
}

/** Always prompts for a new location/file (or triggers a download as fallback). */
export async function savePlanAs(plan: GardenPlan, assets: ImageAssets): Promise<SaveResult> {
  const bytes = await buildArchive(plan, assets);

  if (fsAccessSupported()) {
    try {
      const newHandle = await (window as any).showSaveFilePicker({ ...PICKER_OPTIONS, suggestedName: suggestedFileName(plan.name) });
      const writable = await newHandle.createWritable();
      await writable.write(bytes);
      await writable.close();
      return { handle: newHandle, fileName: newHandle.name, saved: true };
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return { handle: null, fileName: null, saved: false };
      throw err;
    }
  }

  const fileName = suggestedFileName(plan.name);
  downloadBytes(bytes, fileName);
  return { handle: null, fileName, saved: true };
}

function suggestedFileName(planName: string): string {
  const slug = planName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'garden-plan';
  return `${slug}${FILE_EXTENSION}`;
}

function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
