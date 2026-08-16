import type { ComponentType, SVGProps } from 'react';
import {
  BeanIcon,
  CeleryIcon,
  ClementineIcon,
  FigIcon,
  GenoveseBasilIcon,
  HeliotropeIcon,
  MandevillaIcon,
  MelonIcon,
  MorningGloryIcon,
  OnionIcon,
  PelargoniumIcon,
  PepperIcon,
  RaspberryIcon,
  RosemaryIcon,
  SunflowerIcon,
  ThaiBasilIcon,
  TomatoIcon,
  WatermelonIcon,
} from './icons';

export interface Plant {
  id: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const MAX_PLANTS_PER_CELL = 9;

export const PLANT_CATALOG: Plant[] = [
  { id: 'tomato', label: 'Tomato', Icon: TomatoIcon },
  { id: 'pepper', label: 'Pepper', Icon: PepperIcon },
  { id: 'melon', label: 'Melon', Icon: MelonIcon },
  { id: 'watermelon', label: 'Watermelon', Icon: WatermelonIcon },
  { id: 'fig', label: 'Fig', Icon: FigIcon },
  { id: 'clementine', label: 'Clementine', Icon: ClementineIcon },
  { id: 'raspberry', label: 'Raspberry', Icon: RaspberryIcon },
  { id: 'bean', label: 'Bean', Icon: BeanIcon },
  { id: 'celery', label: 'Celery', Icon: CeleryIcon },
  { id: 'onion', label: 'Onion', Icon: OnionIcon },
  { id: 'basil-genovese', label: 'Genovese Basil', Icon: GenoveseBasilIcon },
  { id: 'basil-thai', label: 'Thai Basil', Icon: ThaiBasilIcon },
  { id: 'rosemary', label: 'Rosemary', Icon: RosemaryIcon },
  { id: 'sunflower', label: 'Sunflower', Icon: SunflowerIcon },
  { id: 'morning-glory', label: 'Morning Glory', Icon: MorningGloryIcon },
  { id: 'mandevilla', label: 'Mandevilla', Icon: MandevillaIcon },
  { id: 'heliotrope', label: 'Heliotrope', Icon: HeliotropeIcon },
  { id: 'pelargonium', label: 'Pelargonium', Icon: PelargoniumIcon },
];

const BY_ID = new Map(PLANT_CATALOG.map((p) => [p.id, p]));

export function getPlant(id: string): Plant | undefined {
  return BY_ID.get(id);
}
