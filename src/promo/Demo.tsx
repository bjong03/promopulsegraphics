// Product demo: the prototype's UI in an app window, with camera moves,
// captions and toasts timed to the voiceover beats in timing.ts.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { enter, keyframes, prog, useTime } from "./anim";
import { PAGE_WIDTH, Rail, ShellBar, WorkspaceHeader } from "./AppFrame";
import { Backdrop } from "./Brand";
import { Icon } from "./icons";
import { MonitorView } from "./MonitorView";
import { KpiRow, SuggestView } from "./SuggestView";
import { C, FONT, SHADOW2 } from "./theme";
import { BEATS, DEMO_DURATION } from "./timing";

// Window geometry on the 1920×1080 canvas.
const WIN = { x: 60, y: 36, w: 1800, h: 900, bar: 40 };
const VIEW_W = WIN.w;
const VIEW_H = WIN.h - WIN.bar;
const FIT = VIEW_W / PAGE_WIDTH;

const B = BEATS;

// Camera: centre point on the page (cx, cy) and zoom (z, 1 = page fits width).
const CAMERA = [
  { at: 0, cx: 800, cy: 380, z: 1 },
  { at: 1.4, cx: 800, cy: 380, z: 1 },
  { at: 2.6, cx: 780, cy: 620, z: 1.1 },
  { at: B.recommend, cx: 780, cy: 620, z: 1.1 },
  { at: B.recommend + 0.7, cx: 1070, cy: 1000, z: 1.6 },
  { at: B.approve, cx: 1070, cy: 1000, z: 1.6 },
  { at: B.approve + 0.7, cx: 1070, cy: 1370, z: 1.6 },
  { at: B.track - 0.2, cx: 1070, cy: 1370, z: 1.6 },
  { at: B.track + 0.5, cx: 800, cy: 520, z: 1 },
  { at: B.track + 0.9, cx: 800, cy: 520, z: 1 },
  { at: B.track + 1.8, cx: 640, cy: 800, z: 1.3 },
  { at: B.act, cx: 640, cy: 800, z: 1.3 },
  { at: B.act + 0.7, cx: 1100, cy: 770, z: 1.6 },
  { at: B.act + 3.0, cx: 1100, cy: 770, z: 1.6 },
  { at: B.act + 3.8, cx: 800, cy: 760, z: 1 },
];

export const CAPTIONS = [
  { at: B.identify, text: "Identifies at-risk products" },
  { at: B.recommend, text: "Recommends promotions with clear financial rationale" },
  { at: B.approve, text: "Streamlines brand approvals and store readiness" },
  { at: B.track, text: "Tracks promotion performance and execution" },
  { at: B.act, text: "Shows Dana what’s working and where to act" },
];

