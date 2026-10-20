// "...the retail data she already has": existing SAP sources feed the
// workspace while it takes its hero position (22.9 – 25.6 s).
import React from "react";
import { AbsoluteFill } from "remotion";
import { p, win } from "../lib";
import { DISPLAY, F } from "../theme";
import { productRect } from "./Product";

const SOURCES = [
  { k: "S/4HANA", d: "Stock & best-before" },
  { k: "CAR", d: "Store sales" },
  { k: "UDF", d: "Demand forecast" },
];

export const DataFeed: React.FC<{ T: number }> = ({ T }) => {
  const v = win(T, 22.9, 25.7, 0.4);
  if (v <= 0) return null;
  const r = productRect(T);
  return (
    <AbsoluteFill style={{ opacity: v }}>
      {SOURCES.map((s, i) => {
        const y = r.y + r.h * (0.3 + i * 0.2);
        const a = p(T, 23.0 + i * 0.15, 0.5);
        const flow = p(T, 23.2 + i * 0.15, 0.7);
        return (
          <React.Fragment key={s.k}>
            <div
              style={{
                position: "absolute",
                left: 110,
                top: y - 30,
                width: 210,
                fontFamily: DISPLAY,
                opacity: a,
                transform: `translateX(${(1 - a) * -20}px)`,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 650, color: F.white, letterSpacing: "0.02em" }}>{s.k}</div>
              <div style={{ fontSize: 16, color: F.mist }}>{s.d}</div>
            </div>
            <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
              <path d={`M 300 ${y} L ${r.x - 6} ${y}`} stroke={F.cyan} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - flow} opacity={0.8} />
              <circle cx={r.x - 6} cy={y} r={5} fill={F.cyan} opacity={flow} />
            </svg>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
