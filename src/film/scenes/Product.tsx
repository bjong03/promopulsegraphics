// Scenes 3b–5a (22.4 – 48 s): the Promo Pulse workspace. It forms out of the
// aligned fragments, then a single camera carries one promotion through
// Suggest → Compare → Approve → Execute → record → Monitor, and finally
// strips the interface away for the impact figure.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Camera, HOME, pageX, toScreen, WinRect, Workspace } from "../app/Workspace";
import { EmailCard } from "../Fragments";
import { easeIn, inOut, keys, lerp, p, win } from "../lib";
import { DISPLAY, F, P, UI } from "../theme";
import { BEAT } from "../timeline";
import { Headline, Qualifier } from "../Type";

const E = pageX(1);
const M = pageX(2);

// Camera path in strip coordinates.
const CAM = [
  { at: 22.4, cx: 800, cy: 396, z: 1 },
  { at: 30.0, cx: 800, cy: 396, z: 1 },
  { at: 30.6, cx: 560, cy: 200, z: 1.36 },
  { at: 30.95, cx: 560, cy: 200, z: 1.36 },
  { at: 31.45, cx: 1032, cy: 360, z: 1.42 },
  { at: BEAT.compare + 0.2, cx: 1032, cy: 470, z: 1.36 },
  { at: BEAT.approve, cx: 1032, cy: 470, z: 1.36 },
  { at: BEAT.approve + 0.5, cx: 1032, cy: 560, z: 1.42 },
  { at: BEAT.execute - 0.15, cx: 1032, cy: 560, z: 1.42 },
  { at: BEAT.execute + 0.55, cx: E + 800, cy: 396, z: 1 },
  { at: BEAT.execute + 0.75, cx: E + 800, cy: 396, z: 1 },
  { at: BEAT.execute + 1.15, cx: E + 412, cy: 410, z: 1.3 },
  { at: BEAT.record, cx: E + 412, cy: 410, z: 1.3 },
  { at: BEAT.record + 0.6, cx: E + 1188, cy: 396, z: 1.05 },
  { at: BEAT.noEmails - 0.1, cx: E + 1188, cy: 396, z: 1.05 },
  { at: BEAT.noEmails + 0.5, cx: E + 800, cy: 396, z: 1 },
  { at: 41.6, cx: E + 800, cy: 396, z: 1 },
  { at: BEAT.monitor + 0.2, cx: M + 800, cy: 396, z: 1 },
  { at: BEAT.monitor + 1.4, cx: M + 800, cy: 396, z: 1 },
  { at: BEAT.monitor + 2.0, cx: M + 600, cy: 560, z: 1.25 },
  { at: BEAT.monitor + 2.7, cx: M + 600, cy: 560, z: 1.25 },
  { at: BEAT.monitor + 3.2, cx: M + 1100, cy: 260, z: 1.3 },
  { at: BEAT.scale, cx: M + 1100, cy: 260, z: 1.3 },
  { at: BEAT.scale + 0.7, cx: M + 800, cy: 396, z: 1 },
];

const STAGE_LABELS = [
  { from: 30.1, to: BEAT.approve, text: "SUGGEST" },
  { from: BEAT.approve, to: BEAT.execute, text: "APPROVE" },
  { from: BEAT.execute, to: BEAT.monitor, text: "EXECUTE" },
  { from: BEAT.monitor, to: BEAT.scale + 0.4, text: "MONITOR" },
];
const STEPS = ["DETECT", "RECOMMEND", "APPROVE", "EXECUTE", "MONITOR"];
const stepIndex = (T: number) => (T < 31.0 ? 0 : T < BEAT.approve ? 1 : T < BEAT.execute ? 2 : T < BEAT.monitor ? 3 : 4);

