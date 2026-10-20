// Scene 6 (BEAT.calm → end): Dana again, now calm — the opening composition with
// the noise gone — then the end card.
import React from "react";
import { AbsoluteFill } from "remotion";
import { DeskScene } from "../Desk";
import { inOut, lerp, p } from "../lib";
import { DISPLAY, F, P, UI } from "../theme";
import { BEAT } from "../timeline";
import { Mark } from "../Type";

export const Close: React.FC<{ T: number }> = ({ T }) => {
  const C0 = BEAT.calm;
  if (T < C0 - 0.1) return null;
  const inA = p(T, C0 - 0.05, 0.6);
  const t = T - C0;
  const s = lerp(1.3, 1.38, p(T, C0, 3.6, inOut));
  const head = { x: 560, y: 470 };
  const toEnd = p(T, BEAT.endCard, 0.9, inOut);
  const card = p(T, C0 + 1.0, 0.7);

  const word = p(T, BEAT.endCard + 0.35, 0.8);
  const less = p(T, BEAT.tagline, 0.6);
  const smart = p(T, BEAT.tagline + 0.95, 0.6);

  return (
    <AbsoluteFill style={{ opacity: inA }}>
      <AbsoluteFill style={{ opacity: 1 - toEnd }}>
        <DeskScene
          id="close"
          pose={{ tension: 0, look: 0.5, typing: 0.25, blink: t > 1.8 && t < 1.95 ? 1 : 0, rim: 0.7, time: t }}
          calm={1}
          order={1}
          alarm={0}
          camera={{ s, x: head.x - 430 * s, y: head.y - 250 * s }}
        />
        {/* where the noise used to be: one clear status */}
        <div
          style={{
            position: "absolute",
            left: 1330,
            top: 200,
            width: 520,
            background: "#FFFFFF",
            borderRadius: 16,
            padding: "20px 24px",
            fontFamily: UI,
            color: P.ink,
            boxShadow: "0 30px 80px rgba(0,0,0,.5)",
            opacity: card,
            transform: `translateY(${(1 - card) * 16}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mark size={26} />
            <span style={{ fontSize: 16, color: P.muted }}>Promo Pulse · Greek yogurt 500 g</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>Endcap display + 15% off</div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: P.good, background: P.goodSoft, borderRadius: 7, padding: "3px 10px" }}>Approved</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: P.good, background: P.goodSoft, borderRadius: 7, padding: "3px 10px" }}>Live · Day 3 of 5</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: P.accent, background: P.accentSoft, borderRadius: 7, padding: "3px 10px" }}>94% of forecast</span>
          </div>
        </div>
      </AbsoluteFill>

      {/* end card */}
      <AbsoluteFill
        style={{
          opacity: toEnd,
          background: `radial-gradient(ellipse 55% 50% at 50% 46%, #121A23 0%, ${F.ink0} 78%)`,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DISPLAY,
          color: F.white,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(-30px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Mark size={96} draw={p(T, BEAT.endCard + 0.2, 0.9)} style={{ opacity: word }} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 76, fontWeight: 650, letterSpacing: "0.3em", transform: `translateY(${(1 - word) * 100}%)` }}>PROMO PULSE</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 54, fontSize: 46, fontWeight: 400, letterSpacing: "-0.01em" }}>
            <span style={{ opacity: less, transform: `translateY(${(1 - less) * 14}px)` }}>Less waste.</span>
            <span style={{ opacity: smart, transform: `translateY(${(1 - smart) * 14}px)`, color: F.cyan }}>Smarter promotions.</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 44, fontSize: 15, color: "rgba(255,255,255,.4)", letterSpacing: "0.04em", opacity: p(T, BEAT.endCard + 1, 0.6) }}>
          Concept prototype · Sample data
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
