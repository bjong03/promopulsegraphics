// Scene 2 (12.6 – 18.6 s): why the delay matters. The yogurt from the alert
// becomes a product on a chilled shelf; its selling window shrinks as the
// alert arrives late.
import React from "react";
import { AbsoluteFill } from "remotion";
import { easeIn, inOut, lerp, p } from "../lib";
import { ShelfArt, ShelfDefs, Tub } from "../Shelf";
import { DISPLAY, F } from "../theme";
import { BEAT } from "../timeline";
import { Headline, Qualifier } from "../Type";

export const ShelfScene: React.FC<{ T: number }> = ({ T }) => {
  if (T < 12.45 || T > 18.8) return null;
  const inA = p(T, 12.45, 0.3);
  // camera: start tight on the tub (matching the glyph), pull back, then drift.
  const pull = p(T, 12.55, 1.3, inOut);
  const s = lerp(2.6, 1.0, pull) * (1 + 0.03 * p(T, 14, 4.5, (x) => x));
  const focus = { x: 960, y: 590 };
  const cx = 960 - focus.x * s;
  const cy = 540 - focus.y * s;
  const dim = p(T, BEAT.shelfFocus, 0.8);
  const out = p(T, 18.0, 0.6, easeIn);

  // Selling window: 9 days at best-before; the late alert takes 3 of them.
  const lose = p(T, 15.2, 1.4, inOut);
  const daysLeft = Math.round(lerp(9, 6, lose));

  const card = p(T, BEAT.shelfFocus + 0.3, 0.6);
  const link = p(T, 14.6, 0.7);

  return (
    <AbsoluteFill style={{ opacity: inA * (1 - out), background: "#090C10" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <ShelfDefs />
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <ShelfArt dim={dim} />
          {/* focus product: lit, with a soft cool spotlight */}
          <ellipse cx={960} cy={560} rx={150} ry={150} fill="#2EA8FF" opacity={0.1 * dim} />
          <Tub x={960} y={640} s={1.35} band={F.cyan} />
          <rect x={898} y={652} width={124} height={26} rx={6} fill={F.coral} opacity={dim} />
          <text x={960} y={670} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff" fontFamily={DISPLAY} opacity={dim} letterSpacing="0.08em">
            AT RISK
          </text>
        </g>
      </svg>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 52%, rgba(0,0,0,0) 45%, rgba(0,0,0,.7) 100%)" }} />

      {/* product card + selling window */}
      <div
        style={{
          position: "absolute",
          left: 1140,
          top: 330,
          width: 600,
          fontFamily: DISPLAY,
          color: F.white,
          opacity: card,
          transform: `translateX(${(1 - card) * 30}px)`,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.18em", color: F.coral }}>AT RISK · 388 UNITS</div>
        <div style={{ fontSize: 46, fontWeight: 650, letterSpacing: "-0.02em", marginTop: 8 }}>Greek yogurt 500 g</div>
        <div style={{ fontSize: 20, color: F.mist, marginTop: 4 }}>Best-before Oct 27 · sales 31% below plan</div>

        <div style={{ marginTop: 40, fontSize: 16, fontWeight: 600, letterSpacing: "0.16em", color: F.mist }}>SELLING WINDOW</div>
        <div style={{ position: "relative", height: 14, marginTop: 14, borderRadius: 7, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
          <i style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(3 / 9) * 100 * lose}%`, background: `repeating-linear-gradient(135deg, ${F.amber} 0 6px, rgba(232,160,74,.35) 6px 12px)` }} />
          <i style={{ position: "absolute", left: `${(3 / 9) * 100 * lose}%`, right: 0, top: 0, bottom: 0, background: "#E8EDF2", borderRadius: 7 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 17, color: F.mist }}>
          <span>Today</span>
          <span>Best-before</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 22 }}>
          <span style={{ fontSize: 76, fontWeight: 300, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{daysLeft}</span>
          <span style={{ fontSize: 22, color: F.mist }}>days left to sell</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 18, color: F.amber, opacity: lose }}>3 days lost waiting on a late alert</div>
      </div>

      {/* subtle thread back to Dana's report */}
      <div style={{ position: "absolute", left: 140, top: 150, fontFamily: DISPLAY, opacity: link * (1 - p(T, 17.4, 0.4)) * 0.9 }}>
        <div style={{ fontSize: 14, letterSpacing: "0.16em", color: F.mist }}>WEEKLY INVENTORY REPORT · MON 6:00 AM</div>
        <div style={{ display: "flex", gap: 30, marginTop: 10, fontSize: 19, color: "#FFD9CF", background: "rgba(232,111,85,.14)", padding: "8px 14px", borderRadius: 8 }}>
          <span>Greek yogurt 500 g</span>
          <span>1,180</span>
          <span>Oct 27</span>
          <span style={{ color: F.coral }}>−31%</span>
        </div>
      </div>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: link * (1 - p(T, 17.4, 0.4)) }}>
        <path d="M 560 214 C 760 250 860 380 930 470" fill="none" stroke={F.coral} strokeWidth={1.5} strokeDasharray="4 6" pathLength={1} strokeDashoffset={0} opacity={0.6} />
      </svg>

      <Headline t={T} at={14.0} out={17.9} lines={["EVERY DAY OF DELAY", "IS A DAY LESS TO SELL."]} size={52} accent={1} accentColor={F.amber} style={{ left: 140, top: 760 }} />
      <Qualifier opacity={card * 0.9} text="Illustrative · Sample data" />
    </AbsoluteFill>
  );
};
