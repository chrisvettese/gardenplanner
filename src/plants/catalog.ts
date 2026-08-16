import type { ComponentType, SVGProps } from 'react';
import { BasilIcon, BeanIcon, FigIcon, MelonIcon, OnionIcon, PepperIcon, RaspberryIcon, SunflowerIcon, TomatoIcon, WatermelonIcon } from './icons';

export interface Plant {
  id: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const MAX_PLANTS_PER_CELL = 9;

// MVP set of 10 common garden plants. Easy to extend later.
export const PLANT_CATALOG: Plant[] = [
  { id: 'tomato', label: 'Tomato', Icon: TomatoIcon },
  { id: 'pepper', label: 'Pepper', Icon: PepperIcon },
  { id: 'melon', label: 'Melon', Icon: MelonIcon },
  { id: 'watermelon', label: 'Watermelon', Icon: WatermelonIcon },
  { id: 'fig', label: 'Fig', Icon: FigIcon },
  { id: 'raspberry', label: 'Raspberry', Icon: RaspberryIcon },
  { id: 'bean', label: 'Bean', Icon: BeanIcon },
  { id: 'sunflower', label: 'Sunflower', Icon: SunflowerIcon },
  { id: 'basil', label: 'Basil', Icon: BasilIcon },
  { id: 'onion', label: 'Onion', Icon: OnionIcon },
];

const BY_ID = new Map(PLANT_CATALOG.map((p) => [p.id, p]));

export function getPlant(id: string): Plant | undefined {
  return BY_ID.get(id);
}
