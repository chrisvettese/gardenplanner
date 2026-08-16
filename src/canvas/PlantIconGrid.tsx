import { getPlant } from '../plants/catalog';

interface PlantIconGridProps {
  plantIds: string[];
}

/** Lays out 1-9 plant icons in a near-square grid that gets denser (and each
 * icon smaller) as more plants are added — 1 big icon, 4 in a 2x2, 9 in 3x3. */
export default function PlantIconGrid({ plantIds }: PlantIconGridProps) {
  if (plantIds.length === 0) return null;
  const cols = Math.ceil(Math.sqrt(plantIds.length));

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
