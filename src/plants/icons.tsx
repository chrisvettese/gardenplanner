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
  // Stereotypical red chili: a solid tapered body (wide shoulder, fine
  // point), not a uniform-width green tube — that read as a cucumber.
  // The curled green stem is the other big identifying feature.
  return (
    <svg {...svgProps} {...props}>
      <path
        d="M13 10C11 13 11 17 13 20C15 23 17 26 20.5 29C19.5 25 19.5 20 19 16C18.6 13 18 10.5 17 9C15.5 8.3 14 8.5 13 10Z"
        fill="#e0392f"
        {...outline}
      />
      <path d="M13.6 12c-1 2 -1 4.6 0.4 6.8" fill="none" stroke="#f28b7e" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      <path
        d="M15 9c0 -2.5 0 -4 1 -5c1.3 -1.3 3 -1 3 0.5c0 1.2 -1.3 1.6 -2.2 0.8"
        fill="none"
        stroke="#4a7a3a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MelonIcon(props: IconProps) {
  // Ribbed melons read as slim and long, not flat and wide — the body is
  // an elongated (taller-than-wide) oval, with ribs running pole-to-pole
  // and a soft highlight down one side for a bit of roundness.
  return (
    <svg {...svgProps} {...props}>
      <ellipse cx="16" cy="17" rx="8.5" ry="12" fill="#d9a545" {...outline} />
      <path d="M16 5Q8.5 17 16 29" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M16 5Q12 17 16 29" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M16 5L16 29" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M16 5Q20 17 16 29" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M16 5Q23.5 17 16 29" fill="none" stroke="#a9762c" strokeWidth="1" />
      <path d="M16 6Q11 16 16 27" fill="none" stroke="#f0dba8" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
      <rect x="14.7" y="3" width="2.6" height="3" rx="1" fill="#5a9e52" />
    </svg>
  );
}

export function CarrotIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 11C11 16 12 22 16 29C20 22 21 16 20 11C17.5 9.5 14.5 9.5 12 11Z" fill="#e8792c" {...outline} />
      <path d="M14.5 14c0.4 4 0.9 7.4 1.5 10.4" fill="none" stroke="#c65f1a" strokeWidth="0.8" opacity="0.6" />
      <path d="M17.5 14c-0.4 4 -0.9 7.4 -1.5 10.4" fill="none" stroke="#c65f1a" strokeWidth="0.8" opacity="0.6" />
      <g stroke="#4a8a3a" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 11c0 -3.4 0 -6.4 0 -9" />
        <path d="M16 11c-1.6 -2.8 -2.2 -5.4 -1.6 -8" />
        <path d="M16 11c1.6 -2.8 2.2 -5.4 1.6 -8" />
      </g>
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

// Genovese: the classic broad, rounded Italian basil leaf, all green.
export function GenoveseBasilIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M16 27c0 -8 0 -14 0 -19" fill="none" stroke="#3a7040" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 12c-5.5 -1 -9 -5.5 -8 -10c4.5 1 8 4.5 8 10z" fill="#5da33b" {...outline} />
      <path d="M16 12c5.5 -1 9 -5.5 8 -10c-4.5 1 -8 4.5 -8 10z" fill="#6fb84a" {...outline} />
      <path d="M16 19c-4.5 -0.6 -7 -3.8 -6.2 -7.4c3.4 0.8 6 3.4 6.2 7.4z" fill="#5da33b" {...outline} />
      <path d="M16 19c4.5 -0.6 7 -3.8 6.2 -7.4c-3.4 0.8 -6 3.4 -6.2 7.4z" fill="#6fb84a" {...outline} />
    </svg>
  );
}

// Thai: narrower, pointier leaves plus the purple stem/flower spike that
// distinguishes Thai basil from Genovese at a glance.
export function ThaiBasilIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M16 27c0 -7 0 -12 0 -16" fill="none" stroke="#6a4a72" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 15c-3.6 -2.6 -5 -6.4 -3.4 -9.4c3 1.6 4.6 4.8 3.4 9.4z" fill="#4a8a3a" {...outline} />
      <path d="M16 15c3.6 -2.6 5 -6.4 3.4 -9.4c-3 1.6 -4.6 4.8 -3.4 9.4z" fill="#5a9e46" {...outline} />
      <path d="M16 20.5c-3 -1.6 -4.4 -4.4 -3.4 -7c2.6 1.2 4 3.4 3.4 7z" fill="#4a8a3a" {...outline} />
      <path d="M16 20.5c3 -1.6 4.4 -4.4 3.4 -7c-2.6 1.2 -4 3.4 -3.4 7z" fill="#5a9e46" {...outline} />
      <g fill="#8a5fb0" {...outline}>
        <circle cx="16" cy="6" r="1.1" />
        <circle cx="14.7" cy="8" r="1" />
        <circle cx="17.3" cy="8" r="1" />
      </g>
    </svg>
  );
}

export function RosemaryIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M16 27c0 -7 0 -14 0 -19" fill="none" stroke="#5a7a4a" strokeWidth="1.3" strokeLinecap="round" />
      <g stroke="#4a7a3a" strokeWidth="1.4" strokeLinecap="round">
        <path d="M16 10l-4 -2" />
        <path d="M16 10l4 -2" />
        <path d="M16 13l-4.5 -1.5" />
        <path d="M16 13l4.5 -1.5" />
        <path d="M16 16l-4.5 -1" />
        <path d="M16 16l4.5 -1" />
        <path d="M16 19l-4 -0.5" />
        <path d="M16 19l4 -0.5" />
        <path d="M16 22l-3.5 0" />
        <path d="M16 22l3.5 0" />
      </g>
      <circle cx="16" cy="7.5" r="1.4" fill="#8a7fd8" {...outline} />
    </svg>
  );
}

