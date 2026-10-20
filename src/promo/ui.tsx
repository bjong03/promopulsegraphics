// Fiori building blocks, styled like the prototype's CSS.
import React from "react";
import { C, SHADOW } from "./theme";

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: C.surface,
      borderRadius: 16,
      boxShadow: SHADOW,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 0,
      border: "2px solid transparent",
      ...style,
    }}
  >
    {children}
  </div>
);

const TAG: Record<string, [string, string]> = {
  neg: [C.bad, C.badSoft],
  crit: [C.warn, C.warnSoft],
  pos: [C.good, C.goodSoft],
  info: [C.accent, C.accentSoft],
  none: [C.muted, C.sunk],
};

export const Tag: React.FC<{ tone: keyof typeof TAG; small?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({
  tone,
  small,
  style,
  children,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: small ? 11 : 12,
      fontWeight: 700,
      borderRadius: 6,
      padding: small ? "1px 6px" : "2px 8px",
      whiteSpace: "nowrap",
      lineHeight: 1.45,
      color: TAG[tone][0],
      background: TAG[tone][1],
      ...style,
    }}
  >
    {children}
  </span>
);

export const Btn: React.FC<{
  primary?: boolean;
  ghost?: boolean;
  size?: "small" | "lg";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ primary, ghost, size, style, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      minHeight: size === "small" ? 30 : size === "lg" ? 44 : 36,
      padding: size === "small" ? "0 10px" : size === "lg" ? "0 20px" : "0 14px",
      borderRadius: size === "lg" ? 10 : 8,
      border: `1px solid ${primary ? C.accentFill : ghost ? "transparent" : C.field}`,
      background: primary ? C.accentFill : ghost ? "transparent" : C.surface,
      color: primary ? C.onAccent : C.accent,
      fontWeight: 700,
      fontSize: size === "small" ? 12.5 : size === "lg" ? 15 : 13.5,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

/** Track with one or more filled segments. `p` scales the fill (0–1) for grow-in. */
export const Bar: React.FC<{ segs: { w: number; color: string }[]; h?: number; p?: number }> = ({ segs, h = 8, p = 1 }) => (
  <div style={{ height: h, borderRadius: h / 2, background: C.track, overflow: "hidden", display: "flex", gap: 2 }}>
    {segs.map((s, i) => (
      <i key={i} style={{ display: "block", height: "100%", borderRadius: h / 2, width: `${s.w * p}%`, background: s.color }} />
    ))}
  </div>
);

export const Small: React.FC<{ muted?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({ muted, style, children }) => (
  <span style={{ fontSize: 12.5, color: muted ? C.muted : undefined, ...style }}>{children}</span>
);

export const Row: React.FC<{ between?: boolean; gap?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  between,
  gap = 8,
  style,
  children,
}) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center", justifyContent: between ? "space-between" : undefined, ...style }}>
    {children}
  </div>
);

export const Num: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>
);
