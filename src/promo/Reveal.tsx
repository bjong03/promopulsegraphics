// Product reveal: "Meet Promo Pulse: an SAP-powered solution that turns
// at-risk inventory into actionable, measurable promotions."
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { easeOut, prog, useTime } from "./anim";
import { Backdrop, Mark } from "./Brand";
import { C, FONT } from "./theme";

// A heartbeat line across the frame; its spike sits where the mark lands.
const PULSE_PATH = "M0,540 L620,540 L700,540 L740,470 L800,640 L850,420 L900,540 L1920,540";

const TAGLINE: { w: string; hi?: boolean }[] = [
  { w: "Turn" },
  { w: "at-risk" },
  { w: "inventory" },
  { w: "into" },
  { w: "actionable,", hi: true },
  { w: "measurable", hi: true },
  { w: "promotions.", hi: true },
];

export const RevealContent: React.FC<{ tagline?: boolean; start?: number }> = ({ tagline = true, start = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTime() - start;

  const markSpring = spring({ frame: frame - (start + 0.55) * fps, fps, config: { damping: 14, mass: 0.7 } });
  const word = prog(t, 0.85, 0.7);
  const sap = prog(t, 1.6, 0.6);
  // Lockup rises to make room for the tagline.
  const lift = tagline ? prog(t, 2.5, 0.8) : 0;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${80 - lift * 150}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Mark size={150} style={{ transform: `scale(${markSpring})`, opacity: Math.min(1, markSpring * 2) }} />
          <div style={{ overflow: "hidden", paddingBottom: 10 }}>
            <div
              style={{
                fontSize: 150,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                transform: `translateX(${(1 - word) * -60}px)`,
                opacity: word,
                clipPath: `inset(0 ${(1 - word) * 100}% 0 0)`,
              }}
            >
              Promo Pulse
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 34,
            fontSize: 30,
            fontWeight: 400,
            color: "rgba(255,255,255,.75)",
            opacity: sap,
            transform: `translateY(${(1 - sap) * 12}px)`,
          }}
        >
          <span>Powered by</span>
          <Img src={staticFile("images/sap-logo.png")} style={{ height: 44 }} />
          <span style={{ width: 1, height: 30, background: "rgba(255,255,255,.3)", margin: "0 6px" }} />
          <span>S/4HANA · CAR · UDF</span>
        </div>
      </div>
      {tagline ? (
        <div
          style={{
            position: "absolute",
            top: 680,
            left: 160,
            right: 160,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 18px",
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
          }}
        >
          {TAGLINE.map((x, i) => {
            const p = prog(t, 2.9 + i * 0.22, 0.6);
            const hi = x.hi ? prog(t, 2.9 + i * 0.22 + 0.25, 0.5) : 0;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px)`,
                  color: x.hi ? `rgb(${interpolate(hi, [0, 1], [255, 124])},${interpolate(hi, [0, 1], [255, 196])},255)` : "#fff",
                }}
              >
                {x.w}
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const PromoPulseReveal: React.FC = () => {
  const t = useTime();
  const draw = prog(t, 0.05, 0.9, easeOut);
  const lineFade = 1 - prog(t, 0.75, 0.5);
  const evolved = evolvePath(draw, PULSE_PATH);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: "#fff" }}>
      <Backdrop glow={prog(t, 0, 1.5)} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: lineFade }}>
        <path
          d={PULSE_PATH}
          fill="none"
          stroke={C.accentFill}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
          style={{ filter: "drop-shadow(0 0 12px rgba(0,112,242,.9))" }}
        />
      </svg>
      <RevealContent />
    </AbsoluteFill>
  );
};
