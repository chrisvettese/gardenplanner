import { useCallback, useEffect, useRef, useState } from 'react';
import type { GardenPlan } from '../types';
import CellView from './CellView';
import NoteView from './NoteView';
import EditPopover from './EditPopover';
import { ADD_CELL_MIN_SCALE, ARROW_PAN_STEP, CELL_SIZE, MAX_SCALE, MIN_SCALE, screenToWorld, worldToScreen, type Viewport } from './constants';

type Selection = { type: 'cell' | 'note'; id: string } | null;

interface GardenCanvasProps {
  plan: GardenPlan;
  selection: Selection;
  recentColors: string[];
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  onAddCell: (x: number, y: number) => void;
  onUpdateCell: (id: string, patch: { color?: string; text?: string; fontSize?: number; plants?: string[] }) => void;
  onDeleteCell: (id: string) => void;
  onUpdateNote: (id: string, patch: { color?: string; text?: string; x?: number; y?: number; width?: number; height?: number; markdown?: boolean }) => void;
  onDeleteNote: (id: string) => void;
  onSelect: (selection: Selection) => void;
}

const DRAG_THRESHOLD = 4;

export default function GardenCanvas({
  plan,
  selection,
  recentColors,
  viewport,
  onViewportChange,
  onAddCell,
  onUpdateCell,
  onDeleteCell,
  onUpdateNote,
  onDeleteNote,
  onSelect,
}: GardenCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panState = useRef<{ startClientX: number; startClientY: number; startOffsetX: number; startOffsetY: number; moved: boolean } | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const cellAt = useCallback((x: number, y: number) => plan.cells.find((c) => c.x === x && c.y === y), [plan.cells]);

  function localPoint(e: React.PointerEvent | PointerEvent) {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    panState.current = { startClientX: e.clientX, startClientY: e.clientY, startOffsetX: viewport.offsetX, startOffsetY: viewport.offsetY, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const pan = panState.current;
    if (pan) {
      const dx = e.clientX - pan.startClientX;
      const dy = e.clientY - pan.startClientY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) pan.moved = true;
      if (pan.moved) onViewportChange({ ...viewport, offsetX: pan.startOffsetX + dx, offsetY: pan.startOffsetY + dy });
      return;
    }
    if (viewport.scale >= ADD_CELL_MIN_SCALE) {
      const { x, y } = localPoint(e);
      const world = screenToWorld(x, y, viewport);
      const gx = Math.floor(world.x / CELL_SIZE);
      const gy = Math.floor(world.y / CELL_SIZE);
      setHover(cellAt(gx, gy) ? null : { x: gx, y: gy });
    } else if (hover) {
      setHover(null);
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const pan = panState.current;
    panState.current = null;
    if (!pan) return;
    if (!pan.moved) {
      const { x, y } = localPoint(e);
      const world = screenToWorld(x, y, viewport);
      const gx = Math.floor(world.x / CELL_SIZE);
      const gy = Math.floor(world.y / CELL_SIZE);
      if (viewport.scale >= ADD_CELL_MIN_SCALE && !cellAt(gx, gy)) {
        onAddCell(gx, gy);
      } else {
        onSelect(null);
      }
    }
  }

  // React attaches `onWheel` as a passive native listener, so preventDefault()
  // inside it is silently ignored (and warns). Zooming needs to stop the
  // browser's own page-zoom/scroll, so we register a real non-passive
  // listener instead. A ref keeps it reading fresh viewport/props without
  // having to re-attach on every viewport change.
  const latest = useRef({ viewport, onViewportChange });
  latest.current = { viewport, onViewportChange };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const { viewport, onViewportChange } = latest.current;
      const rect = el!.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const world = screenToWorld(localX, localY, viewport);
      const factor = Math.exp(-e.deltaY * 0.0015);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, viewport.scale * factor));
      onViewportChange({
        scale: newScale,
        offsetX: localX - world.x * newScale,
        offsetY: localY - world.y * newScale,
      });
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Arrow-key panning, ignored while typing in a text field.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const steps: Record<string, [number, number]> = {
        ArrowLeft: [ARROW_PAN_STEP, 0],
        ArrowRight: [-ARROW_PAN_STEP, 0],
        ArrowUp: [0, ARROW_PAN_STEP],
        ArrowDown: [0, -ARROW_PAN_STEP],
      };
      const step = steps[e.key];
      if (!step) return;
      e.preventDefault();
      onViewportChange({ ...viewport, offsetX: viewport.offsetX + step[0], offsetY: viewport.offsetY + step[1] });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewport, onViewportChange]);

  // Delete/Backspace deletes the current selection, unless focus is in a text field.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!selection) return;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (selection.type === 'cell') onDeleteCell(selection.id);
        else onDeleteNote(selection.id);
      } else if (e.key === 'Escape') {
        onSelect(null);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selection, onDeleteCell, onDeleteNote, onSelect]);

  const selectedCell = selection?.type === 'cell' ? plan.cells.find((c) => c.id === selection.id) : undefined;
  const selectedNote = selection?.type === 'note' ? plan.notes.find((n) => n.id === selection.id) : undefined;

  const bgSize = CELL_SIZE * viewport.scale;
  const bgStyle: React.CSSProperties = {
    backgroundSize: `${bgSize}px ${bgSize}px`,
    backgroundPosition: `${viewport.offsetX}px ${viewport.offsetY}px`,
  };

  return (
    <div
      ref={containerRef}
      className="gp-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="gp-canvas__grid" style={bgStyle} />
      <div
        className="gp-canvas__world"
        style={{ transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})` }}
      >
        {hover && (
          <div className="gp-cell gp-cell--ghost" style={{ left: hover.x * CELL_SIZE, top: hover.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }} />
        )}
        {plan.cells.map((cell) => (
          <CellView key={cell.id} cell={cell} selected={selection?.type === 'cell' && selection.id === cell.id} onSelect={() => onSelect({ type: 'cell', id: cell.id })} />
        ))}
        {plan.notes.map((note) => (
          <NoteView
            key={note.id}
            note={note}
            scale={viewport.scale}
            selected={selection?.type === 'note' && selection.id === note.id}
            onSelect={() => onSelect({ type: 'note', id: note.id })}
            onMove={(x, y) => onUpdateNote(note.id, { x, y })}
            onResize={(width, height) => onUpdateNote(note.id, { width, height })}
          />
        ))}
      </div>

      {selectedCell &&
        (() => {
          const pos = worldToScreen(selectedCell.x * CELL_SIZE + CELL_SIZE + 10, selectedCell.y * CELL_SIZE, viewport);
          return (
            <EditPopover
              x={pos.x}
              y={pos.y}
              text={selectedCell.text}
              color={selectedCell.color}
              recentColors={recentColors}
              deleteLabel="Delete square"
              onChangeText={(text) => onUpdateCell(selectedCell.id, { text })}
              onChangeColor={(color) => onUpdateCell(selectedCell.id, { color })}
              onDelete={() => onDeleteCell(selectedCell.id)}
              onClose={() => onSelect(null)}
              fontSize={selectedCell.fontSize}
              onChangeFontSize={(fontSize) => onUpdateCell(selectedCell.id, { fontSize })}
              plants={selectedCell.plants}
              onChangePlants={(plants) => onUpdateCell(selectedCell.id, { plants })}
            />
          );
        })()}

      {selectedNote &&
        (() => {
          const pos = worldToScreen(selectedNote.x + selectedNote.width + 10, selectedNote.y, viewport);
          return (
            <EditPopover
              x={pos.x}
              y={pos.y}
              text={selectedNote.text}
              color={selectedNote.color}
              recentColors={recentColors}
              deleteLabel="Delete note"
              onChangeText={(text) => onUpdateNote(selectedNote.id, { text })}
              onChangeColor={(color) => onUpdateNote(selectedNote.id, { color })}
              onDelete={() => onDeleteNote(selectedNote.id)}
              onClose={() => onSelect(null)}
              markdown={!!selectedNote.markdown}
              onChangeMarkdown={(markdown) => onUpdateNote(selectedNote.id, { markdown })}
            />
          );
        })()}
    </div>
  );
}
