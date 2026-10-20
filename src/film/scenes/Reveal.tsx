// Scene 3a (17.9 – 23.4 s): "That's the reality of a category manager."
// Dana returns among the disconnected pieces; they align into a grid, the
// Promo Pulse name appears, and each piece flies to its place in the app.
import React from "react";
import { AbsoluteFill } from "remotion";
import { DeskScene } from "../Desk";
import { AlertToast, EmailCard, SheetWindow, StoreTask } from "../Fragments";
import { inOut, lerp, p } from "../lib";
import { DISPLAY, F } from "../theme";
import { BEAT } from "../timeline";
import { Mark } from "../Type";
import { RECTS } from "../app/SuggestPage";
import { toScreen } from "../app/Workspace";
import { GRID, productCamera, productRect } from "./Product";

type Frag = {
  key: string;
  w: number;
  around: { x: number; y: number; s: number; r: number };
  cell: { x: number; y: number };
  target: { x: number; y: number }; // page coords of the panel it becomes
  node: React.ReactNode;
};

const CELL_W = 430;

const FRAGS: Frag[] = [
  {
    key: "alert",
    w: 540,
    around: { x: 1150, y: 150, s: 0.9, r: -2 },
    cell: { x: GRID.x, y: GRID.y + 40 },
    target: { x: RECTS.trigger.x + RECTS.trigger.w / 2, y: RECTS.trigger.y + RECTS.trigger.h / 2 },
    node: <AlertToast style={{ position: "relative" }} />,
  },
  {
    key: "email",
    w: 520,
    around: { x: 1260, y: 420, s: 0.9, r: 2 },
    cell: { x: GRID.x + CELL_W + 20, y: GRID.y + 30 },
    target: { x: RECTS.send.x + RECTS.send.w / 2, y: RECTS.send.y + RECTS.send.h / 2 },
    node: (
      <EmailCard
        style={{ position: "relative" }}
        from="Sam Patel · Brightfield Dairy"
        subject="RE: RE: Yogurt promo — 25% off?"
        snippet="We could go to 20% if you take the endcap…"
        replies={9}
        unread
      />
    ),
  },
  {
    key: "sheet",
    w: 560,
    around: { x: 1120, y: 660, s: 0.85, r: -1.5 },
    cell: { x: GRID.x, y: GRID.y + 244 },
    target: { x: RECTS.econ.x + RECTS.econ.w / 2, y: RECTS.econ.y + RECTS.econ.h / 2 },
    node: <SheetWindow style={{ position: "relative" }} rev={2} />,
  },
  {
    key: "store",
    w: 500,
    around: { x: 110, y: 120, s: 0.85, r: 1.5 },
    cell: { x: GRID.x + CELL_W + 20, y: GRID.y + 260 },
    target: { x: RECTS.stores.x + RECTS.stores.w / 2, y: RECTS.stores.y + RECTS.stores.h / 2 },
    node: <StoreTask style={{ position: "relative" }} />,
  },
];

export const Reveal: React.FC<{ T: number }> = ({ T }) => {
  if (T < 17.85 || T > 23.6) return null;
  const inA = p(T, 17.9, 0.6);
  const align = p(T, BEAT.align, 0.9, inOut);
  const land = p(T, 22.45, 0.7, inOut);
  const danaOut = p(T, 20.15, 0.8, inOut);

  const tension = lerp(0.8, 0.55, p(T, 18, 2));
  const look = 2 - 3 * p(T, 18.4, 1.0, inOut);

  // landing positions follow the forming window
  const cam = productCamera(T);
  const rect = productRect(T);

  // logo: centred above the grid, then shrinks into the app's shell bar
  const logoIn = p(T, BEAT.logo, 0.7);
  const logoGo = p(T, 22.5, 0.65, inOut);
  const k = rect.w / 1600;
  const logoX = lerp(960 - 270, rect.x + k * 24, logoGo);
  const logoY = lerp(196, rect.y + k * 14, logoGo);
  const logoS = lerp(1, (32 * k) / 84, logoGo);

  return (
    <AbsoluteFill style={{ opacity: inA }}>
      <AbsoluteFill style={{ opacity: 1 - danaOut }}>
        <DeskScene
          id="reveal"
          pose={{ tension, look, typing: 0.15, blink: 0, rim: 1, time: T }}
          calm={0.1}
          order={0}
          alarm={0.4}
          camera={{ s: 1.2, x: 700 - 430 * 1.2, y: 470 - 250 * 1.2 }}
        />
      </AbsoluteFill>
      {/* clean charcoal stage the pieces align on */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 55%, #141A22 0%, ${F.ink0} 75%)`, opacity: danaOut }} />

      {FRAGS.map((f, i) => {
        const sCell = CELL_W / f.w;
        const tgt = toScreen(cam, f.target.x, f.target.y, rect);
        const delay = i * 0.06;
        const a = p(T, BEAT.align + delay, 0.9, inOut);
        const l = p(T, 22.45 + delay, 0.65, inOut);
        const x0 = lerp(f.around.x, f.cell.x, a);
        const y0 = lerp(f.around.y, f.cell.y, a);
        const s0 = lerp(f.around.s, sCell, a);
        const r0 = lerp(f.around.r, 0, a);
        const s1 = lerp(s0, sCell * 0.35, l);
        const x = lerp(x0, tgt.x - (f.w * s1) / 2, l);
        const y = lerp(y0, tgt.y - 50 * s1, l);
        const settle = Math.sin(T * 1.3 + i) * 4 * (1 - a);
        return (
          <div
            key={f.key}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: f.w,
              transformOrigin: "0 0",
              transform: `translate(${x}px, ${y + settle}px) scale(${s1}) rotate(${r0}deg)`,
              opacity: (0.55 + 0.45 * Math.max(align, 1 - inA)) * (1 - p(T, 22.75 + delay, 0.35)),
              filter: `drop-shadow(0 0 ${18 * a * (1 - l)}px rgba(46,168,255,.25))`,
            }}
          >
            {f.node}
          </div>
        );
      })}

      {/* thin connectors appear once aligned: the pieces belong to one promotion */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: p(T, 20.9, 0.5) * (1 - land) }}>
        {/* one frame around all four pieces: the outline of the workspace to come */}
        <rect
          x={GRID.x - 24}
          y={GRID.y - 4}
          width={GRID.w + 48}
          height={GRID.h + 8}
          rx={22}
          fill="none"
          stroke={F.cyan}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p(T, 20.95, 0.9, inOut)}
          opacity={0.75}
        />
      </svg>

      {/* Promo Pulse name */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          display: "flex",
          alignItems: "center",
          gap: 24,
          transformOrigin: "0 0",
          transform: `translate(${logoX}px, ${logoY}px) scale(${logoS})`,
          opacity: logoIn * (1 - p(T, 22.95, 0.25)),
        }}
      >
        <Mark size={84} draw={p(T, BEAT.logo + 0.15, 0.7)} style={{ transform: `scale(${0.85 + 0.15 * logoIn})` }} />
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 84,
            fontWeight: 650,
            letterSpacing: "-0.03em",
            color: F.white,
            opacity: 1 - logoGo,
            clipPath: `inset(0 ${(1 - p(T, BEAT.logo + 0.25, 0.8)) * 100}% 0 0)`,
            transform: `translateX(${(1 - p(T, BEAT.logo + 0.25, 0.8)) * -16}px)`,
          }}
        >
          Promo Pulse
        </div>
      </div>

    </AbsoluteFill>
  );
};
