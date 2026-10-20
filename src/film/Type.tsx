// Kinetic typography: headlines, lower third, workflow labels, qualifier.
import React from "react";
import { easeIn, p } from "./lib";
import { DISPLAY, F } from "./theme";

/** Headline revealed through a mask, line by line; leaves upward. */
export const Headline: React.FC<{
  t: number;
  at: number;
  out: number;
  lines: string[];
  size?: number;
  color?: string;
  accent?: number; // index of a line drawn in the accent colour
  accentColor?: string;
  style?: React.CSSProperties;
  align?: "left" | "center";
}> = ({ t, at, out, lines, size = 64, color = F.white, accent, accentColor = F.cyan, style, align = "left" }) => (
  <div style={{ position: "absolute", fontFamily: DISPLAY, textAlign: align, ...style }}>
    {lines.map((ln, i) => {
      const a = p(t, at + i * 0.12, 0.55);
      const o = p(t, out - 0.35 + i * 0.05, 0.35, easeIn);
      return (
        <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.08 }}>
          <div
            style={{
              fontSize: size,
              fontWeight: 650,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
              color: i === accent ? accentColor : color,
              transform: `translateY(${(1 - a) * 105 - o * 105}%)`,
            }}
          >
            {ln}
          </div>
        </div>
      );
    })}
  </div>
);

/** Small uppercase label with a leading rule. */
export const Kicker: React.FC<{ t: number; at: number; out: number; text: string; color?: string; style?: React.CSSProperties }> = ({
  t,
  at,
  out,
  text,
  color = F.mist,
  style,
}) => {
  const a = p(t, at, 0.5);
  const o = p(t, out - 0.3, 0.3, easeIn);
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: DISPLAY,
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: "0.18em",
        color,
        opacity: a * (1 - o),
        ...style,
      }}
    >
      <span style={{ width: 36 * a, height: 2, background: color, display: "inline-block" }} />
      {text}
    </div>
  );
};

export const LowerThird: React.FC<{ t: number; at: number; out: number; name: string; role: string; style?: React.CSSProperties }> = ({
  t,
  at,
  out,
  name,
  role,
  style,
}) => {
  const bar = p(t, at, 0.6);
  const n = p(t, at + 0.15, 0.6);
  const r = p(t, at + 0.3, 0.6);
  const o = p(t, out - 0.4, 0.4, easeIn);
  return (
    <div style={{ position: "absolute", fontFamily: DISPLAY, opacity: 1 - o, ...style }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 20 }}>
        <span style={{ width: 3, background: F.cyan, transform: `scaleY(${bar})`, transformOrigin: "top" }} />
        <div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: "0.14em", color: F.white, transform: `translateY(${(1 - n) * 100}%)` }}>{name}</div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "0.22em", color: F.mist, marginTop: 6, transform: `translateY(${(1 - r) * 100}%)` }}>
              {role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Unobtrusive honesty note. */
export const Qualifier: React.FC<{ opacity: number; dark?: boolean; text?: string; style?: React.CSSProperties }> = ({
  opacity,
  dark,
  text = "Concept prototype · Sample data",
  style,
}) => (
  <div
    style={{
      position: "absolute",
      right: 72,
      bottom: 34,
      fontFamily: DISPLAY,
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: "0.04em",
      color: dark ? "rgba(29,45,62,.55)" : "rgba(255,255,255,.42)",
      opacity,
      ...style,
    }}
  >
    {text}
  </div>
);

/** The Promo Pulse mark: a pulse line in a rounded square. */
export const Mark: React.FC<{ size: number; draw?: number; style?: React.CSSProperties }> = ({ size, draw = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", flex: "none", ...style }}>
    <rect x={0} y={0} width={48} height={48} rx={13} fill={F.cyan} />
    <path
      d="M 9 24 H 16 L 20.5 13 L 27.5 35 L 32 24 H 39"
      fill="none"
      stroke="#fff"
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);
