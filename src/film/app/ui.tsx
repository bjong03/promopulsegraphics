// Prototype UI atoms (Fiori Horizon), sized up slightly for 1080p legibility.
import React from "react";
import { P, UI } from "../theme";

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: P.surface,
      borderRadius: 16,
      boxShadow: P.shadow,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      minWidth: 0,
      border: "2px solid transparent",
      ...style,
    }}
  >
    {children}
  </div>
);

const TONES: Record<string, [string, string]> = {
  neg: [P.bad, P.badSoft],
  crit: [P.warn, P.warnSoft],
  pos: [P.good, P.goodSoft],
  info: [P.accent, P.accentSoft],
  none: [P.muted, P.sunk],
};

export const Tag: React.FC<{ tone: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ tone, style, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 7,
      padding: "2px 9px",
      whiteSpace: "nowrap",
      color: TONES[tone][0],
      background: TONES[tone][1],
      ...style,
    }}
  >
    {children}
  </span>
);

export const Btn: React.FC<{ primary?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({ primary, style, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 44,
      padding: "0 20px",
      borderRadius: 10,
      border: `1px solid ${primary ? P.accentFill : P.field}`,
      background: primary ? P.accentFill : P.surface,
      color: primary ? "#fff" : P.accent,
      fontWeight: 700,
      fontSize: 16,
      whiteSpace: "nowrap",
      fontFamily: UI,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Alert: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
    <path d="M12 4.5l8.5 15h-17zM12 10v4.5M12 17.2v.3" />
  </svg>
);

export const Kv: React.FC<{ k: string; v: React.ReactNode; color?: string }> = ({ k, v, color }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{ fontSize: 15, color: P.muted }}>{k}</span>
    <b style={{ fontSize: 19, fontWeight: 600, color: color ?? P.ink, fontVariantNumeric: "tabular-nums" }}>{v}</b>
  </div>
);

export const Bar: React.FC<{ w: number; color: string; h?: number }> = ({ w, color, h = 8 }) => (
  <div style={{ height: h, borderRadius: h / 2, background: P.track, overflow: "hidden" }}>
    <i style={{ display: "block", height: "100%", width: `${w}%`, background: color, borderRadius: h / 2 }} />
  </div>
);

/** Section heading with numbered step badge, as in the prototype. */
export const StepH: React.FC<{ n: number; title: string }> = ({ n, title }) => (
  <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, margin: 0, fontWeight: 700 }}>
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: P.accentFill, color: "#fff", fontSize: 14, display: "grid", placeItems: "center" }}>{n}</span>
    {title}
  </h3>
);
