// Monitor tab: the same deal on day 3 of 5 — sales vs forecast, store by
// store, and where action is needed.
import React from "react";
import { p } from "../lib";
import { P, UI } from "../theme";
import { BEAT } from "../timeline";
import { MONITOR, STORES } from "./data";
import { Btn, Card, Tag } from "./ui";

export const MON_RECTS = {
  chart: { x: 32, y: 20, w: 960, h: 470 },
  stores: { x: 32, y: 506, w: 960, h: 266 },
  rec: { x: 1008, y: 20, w: 560, h: 330 },
};

const Chart: React.FC<{ T: number }> = ({ T }) => {
  const W = 900;
  const H = 250;
  const L = 48;
  const B = 34;
  const top = 200;
  const y = (v: number) => 12 + (H - 12 - B) * (1 - v / top);
  const cw = (W - L - 10) / MONITOR.days.length;
  const bw = 64;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: H }}>
      {[0, 50, 100, 150, 200].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - 10} y1={y(v)} y2={y(v)} stroke={P.line} />
          <text x={L - 10} y={y(v) + 5} textAnchor="end" fontSize={14} fill={P.muted} fontFamily={UI}>
            {v}
          </text>
        </g>
      ))}
      {MONITOR.days.map((d, i) => {
        const x = L + cw * i + cw / 2;
        const g = p(T, BEAT.monitor + 0.5 + i * 0.15, 0.6);
        const tk = p(T, BEAT.monitor + 0.3 + i * 0.08, 0.4);
        return (
          <g key={i}>
            {d.a !== null ? (
              <rect x={x - bw / 2} y={y(d.a * g)} width={bw} height={y(0) - y(d.a * g)} rx={5} fill={d.a >= d.f * 0.95 ? P.accentFill : P.critFill} />
            ) : (
              <rect x={x - bw / 2} y={y(d.f)} width={bw} height={y(0) - y(d.f)} rx={5} fill="none" stroke={P.field} strokeDasharray="4 4" opacity={tk} />
            )}
            <line x1={x - bw / 2 - 8} x2={x - bw / 2 - 8 + (bw + 16) * tk} y1={y(d.f)} y2={y(d.f)} stroke={P.ink} strokeWidth={3.5} strokeLinecap="round" />
            <text x={x} y={H - 8} textAnchor="middle" fontSize={15} fill={i === 2 ? P.accent : P.muted} fontWeight={i === 2 ? 700 : 400} fontFamily={UI}>
              Day {i + 1}
            </text>
          </g>
        );
      })}
      <line x1={L} x2={W - 10} y1={y(0)} y2={y(0)} stroke={P.muted} />
    </svg>
  );
};

export const MonitorPage: React.FC<{ T: number; focus: string | null; strip: number }> = ({ T, focus, strip }) => {
  // `strip` (0–1) progressively removes interface detail for the impact scene.
  const dim = (k: string) => (focus && focus !== k ? 0.3 : 1);
  const gone = (order: number) => 1 - p(strip, order * 0.18, 0.3, (x) => x);
  const M = BEAT.monitor;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: UI, color: P.ink }}>
      <Card style={{ position: "absolute", left: 32, top: 20, width: 960, height: 470, opacity: dim("chart") * gone(2) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{MONITOR.head}</div>
            <div style={{ fontSize: 15, color: P.muted }}>{MONITOR.sub}</div>
          </div>
          <Tag tone="info">Sales vs forecast</Tag>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, opacity: gone(0) }}>
          {MONITOR.stats.map((s) => (
            <div key={s.k} style={{ background: P.sunk, borderRadius: 12, padding: "10px 14px", display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 14, color: P.muted }}>{s.k}</span>
              <b style={{ fontSize: 28, fontWeight: 300, color: s.tone === "crit" ? P.warn : s.tone === "good" ? P.good : P.ink }}>{s.v}</b>
              <span style={{ fontSize: 13, color: P.muted }}>{s.s}</span>
            </div>
          ))}
        </div>
        <Chart T={T} />
      </Card>

      <Card style={{ position: "absolute", left: 32, top: 506, width: 960, height: 266, gap: 6, opacity: dim("stores") * gone(1) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <b style={{ fontSize: 19 }}>Stores</b>
          <span style={{ fontSize: 14, color: P.muted }}>Sold against forecast to date · line marks 100%</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 28px" }}>
          {STORES.map((s, i) => {
            const r = s.a / s.f;
            const g = p(T, M + 1.0 + i * 0.1, 0.6);
            const flag = !s.set ? p(T, M + 2.2, 0.4) : 0;
            return (
              <div
                key={s.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr 76px",
                  gap: 12,
                  alignItems: "center",
                  height: 58,
                  padding: "0 8px",
                  borderRadius: 8,
                  background: `rgba(255,234,244,${flag})`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <b style={{ fontSize: 16 }}>{s.n}</b>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.set ? P.good : P.bad }}>{s.set ? "Set up" : "Not set up"}</span>
                </div>
                <div style={{ position: "relative", height: 12, borderRadius: 6, background: P.track }}>
                  <i style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 6, width: `${Math.min(100, (r / 1.2) * 100) * g}%`, background: r >= 0.95 ? P.posFill : r >= 0.8 ? P.accentFill : P.critFill }} />
                  <span style={{ position: "absolute", top: -5, bottom: -5, width: 3, borderRadius: 2, background: P.ink, left: "83.33%" }} />
                </div>
                <span style={{ fontSize: 15, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {s.a} / {s.f}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{ position: "absolute", left: 1008, top: 20, width: 560, height: 330, opacity: dim("rec") * gone(0) }}>
        <b style={{ fontSize: 19 }}>Agent recommendations</b>
        <div style={{ background: P.sunk, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10, outline: `2px solid rgba(0,112,242,${p(T, M + 2.4, 0.4)})` }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: P.accent }}>STORE EXECUTION</span>
          <span style={{ fontSize: 17, lineHeight: 1.4 }}>{MONITOR.rec}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn primary style={{ height: 38, fontSize: 15 }}>Nudge and pause</Btn>
            <Btn style={{ height: 38, fontSize: 15, border: "none", background: "transparent" }}>Dismiss</Btn>
          </div>
        </div>
      </Card>
      <Card style={{ position: "absolute", left: 1008, top: 366, width: 560, height: 200, opacity: dim("rec") * gone(0) }}>
        <b style={{ fontSize: 19 }}>Locked while live</b>
        {["Advertised price, Endcap display + 15% off until the end date", "Brightfield Dairy funding terms", "Printed flyer and shelf signage"].map((x) => (
          <span key={x} style={{ fontSize: 15, color: P.muted, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={P.muted} strokeWidth={2} strokeLinecap="round">
              <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
              <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
            </svg>
            {x}
          </span>
        ))}
      </Card>
    </div>
  );
};
