// A chilled dairy case drawn in SVG: yogurt tubs, milk cartons, kefir bottles
// and cheese packs. Generic, unbranded packaging in a muted editorial palette.
import React from "react";

const PACK = {
  cream: "#EDE8DF",
  creamShade: "#D3CCC0",
  lid: "#DCD5C9",
  blue: "#5D86B8",
  sage: "#8FAE9A",
  butter: "#E3C77A",
  berry: "#B87A8A",
  slate: "#6C7B8C",
  cyan: "#2EA8FF",
};

export const Tub: React.FC<{ x: number; y: number; s?: number; band: string; focus?: boolean }> = ({ x, y, s = 1, band }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={50} ry={6} fill="#000" opacity={0.35} />
    <path d="M -44 -96 L 44 -96 L 36 -4 Q 0 4 -36 -4 Z" fill={PACK.cream} />
    <path d="M 14 -96 L 44 -96 L 36 -4 Q 26 -1 16 0 Z" fill={PACK.creamShade} opacity={0.7} />
    <path d="M -42 -72 L 42 -72 L 39.4 -44 L -39.4 -44 Z" fill={band} />
    <rect x={-26} y={-34} width={30} height={4} rx={2} fill="#9A9184" opacity={0.6} />
    <rect x={-26} y={-26} width={20} height={4} rx={2} fill="#9A9184" opacity={0.45} />
    <rect x={-50} y={-106} width={100} height={12} rx={4} fill={PACK.lid} />
    <rect x={-50} y={-106} width={100} height={3} rx={1.5} fill="#FFFFFF" opacity={0.5} />
  </g>
);

export const Carton: React.FC<{ x: number; y: number; band: string }> = ({ x, y, band }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={44} ry={6} fill="#000" opacity={0.35} />
    <path d="M -38 -150 L 38 -150 L 38 0 L -38 0 Z" fill={PACK.cream} />
    <path d="M 8 -150 L 38 -150 L 38 0 L 8 0 Z" fill={PACK.creamShade} opacity={0.6} />
    <path d="M -38 -150 L -20 -178 L 20 -178 L 38 -150 Z" fill="#E2DCD0" />
    <path d="M -20 -178 L 20 -178 L 20 -186 L -20 -186 Z" fill="#D2CBBE" />
    <path d="M -38 -112 L 38 -112 L 38 -70 L -38 -70 Z" fill={band} />
    <rect x={-26} y={-56} width={36} height={4} rx={2} fill="#9A9184" opacity={0.55} />
  </g>
);

export const Bottle: React.FC<{ x: number; y: number; band: string }> = ({ x, y, band }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={30} ry={5} fill="#000" opacity={0.35} />
    <path d="M -26 -112 C -26 -128 -12 -136 -10 -150 L 10 -150 C 12 -136 26 -128 26 -112 L 26 -6 Q 0 2 -26 -6 Z" fill={PACK.cream} />
    <path d="M 6 -150 L 10 -150 C 12 -136 26 -128 26 -112 L 26 -6 Q 16 -2 8 -2 Z" fill={PACK.creamShade} opacity={0.6} />
    <rect x={-12} y={-164} width={24} height={16} rx={4} fill={band} />
    <path d="M -26 -96 L 26 -96 L 26 -58 L -26 -58 Z" fill={band} opacity={0.85} />
  </g>
);

export const CheesePack: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={56} ry={6} fill="#000" opacity={0.35} />
    <rect x={-54} y={-52} width={108} height={52} rx={8} fill="#E9DCB2" />
    <rect x={-54} y={-52} width={108} height={14} rx={6} fill={PACK.butter} />
    <path d="M -40 -30 L 30 -30 L 40 -10 L -30 -10 Z" fill="#F0C75A" opacity={0.8} />
  </g>
);

/** Full shelf; returns the scene in 1920×1080 space. The focus tub sits at (960, 600). */
export const ShelfArt: React.FC<{ dim: number }> = ({ dim }) => {
  const rows = [380, 640, 900];
  const others = (row: number, k: number) => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < 12; i++) {
      const x = -120 + i * 190 + (row % 2) * 60;
      const kind = (i + k) % 4;
      if (row === 640 && Math.abs(x - 960) < 140) continue; // the focus tub goes here
      if (kind === 0) items.push(<Tub key={i} x={x} y={row} band={[PACK.blue, PACK.berry, PACK.sage][(i + k) % 3]} />);
      if (kind === 1) items.push(<Carton key={i} x={x} y={row} band={[PACK.blue, PACK.sage, PACK.slate][(i + k) % 3]} />);
      if (kind === 2) items.push(<Bottle key={i} x={x} y={row} band={[PACK.berry, PACK.butter, PACK.sage][(i + k) % 3]} />);
      if (kind === 3) items.push(<CheesePack key={i} x={x} y={row} />);
    }
    return items;
  };
  return (
    <g>
      {/* back wall of the case with cool LED light */}
      <rect x={-400} y={-200} width={2800} height={1500} fill="#0E141B" />
      <rect x={-400} y={120} width={2800} height={6} fill="#CFE8FF" opacity={0.55} />
      <rect x={-400} y={126} width={2800} height={140} fill="url(#ledFall)" />
      {rows.map((ry, r) => (
        <g key={ry}>
          <g opacity={1 - dim * 0.7}>{others(ry, r)}</g>
          {/* shelf lip */}
          <rect x={-400} y={ry} width={2800} height={18} fill="#1D2630" />
          <rect x={-400} y={ry} width={2800} height={2} fill="#8FB4D6" opacity={0.35} />
          <rect x={-400} y={ry + 18} width={2800} height={40} fill="#0A0E13" opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

export const ShelfDefs: React.FC = () => (
  <defs>
    <linearGradient id="ledFall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9CCBFF" stopOpacity={0.18} />
      <stop offset="1" stopColor="#9CCBFF" stopOpacity={0} />
    </linearGradient>
  </defs>
);
