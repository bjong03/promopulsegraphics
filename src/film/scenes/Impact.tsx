// Scene 5b (46.2 s → BEAT.calm): "At Loblaw scale, modeled annual value potential
// reaches C$79 million." The one workspace becomes one of many, then gives
// way to a single, still figure. The figure is a modeled full-rollout
// scenario, never an achieved result, and is labelled that way.
import React from "react";
import { AbsoluteFill } from "remotion";
import { easeIn, inOut, p, win } from "../lib";
import { DISPLAY, F } from "../theme";
import { BEAT } from "../timeline";
import { Qualifier } from "../Type";
import { TILE } from "./Product";

const COLS = 9;
const ROWS = 7;

const MiniWorkspace: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <div style={{ position: "absolute", left: x, top: y, width: TILE.w, height: TILE.h, borderRadius: 6, background: "#C9D0D8", opacity: o, overflow: "hidden" }}>
    <div style={{ height: 12, background: "#FFFFFF" }} />
    <div style={{ display: "flex", gap: 6, padding: 8 }}>
      <div style={{ width: 44, height: 56, borderRadius: 3, background: "#FFFFFF" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 24, borderRadius: 3, background: "#FFFFFF" }} />
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 26 }}>
          {[18, 20, 17, 22, 19].map((h, i) => (
            <i key={i} style={{ width: 10, height: h, background: i < 3 ? "#0070F2" : "#BCC3CA", borderRadius: 1 }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const Impact: React.FC<{ T: number }> = ({ T }) => {
  if (T < BEAT.scale || T > BEAT.calm + 0.35) return null;
  const field = win(T, BEAT.scale + 0.55, BEAT.figure + 0.2, 0.45);
  const fig = p(T, BEAT.figure, 0.9);
  const sub = p(T, BEAT.figure + 0.55, 0.7);
  const ctx = p(T, BEAT.figure + 0.9, 0.7);
  const out = p(T, BEAT.calm - 0.15, 0.45, easeIn);
  const rule = p(T, BEAT.figure + 0.2, 0.8, inOut);

  const gx = 200;
  const gy = 112;
  const ox = 960 - 90 - 4 * gx;
  const oy = 540 - 48 - 3 * gy;

  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 50%, #10161D 0%, ${F.ink0} 80%)`, opacity: p(T, BEAT.scale + 0.3, 0.6) }} />
      {/* the same workspace, repeated: every category, every store */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        if (c === 4 && r === 3) return null; // the original sits here
        const d = Math.hypot(c - 4, r - 3);
        const a = p(T, BEAT.scale + 0.55 + d * 0.07, 0.4);
        return <MiniWorkspace key={i} x={ox + c * gx} y={oy + r * gy} o={a * field * (0.3 - d * 0.03)} />;
      })}

      {/* the figure */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, color: F.white }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 120 * rule, height: 2, background: F.cyan, marginBottom: 46 }} />
          <div style={{ overflow: "hidden", paddingBottom: 12 }}>
            <div
              style={{
                fontSize: 250,
                fontWeight: 250,
                letterSpacing: `${-0.045 + 0.01 * (1 - fig)}em`,
                lineHeight: 0.95,
                transform: `translateY(${(1 - fig) * 40}%)`,
                opacity: fig,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ color: F.mist, fontWeight: 200 }}>≈ </span>C$79M
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.22em", marginTop: 26, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)` }}>
            MODELED ANNUAL VALUE POTENTIAL
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "0.18em", color: F.mist, marginTop: 14, opacity: ctx }}>FULL-ROLLOUT SCENARIO · LOBLAW SCALE</div>
        </div>
      </AbsoluteFill>
      <Qualifier opacity={ctx} text="Modeled estimate from the Promo Pulse business case · not an achieved result" />
    </AbsoluteFill>
  );
};
