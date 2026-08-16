import type { Cell } from '../types';
import { CELL_SIZE } from './constants';

interface CellViewProps {
  cell: Cell;
  selected: boolean;
  onSelect: () => void;
}

export default function CellView({ cell, selected, onSelect }: CellViewProps) {
  return (
    <div
      className={`gp-cell${selected ? ' gp-cell--selected' : ''}`}
      style={{
        left: cell.x * CELL_SIZE,
        top: cell.y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        background: cell.color,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      title={cell.text}
    >
      <span className="gp-cell__text">{cell.text}</span>
    </div>
  );
}
