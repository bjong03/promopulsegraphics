// Promo Pulse brand pieces for the reveal and end card.
import React from "react";
import { Icon } from "./icons";
import { C, FONT } from "./theme";

/** The app's mark: pulse glyph in a rounded blue square. */
export const Mark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: C.accentFill,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      boxShadow: `0 ${size * 0.12}px ${size * 0.4}px rgba(0,112,242,.45)`,
      flex: "none",
      ...style,
    }}
  >
    <Icon name="pulse" size={size * 0.56} />
  </span>
);

/** Full-frame brand backdrop: deep navy with a soft blue glow. */
export const Backdrop: React.FC<{ children?: React.ReactNode; glow?: number }> = ({ children, glow = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      fontFamily: FONT,
      color: "#fff",
      background: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,112,242,${0.28 * glow}) 0%, rgba(11,27,46,0) 70%), linear-gradient(160deg, ${C.navy2} 0%, ${C.navy} 60%)`,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);
