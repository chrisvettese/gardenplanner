import { useRef } from 'react';
import Markdown from 'markdown-to-jsx';
import type { Note } from '../types';

const MIN_NOTE_SIZE = 48;

interface NoteViewProps {
  note: Note;
  selected: boolean;
  scale: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
}

export default function NoteView({ note, selected, scale, onSelect, onMove, onResize }: NoteViewProps) {
  const dragState = useRef<{ startScreenX: number; startScreenY: number; startX: number; startY: number; moved: boolean } | null>(null);
  const resizeState = useRef<{ startScreenX: number; startScreenY: number; startWidth: number; startHeight: number } | null>(null);

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

  function handleResizePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    resizeState.current = { startScreenX: e.clientX, startScreenY: e.clientY, startWidth: note.width, startHeight: note.height };
  }

  function handleResizePointerMove(e: React.PointerEvent) {
    const resize = resizeState.current;
    if (!resize) return;
    const dx = (e.clientX - resize.startScreenX) / scale;
    const dy = (e.clientY - resize.startScreenY) / scale;
    // Scale both dimensions together by how far the corner moved along the
    // box's own diagonal, rather than letting width/height track dx/dy
    // independently — that let a mostly-horizontal or -vertical drag distort
    // the box out of its original proportions instead of just resizing it.
    const startDiagonal = Math.hypot(resize.startWidth, resize.startHeight);
    const newDiagonal = Math.hypot(resize.startWidth + dx, resize.startHeight + dy);
    const minScale = MIN_NOTE_SIZE / Math.min(resize.startWidth, resize.startHeight);
    const scaleFactor = Math.max(minScale, newDiagonal / startDiagonal);
    onResize(Math.round(resize.startWidth * scaleFactor), Math.round(resize.startHeight * scaleFactor));
  }

  function handleResizePointerUp(e: React.PointerEvent) {
    e.stopPropagation();
    resizeState.current = null;
  }

  return (
    <div
      className={`gp-note${selected ? ' gp-note--selected' : ''}`}
      style={{ left: note.x, top: note.y, width: note.width, height: note.height, background: note.color }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {note.image && <img src={note.image} alt="" className="gp-note__image" draggable={false} />}
      {(note.text || !note.image) && (
        <div className={`gp-note__text${note.image ? ' gp-note__text--caption' : ''}`}>
          {note.text ? (
            note.markdown ? (
              <Markdown options={{ disableParsingRawHTML: true, forceBlock: true }} className="gp-note__markdown">
                {note.text}
              </Markdown>
            ) : (
              note.text
            )
          ) : (
            note.image ? '' : 'Note'
          )}
        </div>
      )}
      {selected && (
        <div
          className="gp-note__resize-handle"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          title="Drag to resize"
        />
      )}
    </div>
  );
}
