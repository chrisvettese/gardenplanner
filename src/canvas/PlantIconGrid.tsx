import { getPlant } from '../plants/catalog';

interface PlantIconGridProps {
  plantIds: string[];
  /** Swaps rows/columns — e.g. 2 plants normally sit side-by-side; rotated,
   * they stack. No effect on counts (like 4 or 9) that are already square. */
  rotated?: boolean;
}

/** Lays out 1-9 plant icons in a near-square grid that gets denser (and each
 * icon smaller) as more plants are added — 1 big icon, 4 in a 2x2, 9 in 3x3. */
export default function PlantIconGrid({ plantIds, rotated }: PlantIconGridProps) {
  if (plantIds.length === 0) return null;
  const baseCols = Math.ceil(Math.sqrt(plantIds.length));
  const baseRows = Math.ceil(plantIds.length / baseCols);
  const cols = rotated ? baseRows : baseCols;

  return (
    <div className="gp-plant-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {plantIds.map((id, i) => {
        const plant = getPlant(id);
        if (!plant) return null;
        const Icon = plant.Icon;
        return (
          <div className="gp-plant-grid__slot" key={`${id}-${i}`}>
            <Icon />
          </div>
        );
      })}
    </div>
  );
}