export function CeleryIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="10.5" y="12" width="3" height="16" rx="1.5" fill="#c3d98a" {...outline} />
      <rect x="14.5" y="10" width="3" height="18" rx="1.5" fill="#cfe49a" {...outline} />
      <rect x="18.5" y="12" width="3" height="16" rx="1.5" fill="#c3d98a" {...outline} />
      <circle cx="12" cy="10" r="2.2" fill="#5a9e52" {...outline} />
      <circle cx="16" cy="8" r="2.4" fill="#4f9153" {...outline} />
      <circle cx="20" cy="10" r="2.2" fill="#5a9e52" {...outline} />
    </svg>
  );
}

// Morning glory: a flat, fused trumpet disc — the petals never separate,
// they just crease where they would meet, with a pale five-point star
// bleeding out from the throat. Wide open, almost 2D.
export function MorningGloryIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="16" cy="16" r="10" fill="#6a7fd1" {...outline} />
      <path
        d="M16 8.4L18.4 13.6L24 14.2L19.8 18L21 23.6L16 20.8L11 23.6L12.2 18L8 14.2L13.6 13.6Z"
        fill="#8f9fe0"
        opacity="0.85"
      />
      <g stroke="#4f5fb0" strokeWidth="0.7">
        <path d="M16 6L16 26" />
        <path d="M7.5 10.5L24.5 21.5" />
        <path d="M7.5 21.5L24.5 10.5" />
      </g>
      <circle cx="16" cy="16" r="2.6" fill="#eef0fb" />
      <circle cx="16" cy="16" r="1" fill="#f2c94c" />
      <path d="M22 24c2 1 4 3 4 5" fill="none" stroke="#4f9153" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Mandevilla: the opposite silhouette from morning glory — five separate,
// narrow paddle-shaped petals that twist pinwheel-style around the throat
// (each overlapping the next), not a single fused disc. Deep pink, with a
// glossy dark leaf pair (mandevilla's leaves are a distinct ID feature too).
export function MandevillaIcon(props: IconProps) {
  const petalAngles = [0, 72, 144, 216, 288];
  return (
    <svg {...svgProps} {...props}>
      <path d="M9 25c-2 1 -3.5 3 -3.5 5.5" fill="none" stroke="#4f9153" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="10.5" cy="27" rx="2.6" ry="1.6" fill="#3a7040" transform="rotate(-35 10.5 27)" {...outline} />
      <g>
        {petalAngles.map((angle) => (
          <path
            key={angle}
            d="M16 16C12.5 13.2 11 8.6 13.4 4.6C17.5 5.6 19.4 10 18.6 16Z"
            fill="#e0568f"
            transform={`rotate(${angle} 16 16)`}
            {...outline}
          />
        ))}
      </g>
      <circle cx="16" cy="16" r="2" fill="#fde3ee" />
      <circle cx="16" cy="16" r="0.8" fill="#f2c94c" />
    </svg>
  );
}

export function HeliotropeIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <g fill="#7a5fb0" {...outline}>
        <circle cx="16" cy="10.5" r="2.6" />
        <circle cx="11.5" cy="12.5" r="2.6" />
        <circle cx="20.5" cy="12.5" r="2.6" />
        <circle cx="9" cy="16" r="2.6" />
        <circle cx="23" cy="16" r="2.6" />
        <circle cx="13" cy="15.5" r="2.6" />
        <circle cx="19" cy="15.5" r="2.6" />
        <circle cx="16" cy="18.5" r="2.6" />
      </g>
      <path d="M16 24c0 -3.5 0 -5.5 0 -7" fill="none" stroke="#3a7040" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13 27c-1.5 -2 -1.6 -4.4 0 -6c2 1.2 2.6 3.6 0 6z" fill="#5a9e52" {...outline} />
      <path d="M19 27c1.5 -2 1.6 -4.4 0 -6c-2 1.2 -2.6 3.6 0 6z" fill="#5a9e52" {...outline} />
    </svg>
  );
}

// Pelargonium = the classic garden "geranium": a ball of small florets on a
// stem above the plant's characteristic round, scalloped leaf.
export function PelargoniumIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="16" cy="23" r="7.5" fill="#5a9e52" {...outline} />
      <g stroke="#3a7040" strokeWidth="0.6" fill="none">
        <path d="M16 23L16 17" />
        <path d="M16 23L10.5 20" />
        <path d="M16 23L21.5 20" />
        <path d="M16 23L10.8 26.5" />
        <path d="M16 23L21.2 26.5" />
      </g>
      <path d="M16 15c0 -3 0 -5 0 -7" fill="none" stroke="#3a7040" strokeWidth="1.2" strokeLinecap="round" />
      <g fill="#d94a6a" {...outline}>
        <circle cx="16" cy="6.5" r="1.9" />
        <circle cx="13" cy="8" r="1.9" />
        <circle cx="19" cy="8" r="1.9" />
        <circle cx="14.3" cy="10.8" r="1.9" />
        <circle cx="17.7" cy="10.8" r="1.9" />
      </g>
    </svg>
  );
}

export function ClementineIcon(props: IconProps) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="16" cy="18" r="9.5" fill="#f0932b" {...outline} />
      <circle cx="16" cy="18" r="1" fill="#c96f1a" />
      <path d="M16 8.5c3 -3 6 -2 6.5 0.5c-2 -0.6 -3.6 0 -4.6 1.4z" fill="#5a9e52" {...outline} />
      <rect x="15.3" y="7" width="1.4" height="2.5" rx="0.6" fill="#6b4a2a" />
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
