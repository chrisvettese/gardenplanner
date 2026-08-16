import type { SVGProps } from 'react';

/** Every plant icon shares a 32x32 viewBox and fills its container. */
type IconProps = SVGProps<SVGSVGElement>;

const svgProps = { viewBox: '0 0 32 32', width: '100%', height: '100%', xmlns: 'http://www.w3.org/2000/svg' } as const;
// A soft dark outline keeps shapes readable against similarly-toned square backgrounds.
const outline = { stroke: 'rgba(0,0,0,0.3)', strokeWidth: 0.7, strokeLinejoin: 'round' as const };

export function TomatoIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="16" cy="18" r="10" fill="#d94a3d" {...outline} />
      <path d="M16 8c-1.5 -2.5 -4.5 -3 -6 -1.5c1.8 0.2 2.6 1 3.2 2.2z" fill="#5a9e52" {...outline} />
      <path d="M16 8c1.5 -2.5 4.5 -3 6 -1.5c-1.8 0.2 -2.6 1 -3.2 2.2z" fill="#5a9e52" {...outline} />
      <path d="M16 8.5c-0.6 -1.6 -0.4 -2.8 0.4 -3.7c0.7 1 0.8 2.2 0.2 3.7z" fill="#5a9e52" {...outline} />
    </svg>
  );
}

export function PepperIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path
        d="M14 6c-1 1.5 -1.5 2.7 -1 3.6c-3 1 -5.4 4.6 -5.4 8.8c0 5.6 4.3 9.3 8.4 9.3c4.1 0 8.4 -3.7 8.4 -9.3c0 -4.2 -2.4 -7.8 -5.4 -8.8c0.5 -0.9 0 -2.1 -1 -3.6z"
        fill="#63a83f"
        {...outline}
      />
      <rect x="14.3" y="3.6" width="3.4" height="3.6" rx="1" fill="#7a5230" {...outline} />
    </svg>
  );
}

export function MelonIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <ellipse cx="16" cy="17" rx="12" ry="9" fill="#d8a24a" {...outline} />
      <path d="M6 13c4 3 16 3 20 0" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M5 18c4 3 18 3 22 0" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M8 23c3 2 13 2 16 0" fill="none" stroke="#a9762c" strokeWidth="1" />
      <rect x="14.6" y="7.4" width="2.8" height="3" rx="1" fill="#5a9e52" />
    </svg>
  );
}

export function WatermelonIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M4 6Q16 2 28 6L16 28Z" fill="#3f7d3a" {...outline} />
      <path d="M6.4 8Q16 4.8 25.6 8L16 25.5Z" fill="#eef6df" />
      <path d="M8.8 10Q16 7.6 23.2 10L16 23Z" fill="#e0453f" {...outline} />
      <circle cx="13.2" cy="13.5" r="0.8" fill="#1c1c1c" />
      <circle cx="18.8" cy="13.5" r="0.8" fill="#1c1c1c" />
      <circle cx="16" cy="16.5" r="0.8" fill="#1c1c1c" />
      <circle cx="14.2" cy="19.2" r="0.8" fill="#1c1c1c" />
      <circle cx="17.8" cy="19.2" r="0.8" fill="#1c1c1c" />
    </svg>
  );
}

export function FigIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M16 8c-6 0 -9 5.5 -9 10.5c0 6 4 9.5 9 9.5s9 -3.5 9 -9.5c0 -5 -3 -10.5 -9 -10.5z" fill="#7a4a73" {...outline} />
      <path d="M16 8c-1 -2 -1 -4 0.5 -5.5c1 1.3 1 3.2 0 5.5z" fill="#5a9e52" {...outline} />
      <path d="M12 14.5c2 -1 6 -1 8 0" fill="none" stroke="#5a2f52" strokeWidth="1" />
    </svg>
  );
}

export function RaspberryIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <g fill="#b23a5e" {...outline}>
        <circle cx="16" cy="11.6" r="3.1" />
        <circle cx="11.6" cy="14.6" r="3.1" />
        <circle cx="20.4" cy="14.6" r="3.1" />
        <circle cx="13" cy="19" r="3.1" />
        <circle cx="19" cy="19" r="3.1" />
        <circle cx="16" cy="22.4" r="3.1" />
      </g>
      <path d="M16 8c-1.4 -2 -4 -2.4 -5.4 -1c1.6 0.1 2.4 0.8 3 1.8z" fill="#5a9e52" {...outline} />
      <path d="M16 8c1.4 -2 4 -2.4 5.4 -1c-1.6 0.1 -2.4 0.8 -3 1.8z" fill="#5a9e52" {...outline} />
    </svg>
  );
}

export function BeanIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M8 22c-2 -6 2 -14 10 -16c6 -1.6 10 2 9 6c-1 4 -6 4 -9 7c-4 4 -3 8 -10 3z" fill="#4f9153" {...outline} />
      <path d="M11 19c1.5 -2 3.5 -3.5 6 -5" fill="none" stroke="#39643f" strokeWidth="1" strokeLinecap="round" />
      <path d="M13.5 22c1.2 -1.6 3 -3 5 -4.2" fill="none" stroke="#39643f" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function SunflowerIcon(props: IconProps) {
  const petalAngles = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <svg {...svgProps} {...props}>
      <g fill="#f2b705" {...outline}>
        {petalAngles.map((angle) => (
          <ellipse key={angle} cx="16" cy="7" rx="2.5" ry="5.2" transform={`rotate(${angle} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="5.2" fill="#6b4423" {...outline} />
    </svg>
  );
}

export function BasilIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M16 27c0 -8 0 -14 0 -19" fill="none" stroke="#3a7040" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 13c-5 -1 -8 -5 -7 -9c4 1 7 4 7 9z" fill="#5da33b" {...outline} />
      <path d="M16 13c5 -1 8 -5 7 -9c-4 1 -7 4 -7 9z" fill="#6fb84a" {...outline} />
      <path d="M16 19c-4 -0.6 -6.5 -3.6 -5.8 -7c3.2 0.8 5.6 3.2 5.8 7z" fill="#5da33b" {...outline} />
      <path d="M16 19c4 -0.6 6.5 -3.6 5.8 -7c-3.2 0.8 -5.6 3.2 -5.8 7z" fill="#6fb84a" {...outline} />
    </svg>
  );
}

export function OnionIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M16 8c5 3 7 8 7 12c0 5 -3.2 8 -7 8s-7 -3 -7 -8c0 -4 2 -9 7 -12z" fill="#b48ac0" {...outline} />
      <path d="M16 8c-0.6 -2.4 -0.4 -4 0.6 -5.4c0.8 1.2 0.9 3 0.2 5.4z" fill="#5a9e52" {...outline} />
      <path d="M11.5 26c-0.6 1.6 -0.6 2.8 0 3.6" fill="none" stroke="#8a6a3a" strokeWidth="1" strokeLinecap="round" />
      <path d="M14.3 27c-0.4 1.4 -0.4 2.4 0 3" fill="none" stroke="#8a6a3a" strokeWidth="1" strokeLinecap="round" />
      <path d="M17.7 27c0.4 1.4 0.4 2.4 0 3" fill="none" stroke="#8a6a3a" strokeWidth="1" strokeLinecap="round" />
      <path d="M20.5 26c0.6 1.6 0.6 2.8 0 3.6" fill="none" stroke="#8a6a3a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
