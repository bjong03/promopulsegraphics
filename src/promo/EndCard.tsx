// Closing lockup after the voiceover.
import React from "react";
import { AbsoluteFill } from "remotion";
import { prog, useTime } from "./anim";
import { FONT } from "./theme";
import { Backdrop, Mark } from "./Brand";

export const PromoPulseEnd: React.FC = () => {
  const t = useTime();
  const a = prog(t, 0.1, 0.7);
  const b = prog(t, 0.45, 0.7);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: "#fff" }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: a, transform: `scale(${0.94 + 0.06 * a})` }}>
          <Mark size={110} />
          <span style={{ fontSize: 110, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>Promo Pulse</span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 400, color: "rgba(255,255,255,.8)", opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>
          From at-risk inventory to measurable promotions.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