const StageBand: React.FC<{ T: number }> = ({ T }) => {
  const vis = win(T, 29.9, BEAT.scale + 0.5, 0.45);
  const idx = stepIndex(T);
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top: 34, height: 60, display: "flex", alignItems: "center", fontFamily: DISPLAY, opacity: vis }}>
      <div style={{ position: "relative", width: 420, height: 60 }}>
        {STAGE_LABELS.map((s) => {
          const a = p(T, s.from, 0.45);
          const o = p(T, s.to - 0.25, 0.25, easeIn);
          if (a <= 0 || o >= 1) return null;
          return (
            <div key={s.text} style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: F.cyan, opacity: a * (1 - o) }} />
              <span style={{ fontSize: 40, fontWeight: 650, letterSpacing: "0.16em", color: F.white, transform: `translateY(${(1 - a) * 100 - o * 100}%)` }}>{s.text}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, fontSize: 16, fontWeight: 600, letterSpacing: "0.14em" }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i ? <span style={{ width: 26, height: 1, background: "rgba(255,255,255,.25)" }} /> : null}
            <span style={{ color: i === idx ? F.cyan : i < idx ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.32)" }}>{s}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/** Two economic summaries brought forward over the dimmed workspace. */
const Compare: React.FC<{ T: number; cam: Camera }> = ({ T, cam }) => {
  const at = BEAT.compare;
  const out = BEAT.approve - 0.05;
  const vis = win(T, at, out, 0.4);
  if (vis <= 0) return null;
  const tiles = [
    { label: "RETAILER", sub: "Vs no promotion", big: "+$1,716", note: "906 units sold", color: P.accentFill, from: toScreen(cam, 516 + 166, 524) },
    { label: "BRAND", sub: "Brightfield Dairy", big: "+$139", note: "after $373 brand funding", color: P.cpg, from: toScreen(cam, 516 + 510, 524) },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: HOME.x, top: HOME.y + 60, width: HOME.w, height: HOME.h - 60, background: `rgba(9,12,16,${0.74 * vis})`, borderRadius: "0 0 18px 18px" }} />
      {tiles.map((c, i) => {
        const a = p(T, at + 0.05 + i * 0.12, 0.6);
        const o = p(T, out - 0.4, 0.4, easeIn);
        const target = { x: 470 + i * 520, y: 420 };
        const x = lerp(c.from.x - 230, target.x, a);
        const y = lerp(c.from.y - 120, target.y, a) - o * 30;
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 460,
              padding: "26px 30px 28px",
              background: "#FFFFFF",
              borderRadius: 20,
              boxShadow: "0 30px 80px rgba(0,0,0,.45)",
              fontFamily: DISPLAY,
              color: P.ink,
              opacity: a * (1 - o),
              transform: `scale(${0.9 + 0.1 * a})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.16em" }}>{c.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 17, color: P.muted }}>{c.sub}</span>
            </div>
            <div style={{ fontSize: 88, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{c.big}</div>
            <div style={{ fontSize: 19, color: P.muted, marginTop: 6 }}>{c.note}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 470,
          width: 980,
          top: 735,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: DISPLAY,
          opacity: p(T, at + 0.5, 0.4) * (1 - p(T, out - 0.4, 0.4)),
        }}
      >
        <span style={{ fontSize: 21, color: "rgba(255,255,255,.85)" }}>
          Endcap display + 15% off · waste avoided <b style={{ color: "#9BE3B8" }}>336 of 388 units</b>
        </span>
        <span style={{ fontSize: 19, fontWeight: 600, color: "#fff", background: P.accentFill, borderRadius: 10, padding: "10px 18px" }}>Send and auto-approve →</span>
      </div>
    </AbsoluteFill>
  );
};

const Toast: React.FC<{ T: number; from: number; to: number; text: string }> = ({ T, from, to, text }) => {
  const v = win(T, from, to, 0.3);
  if (v <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - 380,
        width: 760,
        top: 860 - (1 - v) * -16,
        background: "#223548",
        color: "#fff",
        borderRadius: 14,
        padding: "16px 20px",
        fontFamily: UI,
        fontSize: 21,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 20px 50px rgba(0,0,0,.35)",
        opacity: v,
      }}
    >
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: P.posFill, display: "grid", placeItems: "center", flex: "none" }}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      {text}
    </div>
  );
};

export const productCamera = (T: number): Camera => keys(T, CAM);

/** Window rect over time: aligned fragment grid → hero size → home. */
export const GRID: WinRect = { x: 520, y: 330, w: 880, h: 468, r: 22 };
const HERO: WinRect = { x: 400, y: 330, w: 1120, h: 596, r: 20 };
/** At "Loblaw scale" the workspace shrinks into one tile of many (see Impact). */
export const TILE: WinRect = { x: 960 - 90, y: 540 - 48, w: 180, h: 96, r: 6 };
export const productRect = (T: number): WinRect => {
  const form = p(T, 22.45, 1.0, inOut);
  const grow = p(T, 26.5, 0.9, inOut);
  const shrink = p(T, BEAT.scale, 0.9, inOut);
  const r = {
    x: lerp(lerp(GRID.x, HERO.x, form), HOME.x, grow),
    y: lerp(lerp(GRID.y, HERO.y, form), HOME.y, grow),
    w: lerp(lerp(GRID.w, HERO.w, form), HOME.w, grow),
    h: lerp(lerp(GRID.h, HERO.h, form), HOME.h, grow),
  };
  return {
    x: lerp(r.x, TILE.x, shrink),
    y: lerp(r.y, TILE.y, shrink),
    w: lerp(r.w, TILE.w, shrink),
    h: lerp(r.h, TILE.h, shrink),
    r: lerp(18, 6, shrink),
  };
};

export const Product: React.FC<{ T: number }> = ({ T }) => {
  if (T < 22.4 || T > 48.2) return null;
  const cam = productCamera(T);

  const rect = productRect(T);
  const content = p(T, 22.55, 0.55);

  // Focus / dimming per beat.
  const suggestFocus =
    T > 25.9 && T < 27.6 ? "econ" : T > 30.1 && T < 30.95 ? "trigger" : T >= 30.95 && T < BEAT.compare ? "options" : T >= BEAT.compare && T < BEAT.approve ? "econ" : T >= BEAT.approve && T < BEAT.execute ? "send" : null;
  const executeFocus = T >= BEAT.execute + 0.75 && T < BEAT.record ? "stores" : T >= BEAT.record && T < BEAT.noEmails ? "record" : null;
  const monitorFocus = T >= BEAT.monitor + 2.0 && T < BEAT.monitor + 2.9 ? "stores" : T >= BEAT.monitor + 2.9 && T < BEAT.scale ? "rec" : null;
  const tab = T < BEAT.execute ? 0 : T < BEAT.monitor ? lerp(0, 1, p(T, BEAT.execute, 0.5, inOut)) : lerp(1, 2, p(T, BEAT.monitor - 0.2, 0.5, inOut));

  // Impact handoff: the window becomes one tile among many, then fades.
  const strip = 0;
  const fadeOut = p(T, BEAT.scale + 1.0, 0.45, easeIn);

  // "No more chasing emails": an old thread collapses into the live status.
  const ghostIn = p(T, BEAT.noEmails + 0.15, 0.45);
  const ghostGo = p(T, BEAT.noEmails + 1.5, 0.7, inOut);
  const tagPos = toScreen(cam, E + 680, 52);

  // window fades in as the fragments land in it
  const appear = p(T, 22.45, 0.35);

  return (
    <AbsoluteFill style={{ opacity: (1 - fadeOut) * appear }}>
      <Workspace
        T={T}
        cam={cam}
        tab={tab}
        focus={{ suggest: suggestFocus, execute: executeFocus, monitor: monitorFocus }}
        strip={strip}
        rect={rect}
        contentOpacity={content}
        chromeOpacity={p(T, 22.7, 0.6)}
        markOpacity={p(T, 23.15, 0.15)}
      />
      <Headline t={T} at={23.75} out={26.6} lines={["From fragmented data", "to better promotions."]} size={60} align="center" accent={1} accentColor={F.white} color={F.mist} style={{ left: 0, right: 0, top: 120 }} />
      <StageBand T={T} />
      <Compare T={T} cam={cam} />
      <Toast T={T} from={BEAT.approve + 1.45} to={BEAT.execute + 0.1} text="Auto-approved under Brightfield Dairy playbook v3 · $373 committed" />
      {ghostIn > 0 && ghostGo < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transformOrigin: "0 0",
            transform: `translate(${lerp(250, tagPos.x - 60, ghostGo)}px, ${lerp(430, tagPos.y - 20, ghostGo)}px) scale(${lerp(1, 0.12, ghostGo)})`,
            opacity: ghostIn * (1 - p(T, BEAT.noEmails + 1.9, 0.3)),
          }}
        >
          <EmailCard style={{ position: "relative" }} from="Regional ops" subject="RE: RE: RE: Where are we on the yogurt promo?" snippet="Has Riverside set up yet? Which version is live?" replies={11} unread />
        </div>
      ) : null}
      {/* the answer: status pill pulses as the thread lands */}
      {T > BEAT.noEmails + 1.9 && T < BEAT.monitor ? (
        <div
          style={{
            position: "absolute",
            left: tagPos.x - 150,
            top: tagPos.y - 22,
            width: 230,
            height: 44,
            borderRadius: 12,
            border: `2px solid ${F.cyan}`,
            opacity: 1 - p(T, BEAT.noEmails + 2.0, 1.0),
            transform: `scale(${1 + 0.15 * p(T, BEAT.noEmails + 1.9, 1.0)})`,
          }}
        />
      ) : null}
      <Qualifier opacity={win(T, 23.5, BEAT.scale + 0.6, 0.5)} style={{ right: 160, top: 96, bottom: "auto", fontSize: 14 }} />
    </AbsoluteFill>
  );
};
