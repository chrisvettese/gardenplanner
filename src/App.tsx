import { useCallback, useEffect, useRef, useState } from 'react';
import Toolbar from './components/Toolbar';
import GardenCanvas from './canvas/GardenCanvas';
import { useGardenPlan } from './state/useGardenPlan';
import { CELL_SIZE, MAX_SCALE, MIN_SCALE, type Viewport } from './canvas/constants';
import { openPlanFile, savePlan, savePlanAs, type PlanFileHandle } from './io/fileIO';
import { getImageFileFromClipboard, processImageFile } from './io/clipboardImage';
import { registerImageBlob, releaseImageBlob, resetImageAssets, type ImageAssets } from './io/imageAssets';
import type { Cell } from './types';
import './App.css';

const TOOLBAR_HEIGHT = 56;

function computeFitViewport(cells: Cell[]): Viewport {
  const viewW = window.innerWidth;
  const viewH = window.innerHeight - TOOLBAR_HEIGHT;

  if (cells.length === 0) {
    return { offsetX: viewW / 2, offsetY: viewH / 2, scale: 1 };
  }

  const minX = Math.min(...cells.map((c) => c.x));
  const maxX = Math.max(...cells.map((c) => c.x));
  const minY = Math.min(...cells.map((c) => c.y));
  const maxY = Math.max(...cells.map((c) => c.y));
  const worldW = (maxX - minX + 1) * CELL_SIZE;
  const worldH = (maxY - minY + 1) * CELL_SIZE;
  const padding = 96;
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.min((viewW - padding) / worldW, (viewH - padding) / worldH)));
  const worldCenterX = ((minX + maxX + 1) / 2) * CELL_SIZE;
  const worldCenterY = ((minY + maxY + 1) / 2) * CELL_SIZE;

  return { scale, offsetX: viewW / 2 - worldCenterX * scale, offsetY: viewH / 2 - worldCenterY * scale };
}

export default function App() {
  const gp = useGardenPlan();
  const [viewport, setViewport] = useState<Viewport>(() => computeFitViewport([]));
  const [fileHandle, setFileHandle] = useState<PlanFileHandle | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileHandleRef = useRef(fileHandle);
  fileHandleRef.current = fileHandle;
  // Pasted-image blobs, keyed by the blob: URL used as a note's `image`
  // field. Not React state — nothing here needs to trigger a re-render on
  // its own, it just needs to survive across renders. See io/imageAssets.ts.
  const assetsRef = useRef<ImageAssets>(new Map());

  // Warn on tab close/reload if there are unsaved changes — the JSON file
  // is the only persistence, there's no server/autosave to fall back on.
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!gp.dirty) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [gp.dirty]);

  const confirmDiscardIfDirty = useCallback(() => {
    if (!gp.dirty) return true;
    return window.confirm('You have unsaved changes. Discard them?');
  }, [gp.dirty]);

  const handleNew = useCallback(() => {
    if (!confirmDiscardIfDirty()) return;
    resetImageAssets(assetsRef.current);
    gp.newPlan();
    setFileHandle(null);
    setFileName(null);
    setViewport(computeFitViewport([]));
  }, [confirmDiscardIfDirty, gp]);

  const handleOpen = useCallback(async () => {
    if (!confirmDiscardIfDirty()) return;
    const result = await openPlanFile();
    if (!result) return;
    resetImageAssets(assetsRef.current);
    assetsRef.current = result.assets;
    gp.loadPlan(result.plan);
    setFileHandle(result.handle);
    setFileName(result.fileName);
    setViewport(computeFitViewport(result.plan.cells));
  }, [confirmDiscardIfDirty, gp]);

  const handleSave = useCallback(async () => {
    const result = await savePlan(gp.plan, assetsRef.current, fileHandleRef.current);
    if (!result.saved) return;
    setFileHandle(result.handle);
    setFileName(result.fileName);
    gp.markSaved();
  }, [gp]);

  const handleSaveAs = useCallback(async () => {
    const result = await savePlanAs(gp.plan, assetsRef.current);
    if (!result.saved) return;
    setFileHandle(result.handle);
    setFileName(result.fileName);
    gp.markSaved();
  }, [gp]);

  const handleAddNote = useCallback(() => {
    const jitter = () => Math.floor(Math.random() * 40 - 20);
    const worldX = (window.innerWidth / 2 - viewport.offsetX) / viewport.scale + jitter();
    const worldY = ((window.innerHeight - TOOLBAR_HEIGHT) / 2 - viewport.offsetY) / viewport.scale + jitter();
    gp.addNote(Math.round(worldX), Math.round(worldY));
  }, [gp, viewport]);

  const handleDeleteNote = useCallback(
    (id: string) => {
      const note = gp.plan.notes.find((n) => n.id === id);
      if (note?.image) releaseImageBlob(assetsRef.current, note.image);
      gp.deleteNote(id);
    },
    [gp],
  );

  // Paste an image (Ctrl+V) straight from the clipboard as a new note,
  // centered on the current view. Ignored while typing in a text field so
  // normal text pasting there isn't disturbed.
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const file = getImageFileFromClipboard(e);
      if (!file) return;
      e.preventDefault();
      processImageFile(file)
        .then(({ blob, width, height }) => {
          const url = registerImageBlob(assetsRef.current, blob);
          const worldCenterX = (window.innerWidth / 2 - viewport.offsetX) / viewport.scale;
          const worldCenterY = ((window.innerHeight - TOOLBAR_HEIGHT) / 2 - viewport.offsetY) / viewport.scale;
          gp.addNote(Math.round(worldCenterX - width / 2), Math.round(worldCenterY - height / 2), { width, height, image: url });
        })
        .catch((err) => {
          console.error(err);
          window.alert('Could not paste that image.');
        });
    }
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [gp, viewport]);

  const zoomBy = useCallback(
    (factor: number) => {
      const viewW = window.innerWidth;
      const viewH = window.innerHeight - TOOLBAR_HEIGHT;
      const worldCenterX = (viewW / 2 - viewport.offsetX) / viewport.scale;
      const worldCenterY = (viewH / 2 - viewport.offsetY) / viewport.scale;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, viewport.scale * factor));
      setViewport({ scale: newScale, offsetX: viewW / 2 - worldCenterX * newScale, offsetY: viewH / 2 - worldCenterY * newScale });
    },
    [viewport],
  );

  return (
    <div className="gp-app">
      <Toolbar
        planName={gp.plan.name}
        dirty={gp.dirty}
        fileName={fileName}
        scale={viewport.scale}
        canSaveInPlace={!!fileHandle}
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onNameChange={gp.setName}
        onZoomIn={() => zoomBy(1.25)}
        onZoomOut={() => zoomBy(0.8)}
        onFitView={() => setViewport(computeFitViewport(gp.plan.cells))}
        onAddNote={handleAddNote}
      />
      <GardenCanvas
        plan={gp.plan}
        selection={gp.selection}
        recentColors={gp.recentColors}
        viewport={viewport}
        onViewportChange={setViewport}
        onAddCell={gp.addCell}
        onUpdateCell={gp.updateCell}
        onDeleteCell={gp.deleteCell}
        onUpdateNote={gp.updateNote}
        onDeleteNote={handleDeleteNote}
        onSelect={gp.select}
      />
    </div>
  );
}
