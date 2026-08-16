import { useRef } from 'react';
import type { Note } from '../types';

interface NoteViewProps {
  note: Note;
  selected: boolean;
  scale: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}

export default function NoteView({ note, selected, scale, onSelect, onMove }: NoteViewProps) {
  const dragState = useRef<{ startScreenX: number; startScreenY: number; startX: number; startY: number; moved: boolean } | null>(null);

  function handlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startScreenX: e.clientX, startScreenY: e.clientY, startX: note.x, startY: note.y, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragState.current;
    if (!drag) return;
    const dx = (e.clientX - drag.startScreenX) / scale;
    const dy = (e.clientY - drag.startScreenY) / scale;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true;
    if (drag.moved) onMove(drag.startX + dx, drag.startY + dy);
  }

  function handlePointerUp(e: React.PointerEvent) {
    e.stopPropagation();
    if (!dragState.current?.moved) onSelect();
    dragState.current = null;
  }

  return (
    <div
      className={`gp-note${selected ? ' gp-note--selected' : ''}`}
      style={{ left: note.x, top: note.y, width: note.width, height: note.height, background: note.color }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="gp-note__text">{note.text || 'Note'}</div>
    </div>
  );
}
