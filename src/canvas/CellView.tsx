import type { Cell } from '../types';
import { getPlant } from '../plants/catalog';
import { CELL_SIZE } from './constants';
import PlantIconGrid from './PlantIconGrid';

interface CellViewProps {
  cell: Cell;
  selected: boolean;
  onSelect: () => void;
}

export default function CellView({ cell, selected, onSelect }: CellViewProps) {
  const hasPlants = cell.plants.length > 0;
  const plantNames = hasPlants ? cell.plants.map((id) => getPlant(id)?.label ?? id).join(', ') : '';
  const title = [cell.text, plantNames].filter(Boolean).join(' — ');

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
      title={title}
    >
      {hasPlants && <PlantIconGrid plantIds={cell.plants} />}
      {(!hasPlants || cell.text) && (
        <span
          className={`gp-cell__text${hasPlants ? ' gp-cell__text--overlay' : ''}`}
          style={{ fontSize: cell.fontSize }}
        >
          {cell.text}
        </span>
      )}
    </div>
  );
}