const Toast: React.FC<{ t: number; from: number; to: number; text: string; action?: string }> = ({ t, from, to, text, action }) => {
  const inP = prog(t, from, 0.35);
  const outP = prog(t, to - 0.3, 0.3);
  if (inP <= 0 || outP >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 36,
        width: 780,
        marginLeft: -390,
        background: C.toastBg,
        color: "#fff",
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: SHADOW2,
        display: "flex",
        gap: 14,
        alignItems: "center",
        fontSize: 22,
        opacity: inP * (1 - outP),
        transform: `translateY(${(1 - inP) * 14 + outP * 8}px)`,
      }}
    >
      <Icon name="check" size={26} color={C.posFill} />
      <span style={{ flex: 1 }}>{text}</span>
      {action ? <b style={{ color: C.toastLink, whiteSpace: "nowrap" }}>{action}</b> : null}
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const idx = CAPTIONS.reduce((acc, c, i) => (t >= c.at ? i : acc), 0);
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        right: WIN.x,
        top: WIN.y + WIN.h + 26,
        height: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 40,
        ...enter(t, 0.2, 0.5, 10),
      }}
    >
      <div style={{ position: "relative", flex: 1, height: 60 }}>
        {CAPTIONS.map((c, i) => {
          const next = CAPTIONS[i + 1]?.at ?? DEMO_DURATION + 1;
          const inP = prog(t, c.at + (i === 0 ? 0.2 : 0), 0.45);
          const outP = prog(t, next - 0.05, 0.3);
          if (inP <= 0 || outP >= 1) return null;
          return (
            <div
              key={c.text}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: inP * (1 - outP),
                transform: `translateY(${(1 - inP) * 18 - outP * 12}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#7CC4FF",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: ".06em",
                }}
              >
                0{i + 1}
              </span>
              <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.01em" }}>{c.text}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {CAPTIONS.map((c, i) => {
          const next = CAPTIONS[i + 1]?.at ?? DEMO_DURATION;
          const fill = interpolate(t, [c.at, next], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={i} style={{ width: 56, height: 5, borderRadius: 3, background: "rgba(255,255,255,.18)", overflow: "hidden" }}>
              <i style={{ display: "block", height: "100%", width: `${fill * 100}%`, background: i === idx ? "#7CC4FF" : "rgba(255,255,255,.55)" }} />
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const PromoPulseDemo: React.FC<{ showCaptions: boolean }> = ({ showCaptions }) => {
  const t = useTime();
  const cam = keyframes(t, CAMERA);
  const S = FIT * cam.z;
  const tx = VIEW_W / 2 - cam.cx * S;
  const ty = VIEW_H / 2 - cam.cy * S;
  const tabSwitch = prog(t, B.track + 0.15, 0.4);
  const monitor = prog(t, B.track + 0.2, 0.4);
  const win = prog(t, 0, 0.8);
  // Captions take the band under the window; without them the window grows to fill it.
  const winH = showCaptions ? WIN.h : 1080 - 2 * WIN.y;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: "#fff" }}>
      <Backdrop glow={0.6} />
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: winH,
          borderRadius: 14,
          overflow: "hidden",
          background: C.bg,
          boxShadow: "0 30px 80px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08)",
          fontFamily: FONT,
          color: C.ink,
          fontSize: 14,
          lineHeight: 1.45,
          opacity: win,
          transform: `scale(${0.96 + 0.04 * win})`,
        }}
      >
        {/* window title bar */}
        <div style={{ height: WIN.bar, background: "#E9ECEF", display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid #DADDE1" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <i key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "inline-block" }} />
          ))}
          <span style={{ flex: 1, textAlign: "center", fontSize: 13, color: C.muted, marginRight: 52 }}>Promo Pulse · SAP Fiori launchpad</span>
        </div>
        {/* viewport */}
        <div style={{ position: "relative", width: VIEW_W, height: winH - WIN.bar, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: PAGE_WIDTH,
              transformOrigin: "0 0",
              transform: `translate(${tx}px, ${ty}px) scale(${S})`,
              background: C.bg,
              paddingBottom: 400,
            }}
          >
            <ShellBar />
            <div style={{ display: "grid", gridTemplateColumns: "60px minmax(0,1fr)", gap: 16, width: 1480, margin: "16px auto 0" }}>
              <Rail active={tabSwitch < 0.5 ? 0 : 2} />
              <main style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                <WorkspaceHeader tabSwitch={tabSwitch} />
                <KpiRow t={t} />
                <div style={{ position: "relative" }}>
                  <div style={{ opacity: 1 - monitor }}>
                    <SuggestView t={t} />
                  </div>
                  {monitor > 0 ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: monitor }}>
                      <MonitorView t={t} />
                    </div>
                  ) : null}
                </div>
              </main>
            </div>
          </div>
          <Toast
            t={t}
            from={B.approve + 3.0}
            to={B.track + 0.3}
            text="Auto-approved under Brightfield Dairy playbook v3 · $373 committed"
            action="Launch now"
          />
          <Toast t={t} from={B.act + 2.75} to={DEMO_DURATION + 1} text="Done: nudged Riverside; replenishment paused until set-up" />
        </div>
      </div>
      {showCaptions ? <Captions t={t} /> : null}
    </AbsoluteFill>
  );
};
