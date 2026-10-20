// The Promo Pulse application window. Suggest, Execute and Monitor pages sit
// side by side on one strip; a camera (centre + zoom, in strip coordinates)
// pans and pushes across them, so moving between tabs reads as one journey.
import React from "react";
import { interpolate } from "remotion";
import { P, UI } from "../theme";
import { Mark } from "../Type";
import { ExecutePage } from "./ExecutePage";
import { MonitorPage } from "./MonitorPage";
import { SuggestPage } from "./SuggestPage";

export const WINDOW = { x: 160, y: 116, w: 1600, h: 852, shell: 60 };
export const VIEW = { w: WINDOW.w, h: WINDOW.h - WINDOW.shell };
export const PAGE = { w: 1600, h: 792, gap: 700 };
/** x-offset of page i on the strip */
export const pageX = (i: number) => i * (PAGE.w + PAGE.gap);

export type Camera = { cx: number; cy: number; z: number };

export type WinRect = { x: number; y: number; w: number; h: number; r: number };
export const HOME: WinRect = { x: WINDOW.x, y: WINDOW.y, w: WINDOW.w, h: WINDOW.h, r: 18 };

/** Strip coordinates → screen coordinates for a camera and window rect. */
export const toScreen = (cam: Camera, x: number, y: number, rect: WinRect = HOME) => {
  const k = rect.w / WINDOW.w;
  return {
    x: rect.x + k * (VIEW.w / 2 + (x - cam.cx) * cam.z),
    y: rect.y + k * (WINDOW.shell + VIEW.h / 2 + (y - cam.cy) * cam.z),
    k: k * cam.z,
  };
};

const TABS = ["Suggest", "Execute", "Monitor", "Deal room"];
const TAB_X = [0, 118, 238, 360];
const TAB_W = [100, 104, 106, 124];

export const Workspace: React.FC<{
  markOpacity?: number;
  T: number;
  cam: Camera;
  tab: number; // 0..2, may be fractional during a switch
  focus: { suggest: string | null; execute: string | null; monitor: string | null };
  strip?: number; // monitor detail removal for the impact scene
  rect?: WinRect;
  contentOpacity?: number;
  chromeOpacity?: number;
}> = ({ T, cam, tab, focus, strip = 0, rect, contentOpacity = 1, chromeOpacity = 1, markOpacity = 1 }) => {
  const R = rect ?? HOME;
  const ux = interpolate(tab, [0, 1, 2], [TAB_X[0], TAB_X[1], TAB_X[2]]);
  const uw = interpolate(tab, [0, 1, 2], [TAB_W[0], TAB_W[1], TAB_W[2]]);
  const active = Math.round(tab);
  const sx = R.w / WINDOW.w; // window may be animating size during the reveal
  return (
    <div
      style={{
        position: "absolute",
        left: R.x,
        top: R.y,
        width: R.w,
        height: R.h,
        borderRadius: R.r,
        overflow: "hidden",
        background: P.bg,
        boxShadow: "0 40px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06)",
        fontFamily: UI,
        color: P.ink,
      }}
    >
      <div style={{ width: WINDOW.w, height: WINDOW.h, transform: `scale(${sx})`, transformOrigin: "0 0" }}>
        {/* shell bar */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: WINDOW.shell,
            background: P.surface,
            boxShadow: P.shadow,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 14,
            opacity: chromeOpacity,
          }}
        >
          <span style={{ opacity: markOpacity }}>
            <Mark size={32} />
          </span>
          <b style={{ fontSize: 19, fontFamily: UI }}>Promo Pulse</b>
          <span style={{ width: 1, height: 26, background: P.line, margin: "0 6px" }} />
          <span style={{ fontSize: 16, color: P.muted }}>Dairy and chilled · Dana Ortiz</span>
          <div style={{ position: "relative", marginLeft: 48, display: "flex", height: "100%" }}>
            {TABS.map((t, i) => (
              <span
                key={t}
                style={{
                  position: "absolute",
                  left: TAB_X[i],
                  width: TAB_W[i],
                  top: 0,
                  height: WINDOW.shell,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 17,
                  fontWeight: i === active ? 700 : 400,
                  color: i === active ? P.accent : P.ink,
                }}
              >
                {t}
              </span>
            ))}
            <span style={{ position: "absolute", left: ux + 12, width: uw - 24, bottom: 0, height: 3, borderRadius: "3px 3px 0 0", background: P.accent }} />
          </div>
          <span style={{ marginLeft: "auto", fontSize: 15, color: P.muted }}>S/4HANA · CAR · UDF · synced 7:05 am</span>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: P.avatar, color: "#fff", fontSize: 13, fontWeight: 700, display: "grid", placeItems: "center" }}>DO</span>
        </div>
        {/* camera viewport onto the page strip */}
        <div style={{ position: "relative", width: VIEW.w, height: VIEW.h, overflow: "hidden", opacity: contentOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: pageX(3),
              height: PAGE.h,
              transformOrigin: "0 0",
              transform: `translate(${VIEW.w / 2 - cam.cx * cam.z}px, ${VIEW.h / 2 - cam.cy * cam.z}px) scale(${cam.z})`,
            }}
          >
            {[
              <SuggestPage key="s" T={T} focus={focus.suggest} />,
              <ExecutePage key="e" T={T} focus={focus.execute} />,
              <MonitorPage key="m" T={T} focus={focus.monitor} strip={strip} />,
            ].map((pg, i) => (
              <div key={i} style={{ position: "absolute", left: pageX(i), top: 0, width: PAGE.w, height: PAGE.h }}>
                {pg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
